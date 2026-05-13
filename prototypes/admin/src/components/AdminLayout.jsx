import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Package, ClipboardList, Wallet, Menu, X, ChevronLeft, LogOut, Mail, Lock } from "lucide-react";
import Logo from "./Logo";
import { adminLogin, adminLogout } from "../services/apiClient";

const navItems = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/admin/users", label: "المستخدمين", icon: Users },
  { to: "/admin/assets", label: "الأصول", icon: Package },
  { to: "/admin/bookings", label: "الطلبات", icon: ClipboardList },
  { to: "/admin/revenue", label: "الإيرادات", icon: Wallet },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("atad_admin_token"));
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("atad_admin_token")) {
      setReady(true);
    } else {
      setReady(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoggingIn(true);
    setLoginError("");
    const ok = await adminLogin(loginEmail, loginPassword);
    if (ok) {
      setLoggedIn(true);
    } else {
      setLoginError("فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور");
    }
    setLoggingIn(false);
  };

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
    localStorage.removeItem("atad_admin_user");
    navigate("/admin/login");
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-black text-white">عت</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">لوحة التحكم</h1>
          <p className="text-sm text-gray-400 mb-6">تسجيل الدخول إلى لوحة التحكم</p>
          {loginError && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 border border-red-100">{loginError}</div>
          )}
          <div className="text-right space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  placeholder="admin@atad.sa" dir="ltr"
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••" dir="ltr"
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
            </div>
            <button onClick={handleLogin} disabled={loggingIn}
              className="w-full bg-primary text-white font-bold py-3 btn-pill hover:bg-primary-dark transition-all disabled:opacity-50">
              {loggingIn ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex">
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
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-sm font-bold shadow-md">
              خ
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">خالد المدير</p>
              <p className="text-xs text-white/40">مدير النظام</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs text-white/40 hover:text-white hover:bg-white/5 py-2 rounded-lg transition-all">
            <LogOut className="w-3.5 h-3.5" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

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
