require 'rails_helper'

RSpec.describe ChatService do
  subject(:service) { described_class.new }

  let(:user_a) { create(:user) }
  let(:user_b) { create(:user) }

  describe "#find_or_create_direct_chat" do
    it "creates a direct chat with both participants" do
      chat = service.find_or_create_direct_chat(user_a, user_b)

      expect(chat).to be_persisted
      expect(chat.users).to contain_exactly(user_a, user_b)
    end

    it "returns the existing chat instead of creating a duplicate" do
      existing = service.find_or_create_direct_chat(user_a, user_b)

      expect {
        expect(service.find_or_create_direct_chat(user_a, user_b)).to eq(existing)
      }.not_to change(Chat, :count)
    end

    it "refuses a chat with oneself" do
      expect(service.find_or_create_direct_chat(user_a, user_a)).to be_nil
    end

    it "refuses when the recipient has blocked the initiator" do
      create(:contact, user: user_b, contact: user_a, status: :blocked)

      expect(service.find_or_create_direct_chat(user_a, user_b)).to be_nil
    end

    it "refuses when the initiator has blocked the recipient" do
      create(:contact, user: user_a, contact: user_b, status: :blocked)

      expect(service.find_or_create_direct_chat(user_a, user_b)).to be_nil
    end
  end
end
