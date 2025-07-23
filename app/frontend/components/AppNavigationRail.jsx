import PropTypes from "prop-types";
import { Button } from "@/components/ui/button"; // shadcn Button

export default function AppNavigationRail({ activeList, onSelect }) {
  return (
    <nav className="h-full flex flex-col items-center py-4 bg-primary text-primary-foreground border-r">
      <h2 className="sr-only">App Navigation</h2>{" "}
      {/* Screen reader only heading */}
      <ul className="space-y-2">
        <li>
          <Button
            variant={activeList === "chats" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onSelect("chats")}
            aria-label="Show Chats"
            className="w-10 h-10 rounded-full" // Make it circular like Telegram
          >
            {/* Placeholder for a chat icon */}
            💬
          </Button>
        </li>
        <li>
          <Button
            variant={activeList === "contacts" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onSelect("contacts")}
            aria-label="Show Contacts"
            className="w-10 h-10 rounded-full"
          >
            {/* Placeholder for a contacts icon */}
            👥
          </Button>
        </li>
        <li>
          <Button
            variant={activeList === "settings" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onSelect("settings")}
            aria-label="Open Settings"
            className="w-10 h-10 rounded-full"
          >
            {/* Placeholder for a settings icon */}
            ⚙️
          </Button>
        </li>
      </ul>
    </nav>
  );
}

AppNavigationRail.propTypes = {
  activeList: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
