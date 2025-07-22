class ChatService
  def find_or_create_direct_chat(user1, user2)
    return nil if user2.contacts.exists?(contact_id: user1.id, status: :blocked)

    chat = Chat.direct_chat.joins(:participants).where(participants: {user_id: [user1.id, user2.id]}).group('chats.id').having('COUNT(chats.id) = 2').first

    return chat if chat.present?


    new_chat = Chat.new(chat_type: :direct_chat)

    ActiveRecord::Base.transaction do
      new_chat.save!

      new_chat.participants.create!(user: user1)
      new_chat.participants.create!(user: user2)
    end

    new_chat
  end
end
