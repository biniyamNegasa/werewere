class ChangeChatTypeDefaultInChats < ActiveRecord::Migration[8.0]
  def change
    change_column_default :chats, :chat_type, 0
  end
end
