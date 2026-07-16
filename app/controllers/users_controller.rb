class UsersController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: [ :validate_username ]

  rate_limit to: 30, within: 1.minute, only: [ :search, :validate_username ]

  def search
    query = params[:query].to_s.strip

    if query.blank?
      render json: [] and return
    end

    existing_contact_ids = current_user.contact_users.pluck(:id)
    users_to_exclude = [ current_user.id ] + existing_contact_ids

    # Match usernames with escaped wildcards; emails only match exactly, so
    # the endpoint can't be used to harvest addresses.
    escaped = ActiveRecord::Base.sanitize_sql_like(query)
    users = User.where(
                  "username ILIKE :pattern OR lower(email) = :exact",
                  pattern: "%#{escaped}%", exact: query.downcase
                )
                .where.not(id: users_to_exclude)
                .limit(10)

    render json: users.as_json(only: [ :id, :username ])
  end

  def validate_username
    is_taken = User.exists?([ "lower(username) = ?", params[:username].to_s.downcase ])
    render json: { is_taken: is_taken }
  end
end
