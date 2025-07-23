import PropTypes from "prop-types";

export default function ChatList({ chats, onSelectChat }) {
  if (!chats || chats.length === 0) {
    return <p className="text-muted-foreground p-4">No conversations yet.</p>;
  }

  return (
    <ul>
      {chats.map((chat) => (
        <li
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className="w-full text-left p-2 cursor-pointer hover:bg-secondary rounded-md transition-colors"
        >
          {/* Display the other user's username or email */}
          <span className="font-semibold">
            {chat.users[0]?.username || chat.users[0]?.email || "Unknown User"}
          </span>
          {/* You could add a last message preview here */}
        </li>
      ))}
    </ul>
  );
}

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  onSelectChat: PropTypes.func.isRequired,
};
