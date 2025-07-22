require "test_helper"

class ContactManagementTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @other_user = create(:user)
  end

  test " a user can block another user" do
    ContactService.new.block_user(@user, @other_user)

    contact_record = @user.contacts.find_by(contact: @other_user)

    assert contact_record.present?
    assert contact_record.blocked?

    reverse_contact = @other_user.contacts.find_by(contact: @user)

    assert_nil reverse_contact
  end

  test " a user can unblock another user" do
    create(:contact, user: @user, contact: @other_user, status: :blocked)

    ContactService.new.unblock_user(@user, @other_user)

    contact_record = @user.contacts.find_by(contact: @other_user)

    assert_nil contact_record, "The contact record should have been deleted upon unblocking"
  end


  test "blocking a user who is already an 'accepted' contact should update the status" do 
    create(:contact, user: @user, contact: @other_user, status: :accepted)

    assert_no_difference("Contact.count") do
      ContactService.new.block_user(@user, @other_user)
    end

    contact_record = @user.contacts.find_by(contact: @other_user)

    assert contact_record.blocked?
  end
end
