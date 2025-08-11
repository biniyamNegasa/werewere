# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  skip_before_action :authenticate_user!, only: [ :new, :create ]

  # GET /resource/sign_in
  def new
    #   super
    render inertia: "Auth/Login", props: {
      alert: flash[:alert],
      notice: flash[:notice]
    }
  end

  # POST /resource/sign_in
  def create
    self.resource = warden.authenticate(auth_options)

    if resource
      set_flash_message!(:notice, :signed_in)
      sign_in(resource_name, resource)
      respond_with resource, location: after_sign_in_path_for(resource)
    else
      flash[:alert] = "Invalid email or password"
      redirect_to new_user_session_path
    end
  end

  # DELETE /resource/sign_out
  def destroy
    session.delete(:user_update_params)
    session.delete(:reauthenticated_at)

    signed_out = sign_out_and_redirect(resource_name)
    set_flash_message!(:notice, :signed_out) if signed_out
  end


  protected

  def auth_options
    { scope: resource_name, recall: "#{controller_path}#new" }
  end

  def after_sign_in_path_for(resource)
    if session[:user_update_params].present?
      session[:reauthenticated_at] = Time.current

      edit_user_registration_path
    else
      authenticated_root_path
    end
  end

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end


  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
