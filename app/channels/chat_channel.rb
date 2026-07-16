class ChatChannel < ApplicationCable::Channel
  def subscribed
    @chat = Chat.find(params[:id])

    reject unless @chat.participants.exists?(user_id: current_user.id)

    stream_from "chat_channel_#{@chat.id}"
  rescue ActiveRecord::RecordNotFound
    reject
  end

  def speak(data)
    message_body = data["message"].to_s.strip

    return if message_body.blank?
    return if blocked_in_direct_chat?

    message = @chat.messages.new(user: current_user, body: message_body)

    if message.save
      message_json = message.as_json(
        include: { user: { only: [ :id, :username ] } },
        only: [ :id, :body, :user_id, :created_at, :read_at ]
      )

      ActionCable.server.broadcast(
        "chat_channel_#{@chat.id}",
        { type: "new_message", message: message_json }
      )

      @chat.participants.includes(:user).each do |participant|
        ChatListChannel.broadcast_to(participant.user, {
          type: "chat_list_update",
          chat_id: @chat.id,
          unread_count: participant.unread_messages_count,
          last_message: message_json
        })
      end
    else
      Rails.logger.error "Failed to save message: #{message.errors.full_messages.to_sentence}"
    end
  end

  def unsubscribed
    stop_all_streams
  end

  private

  # A block in either direction silences the conversation.
  def blocked_in_direct_chat?
    return false unless @chat.direct_chat?

    other_ids = @chat.participants.where.not(user_id: current_user.id).pluck(:user_id)
    Contact.where(status: :blocked)
           .where(
             "(user_id = :me AND contact_id IN (:others)) OR (user_id IN (:others) AND contact_id = :me)",
             me: current_user.id, others: other_ids
           ).exists?
  end
end
