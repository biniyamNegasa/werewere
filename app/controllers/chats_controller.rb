class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    chats = current_user.chats
              .includes(:last_message, users: [], participants: :user)
              .order(updated_at: :desc)

    contacts = current_user.contact_users.as_json(only: [ :id, :email, :username ])

    enriched_chats = chats.map { |chat| serialize_chat(chat) }

    preselected_chat_id = flash[:active_chat_id].to_i
    preselected_chat = preselected_chat_id.present? ? enriched_chats.find { |c| c[:id] == preselected_chat_id } : nil

    render inertia: "Chats/Index", props: {
      chats: -> { enriched_chats },
      contacts: -> { contacts },
      preselectedChat: -> { preselected_chat }
    }
  end

  def create
    other_user = User.find(params[:user_id])
    chat = ChatService.new.find_or_create_direct_chat(current_user, other_user)

    if chat
      redirect_to chats_path, flash: { active_chat_id: chat.id }
    else
      redirect_to chats_path, alert: "Could not start a chat with this user."
    end
  end

  private

  def serialize_chat(chat)
    return nil unless chat

    participant = chat.participants.find { |p| p.user_id == current_user.id }

    chat.as_json(
      only: [ :id, :name, :chat_type, :created_at, :updated_at ],
      include: {
        users: {
          only: [ :id, :email, :username, :status, :last_seen_at ]
        }
      }
    ).merge(
      messages: chat.messages.as_json(
        include: { user: { only: [ :id, :email, :username ] } }
      ),
      unread_count: participant&.unread_messages_count || 0,
      last_message: chat.last_message&.as_json(
        include: { user: { only: [ :id, :email, :username ] } }
      )
    )
  end
end
