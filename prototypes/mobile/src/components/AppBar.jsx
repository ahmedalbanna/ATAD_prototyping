import { Link } from "react-router-dom";
import { Bell, ArrowRight, Menu } from "lucide-react";
import { useBookings } from "../context/BookingContext";

export default function AppBar({ title, onBack, onMenuOpen }) {
  const { unreadCount } = useBookings();
  return (
    <header className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 transition-all duration-300 glass relative shadow-[0_4px_20px_-8px_rgba(225,74,17,0.12)] before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:bg-gradient-to-l before:from-primary/40 before:via-accent/30 before:to-transparent">
      {onBack ? (
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 p-1 -mr-1 transition-all hover:scale-110 active:scale-95">
          <ArrowRight className="w-5 h-5" />
        </button>
      ) : (
        <button onClick={onMenuOpen}
          className="text-gray-600 hover:text-gray-900 p-1 -mr-1 md:hidden transition-all hover:scale-110 active:scale-95">
          <Menu className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-lg font-bold font-heading flex-1 text-gray-900">
        {title || "عتاد"}
      </h1>
      <Link to="/notifications"
        className="relative p-1.5 rounded-xl transition-all hover:scale-110 active:scale-95 text-gray-400 hover:bg-gray-100">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary/30 animate-scale-in">
            {unreadCount}
          </span>
        )}
      </Link>
    </header>
  );
}
