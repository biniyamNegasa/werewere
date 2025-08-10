class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  attr_accessor :login

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [ :github, :google_oauth2 ]

  RESERVED_USERNAMES = %w[admin user root support help werewere]

  validates :username, presence: true, length: { minimum: 3, maximum: 20 }, uniqueness: { case_sensitive: false }, format: { with: /\A[a-zA-Z0-9_]+\z/, message: "can only contain letters, numbers, and underscores" }, exclusion: { in: RESERVED_USERNAMES, message: "is reserved" }

  def self.from_omniauth(auth)
    user = User.find_by(provider: auth.provider, uid: auth.uid) || User.find_by(email: auth.info.email)

    if user
      user.update(provider: auth.provider, uid: auth.uid)
    else
      user = User.new(
        provider: auth.provider,
        uid: auth.uid,
        email: auth.info.email,
        password: Devise.friendly_token[0, 20]
      )

      username = auth.info.nickname || auth.info.name.gsub(/\s+/, "_").downcase
      while User.exists?(username: username)
        username = "#{auth.info.nickname}_#{rand(1000)}"
      end
      user.username = username
      user.save
    end

    user
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if (login = conditions.delete(:login))
        where(conditions.to_h).where([ "lower(username) = :value OR lower(email) = :value", { value: login.downcase } ]).first
    elsif conditions.has_key?(:username) || conditions.has_key?(:email)
        where(conditions.to_h).first
    end
  end

  enum :status, [ :offline, :online ]

  has_many :participants, dependent: :destroy
  has_many :chats, through: :participants

  has_many :messages, dependent: :nullify

  has_many :contacts, dependent: :destroy
  has_many :inverse_contacts, class_name: "Contact", foreign_key: "contact_id", dependent: :destroy

  has_many :contact_users, through: :contacts, source: :contact
end
