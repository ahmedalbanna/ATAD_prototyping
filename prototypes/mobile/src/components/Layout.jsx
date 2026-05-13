import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ClipboardList, User, Bell, Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notifications } from "../data/mock";

const navItems = [
  { to: "/home", label: "الرئيسية", icon: Home },
  { to: "/assets", label: "الأصول", icon: Package },
  { to: "/bookings", label: "طلباتي", icon: ClipboardList },
  { to: "/profile", label: "حسابي", icon: User },
];

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر", admin: "مدير" };
const unreadCount = notifications.filter(n => !n.read).length;

export default function Layout({ children, title, onBack }) {
  const location = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = user?.name?.[0] || "ز";

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.005_85)] flex flex-col">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100/80 sticky top-0 z-30 px-4 py-3 flex items-center gap-3">
        {onBack ? (
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 p-1 -mr-1 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={() => setMenuOpen(true)} className="text-gray-600 hover:text-gray-900 p-1 -mr-1 md:hidden transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-bold text-gray-900 flex-1">{title || "عتاد"}</h1>
        <Link to="/notifications" className="relative text-gray-400 hover:text-primary transition-colors p-1">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-2xl h-full p-4 flex flex-col animate-slide-in">
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
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1 flex-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
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
              <Link to="/notifications" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                <Bell className="w-5 h-5 text-gray-400" />
                الإشعارات
                {unreadCount > 0 && (
                  <span className="mr-auto bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
                )}
              </Link>
            </nav>
            <div className="pt-4 border-t border-gray-100 space-y-1">
              <Link to="/terms" onClick={() => setMenuOpen(false)}
                className="block text-xs text-gray-400 hover:text-gray-600 transition-colors">الشروط والأحكام</Link>
              <p className="text-xs text-gray-300">عتاد v1.0.0</p>
            </div>
          </div>
          <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1 px-4 pb-24 pt-4 max-w-lg mx-auto w-full">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100/80 z-20">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex flex-col items-center gap-0.5 text-xs transition-all relative ${
                  isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                }`}>
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? "bg-primary/10" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
