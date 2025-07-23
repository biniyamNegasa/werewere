import PropTypes from "prop-types";
import { Button } from "@/components/ui/button"; // shadcn Button
import ThemeToggle from "@/components/ThemeToggle"; // Our theme toggle component
import { Link } from "@inertiajs/react"; // <--- Import Link
import { destroy_user_session_path } from "@/routes"; // <--- Import logout route helper

export default function AppNavigationRail({ activeList, onSelect }) {
  return (
    <nav className="h-full flex flex-col items-center py-4 bg-primary text-primary-foreground border-r shrink-0">
      <h2 className="sr-only">App Navigation</h2>{" "}
      {/* Screen reader only heading */}
      <ul className="space-y-2 flex-grow">
        {" "}
        {/* flex-grow pushes settings to bottom */}
        <li>
          <Button
            variant={activeList === "chats" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onSelect("chats")}
            aria-label="Show Chats"
            className="w-10 h-10 rounded-full"
          >
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
            👥
          </Button>
        </li>
        {/* You can add a settings button here if you want a separate settings page */}
        {/* <li>
          <Button
            variant={activeList === 'settings' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onSelect('settings')}
            aria-label="Open Settings"
            className="w-10 h-10 rounded-full"
          >
            ⚙️
          </Button>
        </li> */}
      </ul>
      <div className="mt-auto flex flex-col items-center space-y-2">
        {" "}
        {/* Added flex-col and space-y */}
        <ThemeToggle />
        {/* --- ADD THE LOGOUT BUTTON HERE --- */}
        <Link
          href={destroy_user_session_path()} // The Devise logout path
          method="delete" // Crucial: Devise logout is a DELETE request
          as="button"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive text-destructive-foreground hover:bg-destructive/90"
          aria-label="Sign Out"
        >
          🚪 Logout {/* Or a more appropriate icon */}
        </Link>
        {/* --- END LOGOUT BUTTON --- */}
      </div>
    </nav>
  );
}

AppNavigationRail.propTypes = {
  activeList: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
