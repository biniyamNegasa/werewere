class AddIntegrityConstraints < ActiveRecord::Migration[8.0]
  def up
    # Remove any duplicates before adding the unique indexes.
    execute <<~SQL
      DELETE FROM participants a USING participants b
      WHERE a.id > b.id AND a.chat_id = b.chat_id AND a.user_id = b.user_id
    SQL
    execute <<~SQL
      DELETE FROM contacts a USING contacts b
      WHERE a.id > b.id AND a.user_id = b.user_id AND a.contact_id = b.contact_id
    SQL

    add_index :participants, [ :chat_id, :user_id ], unique: true
    add_index :contacts, [ :user_id, :contact_id ], unique: true

    execute "UPDATE messages SET body = '' WHERE body IS NULL"
    change_column_null :messages, :body, false

    execute "UPDATE contacts SET status = 0 WHERE status IS NULL"
    change_column_default :contacts, :status, from: nil, to: 0
    change_column_null :contacts, :status, false
  end

  def down
    remove_index :participants, [ :chat_id, :user_id ]
    remove_index :contacts, [ :user_id, :contact_id ]
    change_column_null :messages, :body, true
    change_column_null :contacts, :status, true
    change_column_default :contacts, :status, from: 0, to: nil
  end
end
