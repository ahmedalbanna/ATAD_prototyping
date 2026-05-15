import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, Info, LogOut, ChevronLeft, Wallet, Settings, Edit3, Compass } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, isLessor } = useAuth();

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
