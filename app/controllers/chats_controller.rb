class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    chats = current_user.chats.includes(:users)
    contacts = current_user.contact_users

    render inertia: "Chats/Index", props: {
      chats: chats.as_json(include: {
        users: {
          only: [ :id, :username, :email ]
        }
      }),
      contacts: contacts.as_json(only: [ :id, :username, :email ]),
      auth: {
        user: current_user.as_json(only: [ :id, :username, :email ])
      }
    }
  end

  def create
    other_user = User.find(params[:user_id])

    chat = ChatService.new.find_or_create_direct_chat(current_user, other_user)

    if chat
      redirect_to chat_path(chat)
    else
      redirect_to chats_path, alert: "Could not start a chat with this user."
    end
  end

  def show
    @chat = Chat.includes(messages: :user, users: []).find(params[:id])

    unless @chat.participants.exists?(user_id: current_user.id)
      return redirect_to chats_path, alert: "You do not have access to this chat."
    end

    render inertia: "Chats/Show", props: { chat: @chat.as_json(
      only: [ :id, :name, :chat_type, :created_at ],
      include: {
      messages: {
        only: [ :id, :body, :user_id, :created_at ],
        include: {
          user: {
            only: [ :id, :username, :email ]
          }
        }
      },
        users: {
          only: [ :id, :username, :email, :status, :last_seen_at ]
        }
      }
    ),
      currentUser: current_user.as_json(only: [ :id, :email, :username ]) }
  end
end
