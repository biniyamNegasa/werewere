require "test_helper"

class AppearanceChannelTest < ActionCable::Channel::TestCase
  # test "subscribes" do
  #   subscribe
  #   assert subscription.confirmed?
  # end

  test "subscirbes and sets user to online" do
    user = create(:user, status: :offline)

    stub_connection current_user: user

    subscribe

    assert subscription.confirmed?
    assert_has_stream "appearance_channel"

    assert_equal "online", user.reload.status
  end

  test "unsubscribes and sets user to offline and updates last_seen_at" do
    user = create(:user, status: :online)
    stub_connection current_user: user
    
    subscribe

    assert user.reload.online?

    unsubscribe

    user.reload
    assert user.offline?

    assert_not_nil user.last_seen_at
    assert_in_delta Time.current, user.last_seen_at, 1.second
  end
end
