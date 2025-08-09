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
import { chats_path, users_search_path } from "@/routes";

export default function NewChatModal({ isOpen, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset search when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(true);
      axios
        .get(users_search_path({ query }))
        .then((response) => setResults(response.data))
        .catch((error) => console.error("Search failed:", error))
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const getInitials = (user) =>
    (user.username || user.email).substring(0, 2).toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a New Chat</DialogTitle>
          <DialogDescription>
            Search for a user to start a conversation.
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
              <Link
                key={user.id}
                href={chats_path()}
                method="post"
                data={{ user_id: user.id }}
                as="button"
                preserveScroll
                onSuccess={() => {
                  // On success, close the modal and switch to the chats list
                  onOpenChange(false);
                }}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
