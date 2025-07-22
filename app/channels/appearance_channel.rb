class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"

    stream_from "appearance_channel"

    current_user.online!
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed

    current_user.offline!
    current_user.update!(last_seen_at: Time.current)
  end
end
