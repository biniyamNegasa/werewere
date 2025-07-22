FactoryBot.define do
  factory :participant do
    association :user
    association :chat
  end
end
