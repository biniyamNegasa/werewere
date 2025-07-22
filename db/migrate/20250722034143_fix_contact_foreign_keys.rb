class FixContactForeignKeys < ActiveRecord::Migration[8.0]
  def change
    remove_foreign_key :contacts, column: :contact_id

    add_foreign_key :contacts, :users, column: :contact_id
  end
end
