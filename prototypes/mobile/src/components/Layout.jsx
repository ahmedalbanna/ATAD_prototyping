import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ClipboardList, User, Bell, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notifications } from "../data/mock";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };
const unreadCount = notifications.filter(n => !n.read).length;

export default function Layout({ children, title, onBack }) {
  const location = useLocation();
  const { user, isLessor } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = user?.name?.[0] || "ز";
  const isHome = location.pathname === "/home";

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

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

  const activeIndex = navItems.findIndex(item => {
    if (item.to === "/home") return location.pathname === "/home";
    return location.pathname.startsWith(item.to);
  });

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col">
      {/* Header */}
      <header className={`sticky top-0 z-30 px-4 py-3 flex items-center gap-3 transition-all duration-300 ${
        isHome ? "bg-transparent" : "glass-strong border-b border-gray-100/60"
      }`}>
        {onBack ? (
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 p-1 -mr-1 transition-all hover:scale-110 active:scale-95">
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={() => setMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900 p-1 -mr-1 md:hidden transition-all hover:scale-110 active:scale-95">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className={`text-lg font-bold font-heading flex-1 transition-colors ${isHome ? "text-white" : "text-gray-900"}`}>
          {title || "عتاد"}
        </h1>
        <Link to="/notifications"
          className={`relative p-1.5 rounded-xl transition-all hover:scale-110 active:scale-95 ${
            isHome ? "text-white/80 hover:bg-white/10" : "text-gray-400 hover:bg-gray-100"
          }`}>
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary/30 animate-scale-in">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Slide menu */}
      {menuOpen && (
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
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 transition-all hover:rotate-90">
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
            <div className="pt-4 border-t border-gray-100 space-y-1.5">
              <Link to="/terms" onClick={() => setMenuOpen(false)}
                className="block text-xs text-gray-400 hover:text-gray-600 transition-colors">الشروط والأحكام</Link>
              <p className="text-xs text-gray-300">عتاد v1.0.0</p>
            </div>
          </div>
          <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1 px-4 pb-24 pt-4 max-w-lg mx-auto w-full page-enter">
        {children}
      </main>

      {/* Bottom nav - role-aware */}
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
    </div>
  );
}
