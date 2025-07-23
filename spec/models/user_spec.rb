require 'rails_helper'

RSpec.describe User, type: :model do
  it "has many messages" do
    user = create(:user)
    create_list(:message, 2, user: user)

    expect(user.messages.count).to eq 2
  end

  it "has many chats through participants" do
    user = create(:user)
    chat1 = create(:chat)
    chat2 = create(:chat)

    create(:participant, user: user, chat: chat1)
    create(:participant, user: user, chat: chat2)

    expect(user.chats.count).to eq 2
    expect(user.chats).to include chat1
  end

  it "has enum status" do
    user = create(:user)

    expect(user.offline?).to be true # The enum makes 'offline?' return true if status is not 'online'
    expect(user.online?).to be false

    user.online!

    expect(user.online?).to be true
    expect(user.offline?).to be false
    expect(user.status).to eq "online" # You can also check the string value
  end
end
