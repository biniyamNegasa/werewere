import PropTypes from "prop-types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function ChatList({ chats, onSelectChat, activeChat }) {
  if (!chats || chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-muted-foreground font-medium">
          No conversations yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Start a conversation with your contacts
        </p>
      </div>
    );
  }

  const getInitials = (user) => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "??";
  };

  const getLastMessageTime = (chat) => {
    if (chat.last_message) {
      return formatDistanceToNow(new Date(chat.last_message.created_at), {
        addSuffix: true,
      });
    }
    return "";
  };

  const getLastMessagePreview = (chat) => {
    if (chat.last_message) {
      return chat.last_message.body.length > 50
        ? chat.last_message.body.substring(0, 50) + "..."
        : chat.last_message.body;
    }
    return "No messages yet";
  };

  return (
    <div className="p-2">
      {chats.map((chat) => {
        const otherUser = chat.users[0];
        const displayName =
          otherUser?.username || otherUser?.email || "Unknown User";

        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors group",
              chat.id === activeChat?.id
                ? "bg-orange-100 dark:bg-orange-900/20 border-l-4 border-orange-500 "
                : "hover:bg-orange-50 dark:hover:bg-orange-900/10",
            )}
          >
            <Avatar className="w-12 h-12 border-2 border-orange-100 dark:border-orange-900/20">
              <AvatarFallback className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-medium">
                {getInitials(otherUser)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground truncate">
                  {displayName}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {getLastMessageTime(chat)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-1">
                {getLastMessagePreview(chat)}
              </p>
            </div>

            {/* Unread badge - placeholder for future implementation */}
            {chat.unread_count > 0 && (
              <Badge className="bg-orange-500 text-white">
                {chat.unread_count}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  onSelectChat: PropTypes.func.isRequired,
};
