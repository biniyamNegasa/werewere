class Participant < ApplicationRecord
  belongs_to :user
  belongs_to :chat

  def unread_messages_count
    chat.messages.where("created_at > ?", last_read_at || Time.at(0)).where.not(user_id: user_id).count
  end
end
