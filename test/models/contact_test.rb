require "test_helper"

class ContactTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test "should belong to a user and a contact" do
    owner_user = create(:user)
    contact_user = create(:user)

    contact_relationship = create(:contact, user: owner_user, contact: contact_user)

    assert_equal owner_user, contact_relationship.user
    assert_equal contact_user, contact_relationship.contact
  end

  test "status enum should work correctly" do
    contact = create(:contact)

    assert contact.accepted?
    assert_not contact.blocked?

    contact.blocked!

    assert contact.blocked?
    assert_not contact.accepted?
    assert_equal "blocked", contact.status
  end

  test "should not allow a user to be their own contact" do
    user = create(:user)
    contact = build(:contact, user: user, contact: user)

    assert_not contact.valid?
  end
end
