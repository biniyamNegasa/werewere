require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  test "should have many messages" do
    user = create(:user)

    create_list(:message, 2, user: user)

    assert_equal 2, user.messages.count
  end

  test "should have many chats through participants" do
    user = create(:user)

    chat1 = create(:chat)
    chat2 = create(:chat)

    create(:participant, user: user, chat: chat1)
    create(:participant, user: user, chat: chat2)

    assert_equal 2, user.chats.count
    assert_includes user.chats, chat1
  end

  test "status enum should work correctly" do
    user = create(:user)

    assert user.offline? # The enum makes 'offline?' return true if status is not 'online'
    assert_not user.online?

    user.online!

    assert user.online?
    assert_not user.offline?
    assert_equal "online", user.status # You can also check the string value
  end
end
