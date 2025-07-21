class CreateContacts < ActiveRecord::Migration[8.0]
  def change
    create_table :contacts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :contact, null: false, foreign_key: true
      t.integer :status

      t.timestamps
    end
  end
end
