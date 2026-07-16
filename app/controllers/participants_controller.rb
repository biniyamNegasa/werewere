class ParticipantsController < ApplicationController
  before_action :authenticate_user!

  def update_last_read
    participant = Participant.find_by(user_id: current_user.id, chat_id: params[:chat_id])
    chat = participant&.chat

    if participant && chat
      read_at = Time.current

      # messages.read_at is a per-message flag, which is only meaningful when
      # there is exactly one other reader; per-user read state lives on
      # participants.last_read_at.
      if chat.direct_chat?
        chat.messages.where(read_at: nil).where.not(user_id: current_user.id)
            .update_all(read_at: read_at)
      end

      participant.update(last_read_at: read_at)

      ActionCable.server.broadcast(
        "chat_channel_#{chat.id}",
        {
          type: "messages_read",
          reader_id: current_user.id,
          read_at: read_at
        }
      )

      head :no_content
    else
      head :unprocessable_entity
    end
  end
end
