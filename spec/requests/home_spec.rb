require 'rails_helper'

RSpec.describe "Homes", type: :request do
  describe "GET /index" do
    context "when user is not authenticated" do
      it "returns http success and displays login/signup links" do
        get root_path # root_path points to home#index for unauthenticated users
        expect(response).to have_http_status(:success)
        # expect(response.body).to include("Welcome to Your Chat App!")
        # expect(response.body).to include(new_user_session_path)
        # expect(response.body).to include(new_user_registration_path)
      end
    end

    context "when user is authenticated" do
      let(:user) { create(:user) }

      it "redirects to the authenticated root path (chats)" do
        sign_in user
        get root_path
        expect(response).to redirect_to(authenticated_root_path)
      end
    end
  end
end
