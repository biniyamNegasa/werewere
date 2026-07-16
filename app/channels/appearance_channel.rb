class AppearanceChannel < ApplicationCable::Channel
  def subscribed
    # Only stream presence of users this user actually knows: contacts and
    # people they share a chat with — not the whole user base.
    watched = watched_user_ids
    watched.each { |id| stream_from "presence:#{id}" }

    if register_connection == 1
      current_user.online!
      broadcast_own_status
    end

    transmit({
      type: "presence_snapshot",
      users: User.where(id: watched).as_json(only: [ :id, :status, :last_seen_at ])
    })
  end

  def unsubscribed
    stop_all_streams

    # Only go offline when the last open tab/connection disconnects.
    if unregister_connection <= 0
      current_user.update!(status: :offline, last_seen_at: Time.current)
      broadcast_own_status
    end
  end

  private

  def watched_user_ids
    contact_ids = current_user.contact_users.ids
    chat_partner_ids = Participant.where(chat_id: current_user.participants.select(:chat_id))
                                  .where.not(user_id: current_user.id)
                                  .distinct.pluck(:user_id)
    (contact_ids + chat_partner_ids).uniq
  end

  def broadcast_own_status
    ActionCable.server.broadcast(
      "presence:#{current_user.id}",
      { user_id: current_user.id, status: current_user.status, last_seen_at: current_user.last_seen_at }
    )
  end

  def connection_count_key
    "presence_connections:#{current_user.id}"
  end

  # Read-modify-write is racy in theory, but presence tolerates that; with a
  # null cache store (development default) this degrades to per-tab behavior.
  def register_connection
    count = (Rails.cache.read(connection_count_key) || 0) + 1
    Rails.cache.write(connection_count_key, count, expires_in: 1.day)
    count
  end

  def unregister_connection
    count = [ (Rails.cache.read(connection_count_key) || 1) - 1, 0 ].max
    Rails.cache.write(connection_count_key, count, expires_in: 1.day)
    count
  end
end
