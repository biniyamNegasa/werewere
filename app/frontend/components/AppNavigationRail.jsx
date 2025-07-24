import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Users, Settings, LogOut, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Link } from "@inertiajs/react";
import { destroy_user_session_path } from "@/routes";

export default function AppNavigationRail({
  activeList,
  onSelect,
  currentUser,
  onMobileMenuToggle,
}) {
  const getInitials = (user) => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="h-full w-16 md:w-20 flex flex-col items-center py-4 bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-lg">
      {/* Mobile menu button - only visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMobileMenuToggle}
        className="md:hidden mb-4 text-white hover:bg-white/20"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Logo */}
      <div className="mb-6">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col space-y-3">
        <Button
          variant={activeList === "chats" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onSelect("chats")}
          className={`w-12 h-12 rounded-xl transition-all ${
            activeList === "chats"
              ? "bg-white text-orange-500 shadow-lg"
              : "text-white hover:bg-white/20"
          }`}
          title="Chats"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>

        <Button
          variant={activeList === "contacts" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onSelect("contacts")}
          className={`w-12 h-12 rounded-xl transition-all ${
            activeList === "contacts"
              ? "bg-white text-orange-500 shadow-lg"
              : "text-white hover:bg-white/20"
          }`}
          title="Contacts"
        >
          <Users className="w-5 h-5" />
        </Button>

        <Button
          variant={activeList === "settings" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onSelect("settings")}
          className={`w-12 h-12 rounded-xl transition-all ${
            activeList === "settings"
              ? "bg-white text-orange-500 shadow-lg"
              : "text-white hover:bg-white/20"
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-3">
        {/* User Avatar */}
        <Avatar className="w-10 h-10 border-2 border-white/30">
          <AvatarFallback className="bg-white/20 text-white text-sm font-medium">
            {getInitials(currentUser)}
          </AvatarFallback>
        </Avatar>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Logout Button */}
        <Link
          href={destroy_user_session_path()}
          method="delete"
          as="button"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-red-500/20 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
}

AppNavigationRail.propTypes = {
  activeList: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  onMobileMenuToggle: PropTypes.func,
};
