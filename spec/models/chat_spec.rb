require 'rails_helper'

RSpec.describe Chat, type: :model do
  it "has many users through participants" do
    chat = create(:chat)
    user1 = create(:user)
    user2 = create(:user)

    create(:participant, user: user1, chat: chat)
    create(:participant, user: user2, chat: chat)

    expect(chat.users.count).to eq 2
    expect(chat.users).to include user1
  end

  it "has enum chat_type" do
    chat = create(:chat)

    expect(chat.direct_chat?).to be true
    expect(chat.group_chat?).to be false

    chat.group_chat!

    expect(chat.group_chat?).to be true
    expect(chat.direct_chat?).to be false
    expect(chat.chat_type).to eq "group_chat"
  end

  it "shows messages ordered by creation date (oldest first)" do 
    chat = create(:chat)

    message_today = create(:message, chat: chat, created_at: Time.current)
    message_yesterday = create(:message, chat: chat, created_at: 1.day.ago)

    ordered_messages = chat.messages


    expect(ordered_messages.first).to eq message_yesterday
    expect(ordered_messages.last).to eq message_today
  end
end
