class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index ]

  def index
    if user_signed_in?
      redirect_to authenticated_root_path
    else
      render inertia: "Home/Index"
    end
  end
end
