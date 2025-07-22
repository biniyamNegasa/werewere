class Chat < ApplicationRecord
  enum :chat_type, [:direct_chat, :group_chat]

  has_many :participants, dependent: :destroy
  has_many :users, through: :participants

  has_many :messages, -> { order(created_at: :asc) }, dependent: :destroy
end
