import PropTypes from "prop-types";

export default function ChatWindow({ activeChat, onMobileBack }) {
  // If no chat is active, render the placeholder (for desktop)
  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  // If a chat is active, render the chat interface
  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b flex items-center bg-background shrink-0">
        {/* Mobile-only back button */}
        <button
          onClick={onMobileBack}
          className="md:hidden mr-4 p-2 rounded-full hover:bg-secondary"
          aria-label="Back to chat list"
        >
          ←
        </button>
        <h2 className="font-semibold text-lg">
          Chat with {activeChat.users[0]?.email || "User"}
        </h2>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <p>Message history for chat {activeChat.id} will go here.</p>
      </main>

      <footer className="p-4 border-t bg-background shrink-0">
        <p>Message composer will go here.</p>
      </footer>
    </div>
  );
}

ChatWindow.propTypes = {
  // 'activeChat' can be null, so we don't use .isRequired
  activeChat: PropTypes.object,
  onMobileBack: PropTypes.func.isRequired,
};
