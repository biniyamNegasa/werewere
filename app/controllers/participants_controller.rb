class ParticipantsController < ApplicationController
  before_action :authenticate_user!

  def update_last_read
    participant = Participant.find_by(user_id: current_user.id, chat_id: params[:chat_id])

    if participant&.update(last_read_at: Time.current)
      # ChatListChannel.broadcast_to(current_user, {
      #   type: "chat_list_update",
      #   chat_id: params[:chat_id],
      #   unread_count: 0
      # })
      head :see_other, location: request.referer
    else
      head :unprocessable_entity
    end
  end
end
