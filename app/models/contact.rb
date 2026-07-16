class Contact < ApplicationRecord
  enum :status, [ :accepted, :blocked ]

  belongs_to :user
  belongs_to :contact, class_name: "User"

  validates :contact_id, uniqueness: { scope: :user_id, message: "is already in your contacts" }
  validate :user_is_not_contact

  private

  def user_is_not_contact
    errors.add(:user, "can't be their own contact") if user == contact
  end
end
