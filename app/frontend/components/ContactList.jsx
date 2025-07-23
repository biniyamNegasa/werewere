import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import { chats_path } from "@/routes"; // Explicitly import the route helper

export default function ContactList({ contacts }) {
  if (!contacts || contacts.length === 0) {
    return <p className="text-muted-foreground p-4">No contacts added yet.</p>;
  }

  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <Link
            href={chats_path({ user_id: contact.id })} // Use the route helper for POST to create chat
            method="post"
            data={{ user_id: contact.id }}
            as="button"
            className="w-full text-left p-2 hover:bg-secondary rounded-md transition-colors"
          >
            {contact.username || contact.email}
          </Link>
        </li>
      ))}
    </ul>
  );
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
};
