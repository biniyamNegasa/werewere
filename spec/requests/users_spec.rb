require 'rails_helper'

RSpec.describe "Users", type: :request do
  let(:user) { create(:user) }
  let!(:other) { create(:user, username: "findme", email: "findme@example.com") }

  describe "GET /users/search" do
    before { sign_in user }

    it "returns matching users without exposing email addresses" do
      get users_search_path, params: { query: "findme" }

      expect(response).to have_http_status(:ok)
      results = JSON.parse(response.body)
      expect(results.map { |u| u["id"] }).to include(other.id)
      expect(results.first.keys).to contain_exactly("id", "username")
    end

    it "does not treat SQL LIKE wildcards as match-all" do
      get users_search_path, params: { query: "%" }

      expect(JSON.parse(response.body)).to be_empty
    end

    it "matches email only on exact address" do
      get users_search_path, params: { query: "findme@example" }
      expect(JSON.parse(response.body).map { |u| u["id"] }).not_to include(other.id)

      get users_search_path, params: { query: "findme@example.com" }
      expect(JSON.parse(response.body).map { |u| u["id"] }).to include(other.id)
    end
  end

  describe "GET /users/validate_username" do
    it "handles a missing username param" do
      get users_validate_username_path

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["is_taken"]).to be(false)
    end

    it "reports taken usernames case-insensitively" do
      get users_validate_username_path, params: { username: "FINDME" }

      expect(JSON.parse(response.body)["is_taken"]).to be(true)
    end
  end
end
