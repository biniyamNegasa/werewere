require 'rails_helper'

RSpec.describe ChatChannel, type: :channel do
  let(:user_a) { create(:user) }
  let(:user_b) { create(:user) }
  let(:chat) { create(:chat, chat_type: :direct_chat) }

  before do
    create(:participant, user: user_a, chat: chat)
    create(:participant, user: user_b, chat: chat)
    stub_connection current_user: user_a
  end

  describe "#subscribed" do
    it "streams the chat for participants" do
      subscribe(id: chat.id)

      expect(subscription).to be_confirmed
      expect(subscription).to have_stream_from("chat_channel_#{chat.id}")
    end

    it "rejects non-participants" do
      outsider_chat = create(:chat)

      subscribe(id: outsider_chat.id)

      expect(subscription).to be_rejected
    end

    it "rejects unknown chats" do
      subscribe(id: -1)

      expect(subscription).to be_rejected
    end
  end

  describe "#speak" do
    before { subscribe(id: chat.id) }

    it "persists the message and broadcasts it to the chat" do
      expect {
        perform :speak, "message" => "hello there"
      }.to change(chat.messages, :count).by(1)
        .and have_broadcasted_to("chat_channel_#{chat.id}").with { |data|
          expect(data["type"]).to eq("new_message")
          expect(data["message"]["body"]).to eq("hello there")
          expect(data["message"]["user_id"]).to eq(user_a.id)
        }
    end

    it "ignores blank messages" do
      expect {
        perform :speak, "message" => "   "
      }.not_to change(Message, :count)
    end

    it "refuses to deliver into a blocked conversation (either direction)" do
      create(:contact, user: user_b, contact: user_a, status: :blocked)

      expect {
        perform :speak, "message" => "hello?"
      }.not_to change(Message, :count)
    end

    it "bumps the chat's updated_at so the chat list reorders" do
      chat.update_column(:updated_at, 1.day.ago)

      perform :speak, "message" => "bump"

      expect(chat.reload.updated_at).to be > 1.minute.ago
    end
  end
end
