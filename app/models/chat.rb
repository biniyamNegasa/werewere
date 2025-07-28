class Chat < ApplicationRecord
  enum :chat_type, [ :direct_chat, :group_chat ]

  has_many :participants, dependent: :destroy
  has_many :users, through: :participants

  has_many :messages, -> { order(created_at: :asc) }, dependent: :destroy
  has_one :last_message, -> { order(created_at: :desc) }, class_name: "Message"
end
