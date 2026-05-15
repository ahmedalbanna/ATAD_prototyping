import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, Info, LogOut, ChevronLeft, Repeat, Wallet, Settings, Edit3, Compass } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, switchUser, allUsers, isLessor, isRealAccount } = useAuth();

  const otherRoleUsers = allUsers.filter(u => u.role !== user?.role);
  const sameRoleUsers = allUsers.filter(u => u.role === user?.role && u.id !== user?.id);

  const menuItems = isLessor
    ? [
        { label: "إدارة الطلبات", icon: ClipboardList, desc: "الموافقة على طلبات التأجير", to: "/lessor-dashboard" },
        { label: "إدارة الأصول", icon: Settings, desc: "إضافة وتعديل وحذف الأصول", to: "/lessor-assets" },
        { label: "الأرباح", icon: Wallet, desc: "متابعة الإيرادات", to: "/lessor-earnings" },
        { label: "تعديل البيانات", icon: Edit3, desc: "الاسم، رقم الجوال", to: "/edit-profile" },
        { label: "دليل الاستخدام", icon: Compass, desc: "شرح التطبيق والبدء السريع", to: "/onboarding/lessor" },
        { label: "الشروط والأحكام", icon: FileText, desc: "سياسة الاستخدام", to: "/terms" },
        { label: "عن التطبيق", icon: Info, desc: "الإصدار 1.0.0" },
      ]
    : [
        { label: "تعديل البيانات", icon: Edit3, desc: "الاسم، رقم الجوال", to: "/edit-profile" },
        { label: "دليل الاستخدام", icon: Compass, desc: "شرح التطبيق والبدء السريع", to: "/onboarding/tenant" },
        { label: "طلباتي", icon: ClipboardList, desc: "جميع طلبات التأجير", to: "/bookings" },
        { label: "الشروط والأحكام", icon: FileText, desc: "سياسة الاستخدام", to: "/terms" },
        { label: "عن التطبيق", icon: Info, desc: "الإصدار 1.0.0" },
      ];

  const handleLogout = () => { logout(); navigate("/auth"); };

  if (!user) { navigate("/auth"); return null; }

  return (
    <Layout title="حسابي">
      <div className="relative bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 mb-6 shadow-xl overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full animate-blob" style={{ animationDuration: "10s" }} />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/10 rounded-full animate-blob" style={{ animationDuration: "14s", animationDelay: "-4s" }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-white/30 shadow-xl">
            <span className="text-3xl font-black text-white">{user.name[0]}</span>
          </div>
          <h2 className="font-bold text-lg text-white">{user.name}</h2>
          <p className="text-white/60 text-sm" dir="ltr">+966 {user.phone}</p>
          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white/15 text-white/90 font-semibold backdrop-blur-sm border border-white/10">
            {roleLabels[user.role]}
          </span>
        </div>
      </div>

      {/* Quick switch - same role */}
      {!isRealAccount && sameRoleUsers.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm mb-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2.5">
            <Repeat className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs text-gray-900">تبديل {roleLabels[user.role]}</h3>
          </div>
          <div className="space-y-1">
            {sameRoleUsers.map(u => (
              <button key={u.id} onClick={() => { switchUser(u); }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-all text-right group">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                  <p className="text-[10px] text-gray-400" dir="ltr">+966 {u.phone}</p>
                </div>
                <ChevronLeft className="w-3 h-3 text-gray-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Switch to other role */}
      {!isRealAccount && otherRoleUsers.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm mb-4 animate-slide-up stagger-1">
          <div className="flex items-center gap-2 mb-2.5">
            <Repeat className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-xs text-gray-900">تجربة دور آخر</h3>
          </div>
          <div className="space-y-1">
            {otherRoleUsers.map(u => (
              <button key={u.id} onClick={() => { switchUser(u); }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-50 transition-all text-right group border border-dashed border-transparent hover:border-amber-200">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 group-hover:bg-amber-100 group-hover:text-amber-700 transition-all">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                  <p className="text-[10px] text-gray-400">{roleLabels[u.role]} • +966 {u.phone}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium shrink-0">
                  جرب
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="space-y-2 animate-slide-up stagger-2">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => item.to && navigate(item.to)}
              className={`w-full bg-white rounded-xl p-4 border border-gray-100/80 flex items-center gap-3 text-right hover:border-primary/20 hover:shadow-sm transition-all group animate-slide-up`}
              style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon className="w-4.5 h-4.5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            </button>
          );
        })}
      </div>

      <button onClick={handleLogout}
        className="w-full mt-6 text-red-500 font-semibold text-sm py-3.5 rounded-xl border border-red-200/80 hover:bg-red-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </button>
    </Layout>
  );
}
