import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import PropTypes from "prop-types";
import AppNavigationRail from "@/components/AppNavigationRail";
import ListPanel from "@/components/ListPanel";
import ChatWindow from "@/components/ChatWindow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { chats_path } from "@/routes";
import { useChatListChannel } from "@/hooks/useChatListChannel";

export default function ChatsIndex({
  chats: initialChats,
  contacts,
  auth,
  flash,
  preselectedChat,
}) {
  const [activeList, setActiveList] = useState("chats");
  const [activeChat, setActiveChat] = useState(preselectedChat || null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFlashMessage, setShowFlashMessage] = useState(true);
  const [chats, setChats] = useState(initialChats);

  const processedChats = chats.map((chat) => ({
    ...chat,
    users: Array.isArray(chat.users)
      ? chat.users.filter((user) => user.id !== auth.user.id)
      : [],
  }));

  useChatListChannel(auth.user.id, (data) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === data.chat_id ? { ...chat, unread_count: data.unread_count, last_message: data.last_message } : chat
      )
    );
  });

  useEffect(() => {
    setActiveChat(preselectedChat || null);
  }, [preselectedChat]);

  // Auto-hide flash messages after 5 seconds
  useEffect(() => {
    if (flash?.alert || flash?.notice) {
      const timer = setTimeout(() => {
        setShowFlashMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setIsMobileMenuOpen(false);

    if (activeList === "contacts") {
      setActiveList("chats");
    }
  };

  const handleBackToList = () => {
    router.push(chats_path());
  };

  return (
    <>
      <Head title="WereWere - Chats" />
      <main className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        {/* Flash Messages */}
        {showFlashMessage && (flash?.alert || flash?.notice) && (
          <div className="p-4 border-b">
            {flash.alert && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{flash.alert}</AlertDescription>
              </Alert>
            )}
            {flash.notice && (
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{flash.notice}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Rail - Always visible on desktop, toggleable on mobile */}
          <div
            className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-50 transition-transform duration-300 ease-in-out`}
          >
            <AppNavigationRail
              activeList={activeList}
              onSelect={setActiveList}
              currentUser={auth.user}
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>

          {/* Mobile overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex h-full relative">
            {/* List Panel */}
            <div
              className={`
              ${activeChat ? "hidden md:flex" : "flex"} 
              w-full md:w-80 lg:w-96 h-full border-r border-border bg-card
            `}
            >
              <ListPanel
                chats={processedChats}
                contacts={contacts}
                activeList={activeList}
                onSelectChat={handleSelectChat}
                onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
              />
            </div>

            {/* Chat Window */}
            <div
              className={`
              ${!activeChat ? "hidden md:flex" : "flex"} 
              flex-1 h-full
            `}
            >
              <ChatWindow
                activeChat={activeChat}
                currentUser={auth.user}
                onBack={handleBackToList}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

ChatsIndex.propTypes = {
  chats: PropTypes.array.isRequired,
  contacts: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  flash: PropTypes.object,
  preselectedChat: PropTypes.object,
};
