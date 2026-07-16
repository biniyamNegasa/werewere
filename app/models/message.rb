class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chat, touch: true

  validates :body, presence: true
end
