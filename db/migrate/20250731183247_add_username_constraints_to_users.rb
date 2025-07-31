class AddUsernameConstraintsToUsers < ActiveRecord::Migration[8.0]
  def change
    User.where(username: nil).find_each { |user| user.update(username: "user_#{user.id}") }

    add_index :users, :username, unique: true

    change_column_null :users, :username, false
  end
end
