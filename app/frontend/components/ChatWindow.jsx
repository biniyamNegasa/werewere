import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useChatChannel } from "@/hooks/useChatChannel";
import { usePresence } from "@/hooks/usePresence";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNowStrict } from "date-fns";

export default function ChatWindow({ activeChat, currentUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessageBody, setNewMessageBody] = useState("");
  const messagesEndRef = useRef(null);
  const chatHeaderRef = useRef(null);
  const chatComposerRef = useRef(null);
  const [chatBodyHeight, setChatBodyHeight] = useState("calc(100vh - 10rem)");

  // Reset messages state and potentially subscribe when activeChat changes
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages);
    } else {
      setMessages([]); // Clear messages if no chat is active
    }
  }, [activeChat]);

  // Memoize the callback to prevent re-subscriptions issues
  const handleMessageReceived = useCallback((newMessage) => {
    setMessages((prevMessages) => {
      // Prevent duplicate messages if broadcast happens before Inertia update
      if (prevMessages.some((msg) => msg.id === newMessage.id)) {
        return prevMessages;
      }
      return [...prevMessages, newMessage];
    });
  }, []);

  // Subscribe to the chat channel only if activeChat is present
  const { speak } = useChatChannel(activeChat?.id, handleMessageReceived);
  const allUsersPresence = usePresence(); // Global presence data

  // Auto-scroll to bottom on new message
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);

  // Calculate dynamic height for message history area (adjusts to header/composer height)
  useEffect(() => {
    const updateChatBodyHeight = () => {
      if (chatHeaderRef.current && chatComposerRef.current) {
        const headerHeight = chatHeaderRef.current.offsetHeight;
        const composerHeight = chatComposerRef.current.offsetHeight;
        setChatBodyHeight(
          `calc(100vh - ${headerHeight}px - ${composerHeight}px)`,
        );
      }
    };
    updateChatBodyHeight();
    window.addEventListener("resize", updateChatBodyHeight);
    return () => window.removeEventListener("resize", updateChatBodyHeight);
  }, [chatHeaderRef, chatComposerRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessageBody.trim() && activeChat) {
      // Only send if a chat is active
      speak(newMessageBody); // Send message via Action Cable
      setNewMessageBody("");
    }
  };

  // If no chat is active, display the placeholder for both desktop and mobile
  if (!activeChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-card text-card-foreground">
        <p className="text-muted-foreground">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  // If a chat IS active, render the full chat interface
  const otherUser = activeChat.users.find((user) => user.id !== currentUser.id);
  const chatName =
    activeChat.chat_type === "direct_chat"
      ? otherUser?.username || otherUser?.email || "Direct Chat"
      : activeChat.name;

  // Get the most up-to-date status for the other user from global presence hook
  const currentOtherUserPresence = allUsersPresence[otherUser?.id] || otherUser;

  const displayStatus = () => {
    if (!otherUser) return "";

    if (currentOtherUserPresence.status === "online") {
      return <span className="text-green-500 font-medium ml-2">Online</span>;
    } else if (currentOtherUserPresence.last_seen_at) {
      const lastSeen = new Date(currentOtherUserPresence.last_seen_at);
      const distance = formatDistanceToNowStrict(lastSeen, { addSuffix: true });
      return (
        <span className="text-muted-foreground text-sm ml-2">
          last seen {distance}
        </span>
      );
    }
    return "";
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <header
        ref={chatHeaderRef}
        className="p-4 border-b flex items-center bg-card text-card-foreground shrink-0"
      >
        <Button
          onClick={onBack} // Call the onBack prop (from Chats/Index)
          variant="ghost"
          size="icon"
          className="mr-4 md:hidden" // Show only on mobile, hide on desktop
          aria-label="Back to chats list"
        >
          ←
        </Button>
        <h1 className="font-semibold text-lg">{chatName}</h1>
        {displayStatus()}
      </header>

      <section
        className="flex-grow p-4 overflow-y-auto"
        style={{ height: chatBodyHeight }}
      >
        <div className="flex flex-col space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user_id === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.user_id === currentUser.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="font-semibold text-sm mb-1">
                  {message.user?.username || message.user?.email || "Unknown"}
                </p>
                <p>{message.body}</p>
                <span className="text-xs text-right block mt-1 opacity-75">
                  {format(new Date(message.created_at), "p")}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* For auto-scrolling */}
        </div>
      </section>

      <footer
        ref={chatComposerRef}
        className="p-4 border-t bg-card text-card-foreground shrink-0"
      >
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="text"
            value={newMessageBody}
            onChange={(e) => setNewMessageBody(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </footer>
    </div>
  );
}

ChatWindow.propTypes = {
  activeChat: PropTypes.object, // Can be null if no chat is selected
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired, // Callback for the mobile back button
};
