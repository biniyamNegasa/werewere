require 'rails_helper'

RSpec.describe AppearanceChannel, type: :channel do
  let(:user) { create(:user) }
  let(:contact_user) { create(:user) }
  let(:stranger) { create(:user) }

  before do
    create(:contact, user: user, contact: contact_user, status: :accepted)
    stub_connection current_user: user
  end

  it "marks the user online and streams only known users' presence" do
    subscribe

    expect(subscription).to be_confirmed
    expect(user.reload.status).to eq("online")
    expect(subscription).to have_stream_from("presence:#{contact_user.id}")
    expect(subscription).not_to have_stream_from("presence:#{stranger.id}")
  end

  it "streams presence of chat partners who are not contacts" do
    chat = create(:chat, chat_type: :direct_chat)
    create(:participant, user: user, chat: chat)
    create(:participant, user: stranger, chat: chat)

    subscribe

    expect(subscription).to have_stream_from("presence:#{stranger.id}")
  end

  it "transmits an initial presence snapshot" do
    subscribe

    snapshot = transmissions.find { |t| t["type"] == "presence_snapshot" }
    expect(snapshot).to be_present
    expect(snapshot["users"].map { |u| u["id"] }).to include(contact_user.id)
  end

  it "marks the user offline on unsubscribe" do
    subscribe
    subscription.unsubscribe_from_channel

    expect(user.reload.status).to eq("offline")
    expect(user.last_seen_at).to be_present
  end
end
