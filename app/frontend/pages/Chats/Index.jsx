import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react"; // Ensure router is imported
import PropTypes from "prop-types";

import AppNavigationRail from "@/components/AppNavigationRail";
import ListPanel from "@/components/ListPanel";
import ChatWindow from "@/components/ChatWindow";

export default function ChatsIndex({
  chats,
  contacts,
  auth,
  flash,
  preselectedChat,
}) {
  // State for which list is active in the sidebar (e.g., 'chats', 'contacts', 'settings')
  const [activeList, setActiveList] = useState("chats");
  // State for which specific chat is active in the main window.
  // Initialize with preselectedChat if available (e.g., from a deep link or new chat creation).
  const [activeChat, setActiveChat] = useState(preselectedChat || null);

  // Process chats: filter out the current user from chat participants to display the "other user".
  const processedChats = chats.map((chat) => ({
    ...chat,
    users: Array.isArray(chat.users)
      ? chat.users.filter((user) => user.id !== auth.user.id)
      : [],
  }));

  // Effect to handle flash messages (e.g., from creating a chat via POST)
  useEffect(() => {
    if (flash?.alert) {
      console.warn("Flash Alert:", flash.alert); // Implement a shadcn Toast for this later
    }
  }, [flash]);

  // Effect to handle setting activeChat if preselectedChat changes (e.g., via subsequent Inertia visits)
  useEffect(() => {
    if (preselectedChat && preselectedChat.id !== activeChat?.id) {
      setActiveChat(preselectedChat);
    }
  }, [preselectedChat, activeChat]);

  return (
    <>
      <Head title="Chats" />
      <main className="h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
        {/* --- Left Column: App Navigation Rail (always visible) --- */}
        {/* This column is fixed width and acts as the primary app navigation */}
        <AppNavigationRail activeList={activeList} onSelect={setActiveList} />

        {/* --- Main Content Area: Flexes to fill remaining space --- */}
        {/* This div manages the conditional display of ListPanel and ChatWindow. */}
        <div className="flex-grow h-full relative">
          {/*
            List Panel View (for displaying chats/contacts/settings list)
            - On mobile: 'hidden' if a chat is active, 'block' if not.
            - On desktop (md:): Always 'block' and takes 1/3 width.
            - Absolute positioning for mobile slide-in/out effect.
          */}
          <div
            className={`${activeChat ? "hidden" : "block"} md:block h-full md:w-1/3 md:border-r border-border absolute md:relative left-0 top-0 w-full`}
          >
            <ListPanel
              chats={processedChats}
              contacts={contacts}
              activeList={activeList}
              onSelectChat={setActiveChat} // This function now directly controls `activeChat` state
            />
          </div>

          {/*
            Chat Window View (for displaying the actual chat conversation)
            - On mobile: 'hidden' if no chat is active, 'block' if active.
            - On desktop (md:): Always 'block' and takes 2/3 width.
            - Absolute positioning for mobile slide-in/out effect.
          */}
          <div
            className={`${!activeChat ? "hidden" : "block"} md:block h-full md:w-2/3 absolute md:relative right-0 top-0 w-full`}
          >
            <ChatWindow
              activeChat={activeChat} // Pass the active chat object (can be null)
              currentUser={auth.user}
              onBack={() => setActiveChat(null)} // Callback to close chat and show list
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
  flash: PropTypes.object, // Add flash to propTypes (optional, will be empty if not present)
  preselectedChat: PropTypes.object, // Add preselectedChat to propTypes (optional, will be null if not present)
};
