import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { users_search_path, contacts_path } from "@/routes";

export default function AddContactModal({ isOpen, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // This useEffect handles the "debounced" search. It waits for the user
  // to stop typing for 300ms before sending a request.
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      // Use the js-routes helper to get the correct path
      const searchPath = users_search_path({ query });

      axios
        .get(searchPath)
        .then((response) => setResults(response.data))
        .catch((error) => console.error("Search failed:", error))
        .finally(() => setIsLoading(false));
    }, 300);

    // Cleanup function: clear the timer if the user types again
    return () => clearTimeout(timer);
  }, [query]);

  const getInitials = (user) =>
    (user.username || user.email).substring(0, 2).toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Search for users by their username or email address.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search for users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {isLoading && (
              <p className="text-muted-foreground text-sm p-2">Searching...</p>
            )}
            {!isLoading && results.length === 0 && query && (
              <p className="text-muted-foreground text-sm p-2">
                No users found.
              </p>
            )}
            {results.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.username || user.email}</p>
                    {user.username && (
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                {/* This Link component makes a POST request to your ContactsController#create action */}
                <Link
                  href={contacts_path()}
                  method="post"
                  data={{ contact_id: user.id }}
                  as="button"
                  onSuccess={() => onOpenChange(false)} // Close modal on success
                  preserveScroll
                  // Apply button styles directly to the Link component
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-orange-500 text-white shadow hover:bg-orange-500/80 h-9 px-3 py-2 "
                >
                  Add
                </Link>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
