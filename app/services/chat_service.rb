class ChatService
  def find_or_create_direct_chat(user1, user2)
    return nil if user1.id == user2.id
    return nil if blocked_either_way?(user1, user2)

    find_direct_chat(user1, user2) || create_direct_chat(user1, user2)
  end

  private

  def blocked_either_way?(user1, user2)
    Contact.where(status: :blocked).exists?(user_id: user1.id, contact_id: user2.id) ||
      Contact.where(status: :blocked).exists?(user_id: user2.id, contact_id: user1.id)
  end

  def find_direct_chat(user1, user2)
    Chat.direct_chat
        .joins(:participants)
        .where(participants: { user_id: [ user1.id, user2.id ] })
        .group("chats.id")
        .having("COUNT(DISTINCT participants.user_id) = 2")
        .first
  end

  def create_direct_chat(user1, user2)
    new_chat = Chat.new(chat_type: :direct_chat)

    ActiveRecord::Base.transaction do
      new_chat.save!
      new_chat.participants.create!(user: user1)
      new_chat.participants.create!(user: user2)
    end

    new_chat
  rescue ActiveRecord::RecordNotUnique
    # Two concurrent requests raced to create the same chat; use the winner's.
    find_direct_chat(user1, user2)
  end
end
