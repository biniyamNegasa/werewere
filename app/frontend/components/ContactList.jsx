import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chats_path } from "@/routes";

export default function ContactList({ contacts }) {
  if (!contacts || contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <p className="text-muted-foreground font-medium">No contacts yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Search for users to add them as contacts
        </p>
      </div>
    );
  }

  const getInitials = (contact) => {
    if (contact.username) {
      return contact.username.substring(0, 2).toUpperCase();
    }
    return contact.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-2">
      {contacts.map((contact) => (
        <Link
          key={contact.id}
          href={chats_path()}
          method="post"
          data={{ user_id: contact.id }}
          as="button"
          className="w-full"
        >
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/10 transition-colors group">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 border-2 border-orange-100 dark:border-orange-900/20">
                <AvatarFallback className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-medium">
                  {getInitials(contact)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {contact.username || contact.email}
                </h3>
                {contact.username && (
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
};
