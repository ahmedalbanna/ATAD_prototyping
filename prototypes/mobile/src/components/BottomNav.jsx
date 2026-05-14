import { Link, useLocation } from "react-router-dom";
import { Home, Package, ClipboardList, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const location = useLocation();
  const { isLessor } = useAuth();

  const navItems = isLessor
    ? [
        { to: "/home", label: "الرئيسية", icon: Home },
        { to: "/assets", label: "الأصول", icon: Package },
        { to: "/lessor-dashboard", label: "لوحتي", icon: LayoutDashboard },
        { to: "/profile", label: "حسابي", icon: User },
      ]
    : [
        { to: "/home", label: "الرئيسية", icon: Home },
        { to: "/assets", label: "الأصول", icon: Package },
        { to: "/bookings", label: "طلباتي", icon: ClipboardList },
        { to: "/profile", label: "حسابي", icon: User },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-center px-4 pb-2 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-100/60 shadow-lg flex items-center h-14 max-w-lg w-full px-1 pointer-events-auto">
        <div className="flex justify-around items-center w-full h-full px-1 gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.to === "/home"
              ? location.pathname === "/home"
              : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-400 hover:text-gray-500"
                }`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
