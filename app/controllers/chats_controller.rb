class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    chats = current_user.chats.includes(messages: :user, users: []).order(updated_at: :desc)
    contacts = current_user.contact_users.as_json(only: [ :id, :email, :username ])

    # Handle pre-selection of a chat if redirected with a flashed chat ID (e.g., after creating a new chat)
    preselected_chat = nil
    if flash[:active_chat_id].present?
      # Find the chat object that matches the flashed ID
      preselected_chat = chats.find { |c| c.id == flash[:active_chat_id].to_i }
    end

    # Render the main chat index page component with all necessary data
    render inertia: "Chats/Index", props: {
      chats: chats.as_json(
        only: [ :id, :name, :chat_type, :created_at, :updated_at ],
        include: {
          messages: {
            only: [ :id, :body, :user_id, :created_at ],
            include: { user: { only: [ :id, :email, :username ] } }
          },
          users: { # Include participants with full presence info
            only: [ :id, :email, :username, :status, :last_seen_at ]
          }
        }
      ),
      contacts: contacts,
      # preselectedChat data will be used by the frontend to initialize the active chat
      preselectedChat: preselected_chat ? preselected_chat.as_json(
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
      ) : nil
    }
  end

  # Handles initiating a new chat from the contact list (POST request)
  def create
    other_user = User.find(params[:user_id]) # The user to start a chat with

    # Use the ChatService to find or create the private chat
    chat = ChatService.new.find_or_create_direct_chat(current_user, other_user)

    if chat
      # Redirect back to the chats index, but include the new chat's ID in flash.
      # The frontend will then automatically open this chat.
      redirect_to chats_path, flash: { active_chat_id: chat.id }
    else
      # If chat creation failed (e.g., blocked user), redirect with an alert.
      redirect_to chats_path, alert: "Could not start a chat with this user."
    end
  end

  # The 'show' action is intentionally removed/not implemented for internal navigation.
  # Direct visits to /chats/:id are handled by a redirect in config/routes.rb.
end
