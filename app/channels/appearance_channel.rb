class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"

    stream_from "appearance_channel"

    current_user.online!

    send_status_update
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed

    stop_all_streams

    current_user.offline!
    current_user.update!(last_seen_at: Time.current)

    send_status_update
  end

  private

  def send_status_update
    ActionCable.server.broadcast(
      "appearance_channel",
      { user_id: current_user.id, status: current_user.status, last_seen_at: current_user.last_seen_at }
    )
  end
end
