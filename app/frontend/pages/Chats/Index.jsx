import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AppNavigationRail from "@/components/AppNavigationRail";
import ListPanel from "@/components/ListPanel";
import ChatWindow from "@/components/ChatWindow";
import { useToast } from "@/hooks/useToast";

export default function ChatsIndex({
  chats,
  contacts,
  auth,
  flash,
  preselectedChat,
}) {
  const { toast } = useToast();
  const [activeList, setActiveList] = useState("chats");
  const [activeChat, setActiveChat] = useState(preselectedChat || null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const processedChats = chats.map((chat) => ({
    ...chat,
    users: Array.isArray(chat.users)
      ? chat.users.filter((user) => user.id !== auth.user.id)
      : [],
  }));

  useEffect(() => {
    if (flash?.alert) {
      toast({
        variant: "destructive",
        title: "Error",
        description: flash.alert,
      });
    }
    if (flash?.notice) {
      toast({
        title: "Success",
        description: flash.notice,
      });
    }
  }, [flash, toast]);

  useEffect(() => {
    setActiveChat(preselectedChat || null);
  }, [preselectedChat]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setIsMobileMenuOpen(false); // Close mobile menu when chat is selected
  };

  const handleBackToList = () => {
    setActiveChat(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Head title="WereWere - Chats" />
      <main className="h-screen bg-background text-foreground flex overflow-hidden">
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
