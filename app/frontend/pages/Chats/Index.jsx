import { useState, useEffect, useMemo } from "react";
import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AppNavigationRail from "@/components/AppNavigationRail";
import ListPanel from "@/components/ListPanel";
import ChatWindow from "@/components/ChatWindow";
import { useChatStore } from "@/stores/chatStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { usePresence } from "@/hooks/usePresence";

export default function ChatsIndex(props) {
  const syncProps = useChatStore((state) => state.syncProps);
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const currentUser = useChatStore((state) => state.currentUser);
  const setPresence = useChatStore((state) => state.setPresence);

  const allUserPresence = usePresence();

  useEffect(() => {
    setPresence(allUserPresence);
  }, [allUserPresence, setPresence]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId),
    [chats, activeChatId],
  );

  const [activeList, setActiveList] = useState("chats");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFlashMessage, setShowFlashMessage] = useState(true);

  useEffect(() => {
    syncProps(props);
  }, [props]);

  useEffect(() => {
    if (props.flash?.alert || props.flash?.notice) {
      const timer = setTimeout(() => setShowFlashMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [props.flash]);

  const handleBackToList = () => {
    setActiveChat(null);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Head title="WereWere - Chats" />
      <main className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        {/* Flash Messages */}
        {showFlashMessage && (props.flash?.alert || props.flash?.notice) && (
          <div className="p-4 border-b border-border">
            {props.flash.alert && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{props.flash.alert}</AlertDescription>
              </Alert>
            )}
            {props.flash.notice && (
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{props.flash.notice}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <div
            className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} h-full md:translate-x-0 fixed md:relative z-50 transition-transform duration-300 ease-in-out`}
          >
            <AppNavigationRail
              activeList={activeList}
              onSelect={setActiveList}
              currentUser={currentUser}
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>

          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          <div className="flex-1 flex h-full relative">
            <div
              className={`${activeChat ? "hidden md:flex" : "flex"} w-full md:w-2/5 h-full border-r border-border bg-card`}
            >
              <ListPanel
                activeList={activeList}
                setActiveList={setActiveList}
                onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
                activeChat={activeChat}
              />
            </div>

            <div
              className={`${!activeChat ? "hidden md:flex" : "flex"} flex-1 h-full`}
            >
              <ChatWindow activeChat={activeChat} onBack={handleBackToList} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

ChatsIndex.propTypes = {
  chats: PropTypes.array,
  contacts: PropTypes.array,
  auth: PropTypes.object.isRequired,
  flash: PropTypes.object,
  preselectedChat: PropTypes.object,
};
