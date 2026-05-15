import { Link, useLocation } from "react-router-dom";
import { Home, Package, ClipboardList, User, LayoutDashboard, Wallet, Settings, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const { user, isLessor } = useAuth();
  const initial = user?.name?.[0] || "ز";

  const navItems = isLessor
    ? [
        { to: "/home", label: "الرئيسية", icon: Home },
        { to: "/assets", label: "تصفح الأصول", icon: Package },
        { to: "/lessor-dashboard", label: "إدارة الطلبات", icon: ClipboardList },
        { to: "/lessor-assets", label: "إدارة الأصول", icon: Settings },
        { to: "/lessor-earnings", label: "الأرباح", icon: Wallet },
        { to: "/profile", label: "حسابي", icon: User },
      ]
    : [
        { to: "/home", label: "الرئيسية", icon: Home },
        { to: "/assets", label: "الأصول", icon: Package },
        { to: "/bookings", label: "طلباتي", icon: ClipboardList },
        { to: "/profile", label: "حسابي", icon: User },
      ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-64 bg-white shadow-2xl h-full p-4 flex flex-col">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shadow-md">
              {initial}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">{user?.name || "زائر"}</p>
              <p className="text-xs text-gray-400">{user ? roleLabels[user.role] : "زائر"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-all hover:rotate-90">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-0.5 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.to === "/home"
              ? location.pathname === "/home"
              : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-gray-100 space-y-1.5">
          <Link to="/terms" onClick={onClose}
            className="block text-xs text-gray-400 hover:text-gray-600 transition-colors">الشروط والأحكام</Link>
          <p className="text-xs text-gray-300">عتاد v1.0.0</p>
        </div>
      </div>
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
}
