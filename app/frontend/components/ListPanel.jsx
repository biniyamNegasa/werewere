import React from "react";
import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import { chats_path } from "@/routes";

export default function ListPanel({ chats, contacts, onSelectChat }) {
  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">Chats</h1>
        {/* Search bar will go here */}
      </header>

      <div className="flex-grow overflow-y-auto">
        {/* This is a simplified version. We'll add the Chat/Contact toggle later. */}
        {/* For now, we show both lists. */}
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-muted-foreground">
            Contacts
          </h2>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <Link
                  href={chats_path({ user_id: contact.id })}
                  method="post"
                  data={{ user_id: contact.id }}
                  as="button"
                  className="w-full text-left p-2 hover:bg-secondary rounded-md"
                >
                  {contact.username || contact.email}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-4 border-t">
          <h2 className="text-lg font-semibold mb-2 text-muted-foreground">
            Conversations
          </h2>
          <ul>
            {chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className="w-full text-left p-2 cursor-pointer hover:bg-secondary rounded-md"
              >
                {/* Find the other user in the chat to display their name */}
                Chat with {chat.users[0]?.email || "User"}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

ListPanel.propTypes = {
  chats: PropTypes.array.isRequired,
  contacts: PropTypes.array.isRequired,
  onSelectChat: PropTypes.func.isRequired,
};
