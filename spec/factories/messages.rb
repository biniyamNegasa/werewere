FactoryBot.define do
  factory :message do
    body { "This is a test message " }
    association :user
    association :chat
  end
end
