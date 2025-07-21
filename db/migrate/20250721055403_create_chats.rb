class CreateChats < ActiveRecord::Migration[8.0]
  def change
    create_table :chats do |t|
      t.string :name
      t.integer :chat_type

      t.timestamps
    end
  end
end
