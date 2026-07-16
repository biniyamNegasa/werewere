require 'rails_helper'

RSpec.describe "Participants", type: :request do
  let(:user_a) { create(:user) }
  let(:user_b) { create(:user) }
  let(:chat) { create(:chat, chat_type: :direct_chat) }

  before do
    create(:participant, user: user_a, chat: chat)
    create(:participant, user: user_b, chat: chat)
    sign_in user_a
  end

  describe "PATCH /participants/update_last_read" do
    it "marks the other user's messages read and responds with no content" do
      message = create(:message, chat: chat, user: user_b)
      own_message = create(:message, chat: chat, user: user_a)

      patch update_last_read_participants_path, params: { chat_id: chat.id }

      expect(response).to have_http_status(:no_content)
      expect(message.reload.read_at).to be_present
      expect(own_message.reload.read_at).to be_nil
      expect(chat.participants.find_by(user: user_a).last_read_at).to be_present
    end

    it "rejects a chat the user does not participate in" do
      foreign_chat = create(:chat)

      patch update_last_read_participants_path, params: { chat_id: foreign_chat.id }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
