FactoryBot.define do
  factory :user do
    sequence(:username) { |n| "user_#{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "Password123" }
    password_confirmation { "Password123" }
  end
end
