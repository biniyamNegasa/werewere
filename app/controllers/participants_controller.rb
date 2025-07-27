class ParticipantsController < ApplicationController
  before_action :authenticate_user!

  def update_last_read
    participant = Participant.find_by(user_id: current_user.id, chat_id: params[:chat_id])

    headers["X-Inertia"] = "true"
    if participant&.update(last_read_at: Time.current)
      render json: { success: true }, status: :ok
      ChatListChannel.broadcast_to(current_user, {
        type: "chat_list_update",
        chat_id: params[:chat_id],
        unread_count: 0
      })
    else
      render json: { success: false }, message: "Could not update last read", status: :unprocessable_entity
    end
  end
end
