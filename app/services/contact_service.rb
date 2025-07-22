class ContactService
  def block_user(user, contact)
    contact_record = user.contacts.find_or_initialize_by(contact: contact)

    contact_record.status = :blocked
    contact_record.save!
  end

  def unblock_user(user, contact)
    contact_record = user.contacts.find_by(contact: contact)

    contact_record&.destroy
  end
end
