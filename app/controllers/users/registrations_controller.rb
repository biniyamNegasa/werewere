# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [ :create ]
  before_action :configure_account_update_params, only: [ :update ]

  skip_before_action :authenticate_user!, only: [ :new, :create ]

  # GET /resource/sign_up
  def new
    render inertia: "Auth/Register", props: {
      errors: (flash[:error] || {})
    }
  end

  # POST /resource
  def create
    build_resource(sign_up_params)

    if resource.save
      sign_up(resource_name, resource)

      set_flash_message :notice, :signed_up

      respond_with resource, location: after_sign_up_path_for(resource)
    else
      formatted_errors = resource.errors.to_hash(true).transform_values(&:to_sentence)
      flash[:error] = formatted_errors

      redirect_to new_user_registration_path
    end
  end

  # GET /resource/edit
  def edit
    if session[:user_update_params]
      resource.assign_attributes(session.delete(:user_update_params))
      resource.valid?
    end

    render inertia: "User/Edit", props: {
      user: resource.as_json(only: [ :username, :email ]),
      errors: (flash[:error] || {}),
      notice: flash[:notice]
    }
  end

  # PUT /resource
  def update
    if session[:reauthenticated_at].blank? || session[:reauthenticated_at] < 3.minutes.ago
      session[:user_update_params] = account_update_params.to_h

      sign_out(current_user)

      redirect_to new_user_session_path, alert: "For your security, please sign in again to make changes"
      return
    end

    update_params = session.delete(:user_update_params) || account_update_params

    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_uncofirmed_email = resource.uncofirmed_email if resource.respond_to?(:uncofirmed_email)

    if update_params[:password].blank?
      update_params.delete(:password)
      update_params.delete(:password_confirmation)
    end

    resource_updated = resource.update(update_params)

    yield resource if block_given?

    if resource_updated
      set_flash_message_for_update(resource, prev_uncofirmed_email)
      bypass_sign_in resource, scope: resource_name if sign_in_after_change_password?

      set_flash_message :notice, :updated

      respond_with resource, location: after_update_path_for(resource)
    else
      clean_up_passwords resource
      set_minimum_password_length

      flash[:error] = resource.errors.to_hash(true).transform_values(&:to_sentence)
      redirect_to edit_user_registration_path
    end
  end

  # DELETE /resource
  def destroy
    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    set_flash_message! :notice, :destroyed

    yield resource if block_given?

    respond_with_navigational(resource) { redirect_to after_sign_out_path_for(resource_name) }
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :username, :email, :password, :password_confirmation ])
  end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [ :username, :email, :password, :password_confirmation ])
  end

  def after_update_path_for(resource)
    edit_user_registration_path
  end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
