
# app/controllers/chats_controller.rb

class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    chats = current_user.chats
              .includes(messages: :user, users: [], participants: :user)
              .order(updated_at: :desc)

    contacts = current_user.contact_users.as_json(only: [ :id, :email, :username ])

    # Handle pre-selection of a chat if redirected with a flashed chat ID (e.g., after creating a new chat)
    preselected_chat = flash[:active_chat_id].present? ? chats.find { |c| c.id == flash[:active_chat_id].to_i } : nil

    enriched_chats = chats.map do |chat|
      participant = chat.participants.find { |p| p.user_id == current_user.id }
      last_message = chat.messages.last

      chat.as_json(
        only: [ :id, :name, :chat_type, :created_at, :updated_at ],
        include: {
          messages: {
            only: [ :id, :body, :user_id, :created_at ],
            include: { user: { only: [ :id, :email, :username ] } }
          },
          users: {
            only: [ :id, :email, :username, :status, :last_seen_at ]
          }
        }
      ).merge(unread_count: participant&.unread_messages_count || 0, 
      last_message: last_message.as_json(
        only: [ :id, :body, :user_id, :created_at ],
        include: { user: { only: [ :id, :email, :username ] } }
      ))
    end

    render inertia: "Chats/Index", props: {
      chats: -> { enriched_chats },
      contacts: -> { contacts },
      preselectedChat: -> { preselected_chat ? preselected_chat.as_json(
        only: [ :id, :name, :chat_type, :created_at, :updated_at ],
        include: {
          messages: {
            only: [ :id, :body, :user_id, :created_at ],
            include: { user: { only: [ :id, :email, :username ] } }
          },
          users: {
            only: [ :id, :email, :username, :status, :last_seen_at ]
          }
        }
      ) : nil}
    }
  end

  def create
    other_user = User.find(params[:user_id]) # The user to start a chat with
    chat = ChatService.new.find_or_create_direct_chat(current_user, other_user)

    if chat
      redirect_to chats_path, flash: { active_chat_id: chat.id }
    else
      redirect_to chats_path, alert: "Could not start a chat with this user."
    end
  end
end
