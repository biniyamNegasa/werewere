require "test_helper"

class ChatTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  test "should have many users through participants" do
    chat = create(:chat)
    user1 = create(:user)
    user2 = create(:user)

    create(:participant, user: user1, chat: chat)
    create(:participant, user: user2, chat: chat)

    assert_equal 2, chat.users.count
    assert_includes chat.users, user1
  end

  test "chat_type enum should work correctly" do
    chat = create(:chat)

    assert chat.direct_chat?
    assert_not chat.group_chat?

    chat.group_chat!

    assert chat.group_chat?
    assert_not chat.direct_chat?
    assert_equal "group_chat", chat.chat_type
  end

  test "messages should be ordered by creation date (oldest first)" do 
    chat = create(:chat)

    message_today = create(:message, chat: chat, created_at: Time.current)
    message_yesterday = create(:message, chat: chat, created_at: 1.day.ago)

    ordered_messages = chat.messages


    assert_equal message_yesterday, ordered_messages.first
    assert_equal message_today, ordered_messages.last
  end

end
