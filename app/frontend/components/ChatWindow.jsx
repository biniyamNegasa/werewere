import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { usePresence } from "@/hooks/usePresence";
import { useChatStore } from "@/stores/chatStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  UserPlus,
  Phone,
  Video,
} from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { contacts_path } from "@/routes";

export default function ChatWindow({ activeChat, onBack }) {
  const currentUser = useChatStore((state) => state.currentUser);
  const speak = useChatStore((state) => state.speak);
  const contacts = useChatStore((state) => state.contacts);

  const [newMessageBody, setNewMessageBody] = useState("");

  // This hook is self-contained and can remain.
  const allUsersPresence = usePresence();

  const messagesEndRef = useRef(null);
  const chatHeaderRef = useRef(null);
  const chatComposerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessageBody.trim()) {
      speak(newMessageBody);
      setNewMessageBody("");
    }
  };

  if (!activeChat || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
        <div className="text-center flex flex-col justify-center items-center">
          <div className="w-24 h-24 bg-orange-200 dark:bg-orange-800/30 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Welcome to WereWere
          </h2>
          <p className="text-muted-foreground">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  const otherUser = activeChat.users.find((user) => user.id !== currentUser.id);
  const chatName =
    activeChat.chat_type === "direct_chat"
      ? otherUser?.username || otherUser?.email || "Direct Chat"
      : activeChat.name;

  const isDirectChat = activeChat.chat_type === "direct_chat";
  const isContact = contacts.some((contact) => contact.id === otherUser?.id);
  const currentOtherUserPresence = allUsersPresence[otherUser?.id] || otherUser;

  const getInitials = (user) => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "??";
  };

  const displayStatus = () => {
    if (!otherUser) return "";
    if (currentOtherUserPresence?.status === "online") {
      return <span className="text-green-500 font-medium text-sm">Online</span>;
    } else if (currentOtherUserPresence?.last_seen_at) {
      const lastSeen = new Date(currentOtherUserPresence.last_seen_at);
      const distance = formatDistanceToNowStrict(lastSeen, { addSuffix: true });
      return (
        <span className="text-muted-foreground text-sm">
          last seen {distance}
        </span>
      );
    }
    return "";
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Header */}
      <header
        ref={chatHeaderRef}
        className="p-4 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10 border-2 border-orange-100 dark:border-orange-900/20">
            <AvatarFallback className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-medium">
              {getInitials(otherUser)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-foreground">{chatName}</h1>
            {displayStatus()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Video className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* This item only shows if it's a direct chat and the other user is NOT already a contact */}
              {isDirectChat && !isContact && otherUser && (
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <Link
                    href={contacts_path()}
                    method="post"
                    data={{ contact_id: otherUser.id }}
                    as="button"
                    className="w-full flex items-center"
                    preserveScroll
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Add to Contacts</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        //  dynamic height calculation
        style={{
          height: `calc(100vh - ${chatHeaderRef.current?.offsetHeight || 68}px - ${
            chatComposerRef.current?.offsetHeight || 72
          }px)`,
        }}
      >
        {/* Render messages directly from the prop */}
        {(activeChat.messages || []).map((message) => {
          const isOwn = message.user_id === currentUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {!isOwn && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs">
                      {getInitials(message.user)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwn
                      ? "bg-orange-500 text-white rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{message.body}</p>
                  <div
                    className={`flex items-center justify-end mt-1 space-x-1 ${isOwn ? "text-orange-100" : "text-muted-foreground"}`}
                  >
                    <span className="text-xs">
                      {format(new Date(message.created_at), "HH:mm")}
                    </span>
                    {isOwn && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                        <div className="w-1 h-1 bg-current rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <footer
        ref={chatComposerRef}
        className="p-4 border-t border-border bg-card/50 backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <Input
            type="text"
            value={newMessageBody}
            onChange={(e) => setNewMessageBody(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-background border-orange-200 focus:border-orange-500 focus:ring-orange-500"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={!newMessageBody.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}

ChatWindow.propTypes = {
  activeChat: PropTypes.object,
  onBack: PropTypes.func.isRequired,
};
