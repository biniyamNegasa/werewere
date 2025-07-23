require 'rails_helper'

RSpec.describe Contact, type: :model do
  it "belongs to a user and a contact" do
    owner_user = create(:user)
    contact_user = create(:user)

    contact_relationship = create(:contact, user: owner_user, contact: contact_user)

    expect(contact_relationship.user).to eq owner_user
    expect(contact_relationship.contact).to eq contact_user
  end

  it "has enum status" do
    contact = create(:contact)

    expect(contact.accepted?).to be true
    expect(contact.blocked?).to be false

    contact.blocked!

    expect(contact.blocked?).to be true
    expect(contact.accepted?).to be false
    expect(contact.status).to eq "blocked"
  end

  it "should not allow a user to be their own contact" do
    user = create(:user)
    contact = build(:contact, user: user, contact: user)

    expect(contact).not_to be_valid
  end
end
