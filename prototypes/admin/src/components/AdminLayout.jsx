import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Package, ClipboardList, Wallet, Menu, X, ChevronLeft } from "lucide-react";
import Logo from "./Logo";

const navItems = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/admin/users", label: "المستخدمين", icon: Users },
  { to: "/admin/assets", label: "الأصول", icon: Package },
  { to: "/admin/bookings", label: "الطلبات", icon: ClipboardList },
  { to: "/admin/revenue", label: "الإيرادات", icon: Wallet },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-64 bg-sidebar text-white transform transition-all duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Logo className="w-28" />
            <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/40 text-xs mt-1">لوحة التحكم</p>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-white/10 text-white font-semibold shadow-sm"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}>
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-sm font-bold shadow-md">
              خ
            </div>
            <div>
              <p className="text-sm font-semibold">خالد المدير</p>
              <p className="text-xs text-white/40">مدير النظام</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-white/20 mr-auto" />
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100/80 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-gray-600 lg:hidden p-1">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-gray-900 flex-1">{title || "لوحة التحكم"}</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-sm font-bold text-primary shadow-sm">
              خ
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">خالد المدير</span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
