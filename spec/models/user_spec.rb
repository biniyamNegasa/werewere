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

  describe ".from_omniauth" do
    def auth_hash(provider: "github", uid: "12345", email: "oauth@example.com", nickname: "octocat", name: nil)
      OmniAuth::AuthHash.new(
        provider: provider,
        uid: uid,
        info: { email: email, nickname: nickname, name: name }
      )
    end

    it "creates a new user from the auth payload" do
      user = User.from_omniauth(auth_hash)

      expect(user).to be_persisted
      expect(user.username).to eq("octocat")
      expect(user.provider).to eq("github")
      expect(user.uid).to eq("12345")
    end

    it "finds the same user again by provider and uid" do
      first = User.from_omniauth(auth_hash)

      expect(User.from_omniauth(auth_hash(email: "changed@example.com"))).to eq(first)
    end

    it "links the provider to an existing account with the same email" do
      existing = create(:user, email: "oauth@example.com")

      user = User.from_omniauth(auth_hash)

      expect(user).to eq(existing)
      expect(user.reload.provider).to eq("github")
    end

    it "sanitizes display names into valid usernames" do
      user = User.from_omniauth(auth_hash(nickname: nil, name: "Ada Lovelace-Byron Jr."))

      expect(user).to be_persisted
      expect(user.username).to match(/\A[a-zA-Z0-9_]+\z/)
    end

    it "handles a payload with no nickname or name" do
      user = User.from_omniauth(auth_hash(nickname: nil, name: nil))

      expect(user).to be_persisted
      expect(user.username).to be_present
    end

    it "deduplicates usernames that are already taken" do
      create(:user, username: "octocat")

      user = User.from_omniauth(auth_hash)

      expect(user).to be_persisted
      expect(user.username).not_to eq("octocat")
      expect(user.username).to start_with("octocat")
    end

    it "never picks a reserved username" do
      user = User.from_omniauth(auth_hash(nickname: "admin"))

      expect(user).to be_persisted
      expect(User::RESERVED_USERNAMES).not_to include(user.username)
    end
  end
end
