import { useState, useEffect, useRef, useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import PropTypes from "prop-types";
import { useChatChannel } from "@/hooks/useChatChannel";
import { usePresence } from "@/hooks/usePresence";
import { Input } from "@/components/ui/input"; // shadcn
import { Button } from "@/components/ui/button"; // shadcn
import { format, formatDistanceToNowStrict } from "date-fns"; // npm install date-fns
import { chats_path } from "@/routes";

export default function ChatShow({ chat, currentUser }) {
  // State for messages in this specific chat
  const [messages, setMessages] = useState(chat.messages);
  const [newMessageBody, setNewMessageBody] = useState("");
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const chatHeaderRef = useRef(null); // Ref for header height
  const chatComposerRef = useRef(null); // Ref for composer height
  const [chatBodyHeight, setChatBodyHeight] = useState("calc(100vh - 10rem)"); // Default guess

  // Memoize the callback to prevent re-subscriptions (important!)
  const handleMessageReceived = useCallback((newMessage) => {
    setMessages((prevMessages) => {
      // Prevent duplicate messages if broadcast happens before Inertia update
      if (prevMessages.some((msg) => msg.id === newMessage.id)) {
        return prevMessages;
      }
      return [...prevMessages, newMessage];
    });
  }, []);

  // Use our custom Action Cable hook
  const { speak } = useChatChannel(chat.id, handleMessageReceived);

  const allUsersPresence = usePresence();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]); // Scroll whenever messages state updates

  // Calculate dynamic height for message history area
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
    if (newMessageBody.trim()) {
      speak(newMessageBody); // Send message via Action Cable
      setNewMessageBody("");
    }
  };

  // Determine the other user's info for a direct chat header
  const otherUser = chat.users.find((user) => user.id !== currentUser.id);

  const currentOtherUserPresence = allUsersPresence[otherUser?.id] || otherUser;

  const chatName =
    chat.chat_type === "direct_chat"
      ? otherUser?.username || otherUser?.email || "Direct Chat"
      : chat.name;

  const displayStatus = () => {
    if (!otherUser) return "";

    if (currentOtherUserPresence.status === "online") {
      return <span className="text-green-500 font-medium ml-2">Online</span>;
    } else if (currentOtherUserPresence.last_seen_at) {
      const lastSeen = new Date(currentOtherUserPresence.last_seen_at);
      const distance = formatDistanceToNowStrict(lastSeen, {
        addSuffix: true,
      });

      return (
        <span className="text-muted-foreground text-sm ml-2">
          last seen {distance}
        </span>
      );
    }
    return "";
  };

  return (
    <>
      <Head title={chatName} />
      <main className="h-screen flex flex-col bg-background text-foreground">
        <header
          ref={chatHeaderRef}
          className="p-4 border-b flex items-center bg-background shrink-0"
        >
          <Button
            onClick={() => router.get(chats_path())} // Go back to the main chats list
            variant="ghost"
            size="icon"
            className="mr-4 md:hidden" // Show only on mobile, hide on desktop
            aria-label="Back to chat list"
          >
            ←
          </Button>
          <h1 className="font-semibold text-lg">{chatName}</h1>
          {/* Add online/offline status here later */}
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
                    {format(new Date(message.created_at), "p")}{" "}
                    {/* e.g., 9:30 AM */}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* For auto-scrolling */}
          </div>
        </section>

        <footer
          ref={chatComposerRef}
          className="p-4 border-t bg-background shrink-0"
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
      </main>
    </>
  );
}

ChatShow.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    chat_type: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        body: PropTypes.string.isRequired,
        user_id: PropTypes.number.isRequired,
        created_at: PropTypes.string.isRequired,
        user: PropTypes.shape({
          // Nested user object for message sender
          id: PropTypes.number.isRequired,
          email: PropTypes.string.isRequired,
          username: PropTypes.string,
        }),
      }),
    ).isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        // Participants in the chat
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
        username: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string,
  }).isRequired,
};
