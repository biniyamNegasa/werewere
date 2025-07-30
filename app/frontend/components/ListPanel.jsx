import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, Plus } from "lucide-react";
import AddContactModal from "@/components/AddContactModal";
import ChatList from "@/components/ChatList";
import ContactList from "@/components/ContactList";
import SettingsPanel from "@/components/SettingsPanel";
import { useChatStore } from "@/stores/chatStore";

export default function ListPanel({
  activeList,
  setActiveList,
  onMobileMenuToggle,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const chats = useChatStore((state) => state.chats);
  const currentUser = useChatStore((state) => state.currentUser);
  const contacts = useChatStore((state) => state.contacts);
  const setActiveChat = useChatStore((state) => state.setActiveChat);

  const processedChats = useMemo(() => {
    if (!currentUser) return [];
    return chats.map((chat) => ({
      ...chat,
      users: Array.isArray(chat.users)
        ? chat.users.filter((user) => user.id !== currentUser.id)
        : [],
    }));
  }, [chats, currentUser]);

  const getTitle = () => {
    switch (activeList) {
      case "contacts":
        return "Contacts";
      case "settings":
        return "Settings";
      default:
        return "Chats";
    }
  };

  const filteredChats = processedChats.filter((chat) => {
    if (!searchQuery) return true;
    const otherUser = chat.users[0];
    const searchTerm = searchQuery.toLowerCase();
    return (
      otherUser?.username?.toLowerCase().includes(searchTerm) ||
      otherUser?.email?.toLowerCase().includes(searchTerm) ||
      chat.name?.toLowerCase().includes(searchTerm)
    );
  });

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true;
    const searchTerm = searchQuery.toLowerCase();
    return (
      contact.username?.toLowerCase().includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="h-full flex flex-col bg-card w-full">
      <header className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuToggle}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">
              {getTitle()}
            </h1>
          </div>
          {/* The Plus button now opens the modal */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsAddContactOpen(true)}
            className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {(activeList === "chats" || activeList === "contacts") && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={`Search ${activeList}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        {activeList === "chats" && (
          <ChatList
            chats={filteredChats}
            onSelectChat={(chat) => setActiveChat(chat.id)}
          />
        )}
        {activeList === "contacts" && (
          <ContactList
            contacts={filteredContacts}
            setActiveList={setActiveList}
          />
        )}
        {activeList === "settings" && <SettingsPanel />}
      </div>

      {/* Render the Modal */}
      <AddContactModal
        isOpen={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
      />
    </div>
  );
}

ListPanel.propTypes = {
  activeList: PropTypes.string.isRequired,
  setActiveList: PropTypes.func.isRequired,
  onMobileMenuToggle: PropTypes.func,
};
