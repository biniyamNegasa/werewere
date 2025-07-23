require 'rails_helper'

RSpec.describe "ChatsControllers", type: :request do
  let(:user_a) { create(:user) }
  let(:user_b) { create(:user) }

  describe "GET /chats" do
    context "when user is not authenticated" do
      it "redirects to the login page" do
        get chats_path
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when user is authenticated", inertia: true do
      before do
        chat = create(:chat)
        create(:participant, user: user_a, chat: chat)
        create(:participant, user: user_b, chat: chat)
        create(:contact, user: user_a, contact: user_b, status: :accepted)

        sign_in user_a
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
        expect(inertia.props[:contacts].size).to eq(1)
        expect(inertia.props[:contacts].first[:id]).to eq(user_b.id)
      end
    end
  end

  describe "POST /chats" do
    context "when user is authenticated" do
      before do
        sign_in user_a
      end

      it "creates a new chat and redirects to it" do
        expect {
          post chats_path, params: {
            user_id: user_b.id
          } }.to change(Chat, :count).by(1)

      expect(response).to have_http_status(:redirect)
      expect(response).to redirect_to(chat_path(Chat.last))
      end
    end
  end
end
