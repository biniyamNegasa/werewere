class ChatsController < ApplicationController
  before_action :authenticate_user!

  def index
    chats = current_user.chats
              .includes(:users, participants: :user, messages: :user)
              .order(updated_at: :desc)

    contacts = current_user.contact_users.order(last_seen_at: :desc).as_json(
      only: [ :id, :username, :status, :last_seen_at ]
    )

    enriched_chats = chats.map { |chat| serialize_chat(chat) }

    preselected_chat_id = flash[:active_chat_id]
    preselected_chat = preselected_chat_id.present? ? enriched_chats.find { |c| c["id"] == preselected_chat_id.to_i } : nil

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
      serialized_chat_for_other_user = serialize_chat(chat, for_user: other_user)
      ChatListChannel.broadcast_to(other_user, {
        type: "new_chat",
        chat: serialized_chat_for_other_user
      })

      redirect_to chats_path, status: :see_other, flash: { active_chat_id: chat.id }
    else
      redirect_to chats_path, alert: "Could not start a chat with this user."
    end
  rescue ActiveRecord::RecordNotFound
    redirect_to chats_path, alert: "Could not find the user to chat with."
  end

  private

  def serialize_chat(chat, for_user: current_user)
    return nil unless chat

    participant = chat.participants.find { |p| p.user_id == for_user.id }
    messages = chat.messages.to_a

    chat.as_json(
      only: [ :id, :name, :chat_type, :created_at, :updated_at ],
      include: {
        users: {
          only: [ :id, :username, :status, :last_seen_at ]
        }
      }
    ).merge(
      messages: messages.as_json(
        include: { user: { only: [ :id, :username ] } }
      ),
      unread_count: unread_count_for(participant, messages),
      last_message: messages.last&.as_json(
        include: { user: { only: [ :id, :username ] } }
      )
    )
  end

  # Counts from the already-loaded messages instead of issuing a COUNT query
  # per chat.
  def unread_count_for(participant, messages)
    return 0 unless participant

    messages.count do |m|
      m.user_id != participant.user_id &&
        (participant.last_read_at.nil? || m.created_at > participant.last_read_at)
    end
  end
end
