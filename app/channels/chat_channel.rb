class ChatChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    @chat = Chat.find(params[:id])

    reject unless @chat.participants.exists?(user_id: current_user.id)

    stream_from "chat_channel_#{@chat.id}"
  rescue ActiveRecord::RecordNotFound
    reject
  end

  def speak(data)
    message_body = data["message"].to_s.strip

    return if message_body.blank?

    message = @chat.messages.new(user: current_user, body: message_body)

    if message.save
      ActionCable.server.broadcast(
        "chat_channel_#{@chat.id}",
        message.as_json(
          include: {
            user: {
              only: [ :id, :username, :email ]
            }
          },
          only: [ :id, :body, :user_id, :created_at ]
        )
      )
    else
      Rails.logger.error "Failed to save message: #{message.errors.full_messages.to_sentence}"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    stop_all_streams
  end
end
