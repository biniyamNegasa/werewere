import PropTypes from "prop-types";
import ChatList from "@/components/ChatList";
import ContactList from "@/components/ContactList";

export default function ListPanel({
  chats,
  contacts,
  activeList,
  onSelectChat,
}) {
  return (
    <div className="h-full flex flex-col bg-background">
      <header className="p-4 border-b bg-background">
        {/* Placeholder for search input */}
        <h1 className="text-xl font-bold">
          {activeList === "contacts" ? "Contacts" : "Conversations"}
        </h1>
      </header>

      <section className="flex-grow overflow-y-auto p-4">
        {activeList === "chats" && (
          <ChatList chats={chats} onSelectChat={onSelectChat} />
        )}
        {activeList === "contacts" && <ContactList contacts={contacts} />}
        {activeList === "settings" && (
          <div className="text-muted-foreground p-4">
            Settings content will go here.
          </div>
        )}
      </section>
    </div>
  );
}

ListPanel.propTypes = {
  chats: PropTypes.array.isRequired,
  contacts: PropTypes.array.isRequired,
  activeList: PropTypes.string.isRequired,
  onSelectChat: PropTypes.func.isRequired,
};
