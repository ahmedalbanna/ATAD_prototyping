import { useNavigate } from "react-router-dom";
import { User, ClipboardList, Package, FileText, Info, LogOut, ChevronLeft, Bell, Repeat } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر", admin: "مدير" };

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, switchUser, allUsers } = useAuth();

  const menuItems = [
    { label: "بياناتي", icon: User, desc: "الاسم، رقم الجوال" },
    { label: "طلباتي", icon: ClipboardList, desc: "عرض كل الطلبات", to: "/bookings" },
    { label: "الإشعارات", icon: Bell, desc: "آخر التحديثات", to: "/notifications" },
    { label: "الأصول المضافة", icon: Package, desc: "إذا كنت مؤجراً", to: "/lessor-dashboard" },
    { label: "الشروط والأحكام", icon: FileText, desc: "سياسة الاستخدام", to: "/terms" },
    { label: "عن التطبيق", icon: Info, desc: "الإصدار 1.0.0" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <Layout title="حسابي">
      {/* User card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-sm mb-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/10">
          <span className="text-3xl font-black text-primary">{user.name[0]}</span>
        </div>
        <h2 className="font-bold text-lg text-gray-900">{user.name}</h2>
        <p className="text-sm text-gray-400" dir="ltr">+967 {user.phone}</p>
        <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
          {roleLabels[user.role]}
        </span>
      </div>

      {/* Quick switch user */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Repeat className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-gray-900">تبديل المستخدم (للمعاينة)</h3>
        </div>
        <div className="space-y-1.5">
          {allUsers.filter(u => u.id !== user.id).map(u => (
            <button key={u.id} onClick={() => { switchUser(u); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all text-right group">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {u.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                <p className="text-xs text-gray-400">{roleLabels[u.role]} • +967 {u.phone}</p>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => item.to && navigate(item.to)}
              className="w-full bg-white rounded-xl p-4 border border-gray-100/80 flex items-center gap-3 text-right hover:border-primary/20 hover:shadow-sm transition-all group">
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
        className="w-full mt-6 text-red-500 font-semibold text-sm py-3.5 rounded-xl border border-red-200/80 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </button>
    </Layout>
  );
}
