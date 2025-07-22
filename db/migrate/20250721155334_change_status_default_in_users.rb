class ChangeStatusDefaultInUsers < ActiveRecord::Migration[8.0]
  def change
    change_column_default :users, :status, 0
  end
end
