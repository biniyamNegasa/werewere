require "test_helper"

class ChatCreationTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @other_user = create(:user)
  end

  test "should create a new direct chat if one does not exist" do
    assert_difference("Chat.count", 1) do
      ChatService.new.find_or_create_direct_chat(@user, @other_user)
    end


    new_chat = Chat.last

    assert new_chat.direct_chat?
    assert_equal 2, new_chat.participants.count
    assert_includes new_chat.users, @user
    assert_includes new_chat.users, @other_user
  end


  test "should return an existing direct chat if one already exists" do
    existing_chat = ChatService.new.find_or_create_direct_chat(@user, @other_user)

    assert_no_difference("Chat.count") do
      retrieved_chat = ChatService.new.find_or_create_direct_chat(@user, @other_user)

      assert_equal existing_chat, retrieved_chat
    end
  end

  test "should NOT create a chat if the recipient has blocked the initiator" do
    create(:contact, user: @other_user, contact: @user, status: :blocked)

    assert_no_difference("Chat.count") do
      result = ChatService.new.find_or_create_direct_chat(@user, @other_user)

      assert_nil result, "Chat should not be created when a user is blocked"
    end
  end
end
