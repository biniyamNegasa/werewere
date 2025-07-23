import { useState } from "react";
import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import AppNavigationRail from "@/components/AppNavigationRail";
import ListPanel from "@/components/ListPanel";
import ChatWindow from "@/components/ChatWindow";
import ChatList from "@/components/ChatList";
import ContactList from "@/components/ContactList";

export default function ChatsIndex({ chats, contacts, auth }) {
  const [activeList, setActiveList] = useState("chats");
  const [activeChat, setActiveChat] = useState(null);

  const processedChats = chats.map((chat) => ({
    ...chat,
    users: chat.users.filter((user) => user.id !== auth.user.id),
  }));

  return (
    <>
      <Head title="Chats" />
      <main className="h-screen bg-background text-foreground overflow-hidden">
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:flex h-full">
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border"
          >
            {/* Column 1: App Navigation Rail */}
            <ResizablePanel defaultSize={5} minSize={5} maxSize={8}>
              <AppNavigationRail
                activeList={activeList}
                onSelect={setActiveList}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />

            {/* Column 2: List Panel (Chats/Contacts) */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <ListPanel
                chats={processedChats}
                contacts={contacts}
                activeList={activeList}
                onSelectChat={setActiveChat}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />

            {/* Column 3: Chat Window */}
            <ResizablePanel defaultSize={70}>
              <ChatWindow
                activeChat={activeChat}
                currentUser={auth.user}
                onMobileBack={() => setActiveChat(null)}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout (default, up to md) */}
        <div className="md:hidden h-full">
          {/* Show List Panel if no chat is active */}
          {!activeChat && (
            // The mobile list view will combine the rail and the panel logic for simplicity
            <div className="h-full flex flex-col">
              <header className="p-4 border-b bg-background flex items-center justify-between">
                <h1 className="text-xl font-bold">Chats</h1>
                {/* Mobile Navigation / Menu button can go here */}
                <AppNavigationRail
                  activeList={activeList}
                  onSelect={setActiveList}
                />
              </header>
              <section className="flex-grow overflow-y-auto p-4">
                {activeList === "chats" && (
                  <ChatList
                    chats={processedChats}
                    onSelectChat={setActiveChat}
                  />
                )}
                {activeList === "contacts" && (
                  <ContactList contacts={contacts} />
                )}
                {activeList === "settings" && (
                  <div className="text-muted-foreground">
                    Settings content will go here.
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Show Chat Window if a chat is active */}
          {activeChat && (
            <ChatWindow
              activeChat={activeChat}
              currentUser={auth.user}
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
