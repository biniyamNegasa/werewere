class ParticipantsController < ApplicationController
  before_action :authenticate_user!

  def update_last_read
    participant = Participant.find_by(user_id: current_user.id, chat_id: params[:chat_id])
    chat = participant&.chat

    if participant && chat
      messages_to_update = chat.messages.where(read_at: nil).where.not(user_id: current_user.id)
      messages_to_update.update_all(read_at: Time.current)

      participant.update(last_read_at: Time.current)

      ActionCable.server.broadcast(
        "chat_channel_#{chat.id}",
        {
          type: "messages_read",
          reader_id: current_user.id,
          read_at: Time.current
      })

      head :see_other, location: request.referer
    else
      head :unprocessable_entity
    end
  end
end
