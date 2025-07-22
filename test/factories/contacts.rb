FactoryBot.define do
  factory :contact do
    association :user
    association :contact, factory: :user
    status { :accepted }
  end
end
