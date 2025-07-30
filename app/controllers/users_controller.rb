class UsersController < ApplicationController
  before_action :authenticate_user!

  def search
    query = params[:query]

    if query.blank?
      render json: [] and return
    end

    # Get the IDs of users who are already contacts.
    existing_contact_ids = current_user.contact_users.pluck(:id)
    # Create a final list of all user IDs to exclude from the search results.
    users_to_exclude = [ current_user.id ] + existing_contact_ids

    # Find users matching the query, excluding the current user and existing contacts.
    users = User.where("username ILIKE ? OR email ILIKE ?", "%#{query}%", "%#{query}%")
                .where.not(id: users_to_exclude)
                .limit(10)

    render json: users.as_json(only: [ :id, :username, :email ])
  end
end
