class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :authenticate_user!
  before_action :update_last_seen_at, if: :user_signed_in?

  inertia_share flash: -> { flash.to_hash }
  inertia_share auth: -> {
    { user: current_user.as_json(only: [ :id, :email, :username ]) } if user_signed_in?
  }

  private

  def update_last_seen_at
    if current_user.last_seen_at.nil? || current_user.last_seen_at < 5.minutes.ago
      current_user.update_column(:last_seen_at, Time.current)
    end
  end
end
