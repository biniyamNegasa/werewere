# spec/requests/chats_spec.rb
require 'rails_helper'

RSpec.describe "ChatsControllers", type: :request do
  # `let` is RSpec's way of creating memoized test data
  let(:user_a) { create(:user) }
  let(:user_b) { create(:user) }

  describe "GET /chats" do
    context "when user is not authenticated" do
      it "redirects to the login page" do
        get chats_path
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    # By adding `inertia: true`, we activate the special Inertia RSpec helpers!
    context "when user is authenticated", inertia: true do
      before do
        # Create chat and contact data for the test setup
        @chat = create(:chat)
        create(:participant, user: user_a, chat: @chat)
        create(:participant, user: user_b, chat: @chat)
        create(:contact, user: user_a, contact: user_b, status: :accepted)
        sign_in user_a # This helper comes from Devise
      end

      it "returns a successful response" do
        get chats_path
        expect(response).to be_successful
      end

      it "renders the 'Chats/Index' component" do
        get chats_path
        expect_inertia.to render_component("Chats/Index")
      end

      it "includes the correct chats and contacts as props" do
        get chats_path
        expect(inertia.props[:chats].size).to eq(1)
        expect(inertia.props[:chats].first[:id]).to eq(@chat.id)
        expect(inertia.props[:contacts].size).to eq(1)
        expect(inertia.props[:contacts].first[:id]).to eq(user_b.id)
      end

      context "with a preselected_chat in flash" do
        it "passes the preselected chat data to the frontend" do
          # Simulate a redirect with flash data
          get chats_path, flash: { active_chat_id: @chat.id }
          expect(inertia.props[:preselectedChat]).to be_present
          expect(inertia.props[:preselectedChat][:id]).to eq(@chat.id)
        end
      end
    end
  end

  describe "POST /chats" do
    context "when user is authenticated" do
      before do
        sign_in user_a
      end

      it "creates a new chat and redirects to the index with active_chat_id flash" do
        expect {
          post chats_path, params: { user_id: user_b.id }
        }.to change(Chat, :count).by(1)

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(chats_path) # Redirects to index
        expect(flash[:active_chat_id]).to eq(Chat.last.id) # Flash includes the new chat ID
      end

      it "does not create a chat if recipient has blocked initiator" do
        # User B blocks User A
        create(:contact, user: user_b, contact: user_a, status: :blocked)

        expect {
          post chats_path, params: { user_id: user_b.id }
        }.not_to change(Chat, :count)

        expect(response).to redirect_to(chats_path)
        expect(flash[:alert]).to be_present # Check for alert message
      end
    end

    context "when user is not authenticated" do
      it "redirects to login page" do
        post chats_path, params: { user_id: user_b.id }
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe "GET /chats/:id (redirect to index)" do
    let(:chat_id) { create(:chat).id } # Create a dummy chat for the ID

    it "redirects to the chats index page" do
      get chat_path(id: chat_id) # Use chat_path as helper from routes.rb
      expect(response).to redirect_to(chats_path)
    end
  end
end
