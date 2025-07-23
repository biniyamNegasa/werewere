import { useState } from "react";
import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// Import our new components
import ListPanel from "@/components/ListPanel";
import ChatWindow from "@/components/ChatWindow";

export default function ChatsIndex({ chats, contacts, auth }) {
  const [activeChat, setActiveChat] = useState(null);

  // We need to filter out the current user from the chat participants list
  // to display the other person's name correctly.
  const processedChats = chats.map((chat) => ({
    ...chat,
    users: chat.users.filter((user) => user.id !== auth.user.id),
  }));

  return (
    <>
      <Head title="Chats" />
      <main className="h-screen bg-background text-foreground overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden md:flex h-full">
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border"
          >
            <ResizablePanel defaultSize={30} minSize={20}>
              <ListPanel
                chats={processedChats}
                contacts={contacts}
                onSelectChat={setActiveChat}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
              <ChatWindow
                activeChat={activeChat}
                onMobileBack={() => setActiveChat(null)} // Not used on desktop, but good practice
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden h-full">
          {/* Show list panel if no chat is active */}
          {!activeChat && (
            <ListPanel
              chats={processedChats}
              contacts={contacts}
              onSelectChat={setActiveChat}
            />
          )}

          {/* Show chat window if a chat is active */}
          {activeChat && (
            <ChatWindow
              activeChat={activeChat}
              onMobileBack={() => setActiveChat(null)}
            />
          )}
        </div>
      </main>
    </>
  );
}

ChatsIndex.propTypes = {
  chats: PropTypes.array.isRequired,
  contacts: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
};
