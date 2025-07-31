class ContactsController < ApplicationController
  before_action :authenticate_user!

  def create
    contact_to_add = User.find(params[:contact_id])

    # Create the contact relationship with an 'accepted' status.
    # Using create! will raise an error if validation fails (e.g., adding self),
    # which we can rescue.
    current_user.contacts.create!(contact: contact_to_add, status: :accepted)


    redirect_to chats_path, notice: "#{contact_to_add.username} has been added to your contacts."
  rescue ActiveRecord::RecordNotFound
    redirect_to chats_path, alert: "Could not find the user to add."
  rescue ActiveRecord::RecordInvalid => e
    # This will catch errors from your model validations, like adding yourself
    # or if the contact relationship already exists.
    redirect_to chats_path, alert: "Failed to add contact: #{e.record.errors.full_messages.to_sentence}"
  end
end
