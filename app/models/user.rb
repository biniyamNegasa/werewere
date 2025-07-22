class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum :status, [ :offline, :online ]

  has_many :participants, dependent: :destroy
  has_many :chats, through: :participants

  has_many :messages, dependent: :destroy

  has_many :contacts, dependent: :destroy
  has_many :contact_users, through: :contacts, source: :contact
end
