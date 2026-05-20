import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, Info, LogOut, ChevronLeft, Wallet, Package, Edit3, Compass, ShieldCheck, Star, CalendarDays } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };
const verifiedLevels = { none: "غير موثّق", pending: "قيد التوثيق", verified: "موثّق" };

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, isLessor } = useAuth();

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long" })
    : null;
  const verifiedLevel = user?.verified || "verified";
  const isVerified = verifiedLevel === "verified";

  const menuItems = isLessor
    ? [
      { label: "تعديل البيانات", icon: Edit3, desc: "الاسم، رقم الجوال", to: "/edit-profile" },
      { label: "إدارة الطلبات", icon: ClipboardList, desc: "الموافقة على طلبات التأجير", to: "/lessor-dashboard" },
      { label: "إدارة الأصول", icon: Package, desc: "إضافة وتعديل وحذف الأصول", to: "/lessor-assets" },
      { label: "الأرباح", icon: Wallet, desc: "متابعة الإيرادات", to: "/lessor-earnings" },
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
          <div className="relative w-20 h-20 bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-3 ring-2 ring-white/30 shadow-xl">
            <span className="text-3xl font-black text-white">{user.name[0]}</span>
            {isVerified && (
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-verified rounded-full flex items-center justify-center ring-2 ring-white verified-pulse">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <h2 className="font-bold text-lg text-white">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-white/60 text-sm" dir="ltr">+966 {user.phone}</p>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 font-semibold backdrop-blur-sm border border-white/10">
              {roleLabels[user.role]}
            </span>
          </div>
          {isVerified && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="trust-badge bg-white/15 text-white/90 border-white/20 text-[10px]">
                <ShieldCheck className="w-2.5 h-2.5" /> {verifiedLevels[verifiedLevel]}
              </span>
            </div>
          )}
          {memberSince && (
            <div className="flex items-center justify-center gap-1 mt-2 text-white/50 text-[10px]">
              <CalendarDays className="w-3 h-3" />
              <span>عضو منذ {memberSince}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-white rounded-xl border border-gray-100/80 p-3 text-center shadow-sm">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-1.5">
            <Star className="w-4 h-4 text-amber-600" />
          </div>
          <p className="stat-value">0</p>
          <p className="stat-label">تقييم</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100/80 p-3 text-center shadow-sm">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-1.5">
            <ClipboardList className="w-4 h-4 text-blue-600" />
          </div>
          <p className="stat-value">0</p>
          <p className="stat-label">عمليات</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100/80 p-3 text-center shadow-sm">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="stat-value text-sm font-bold text-gray-900">{verifiedLevels[verifiedLevel]}</p>
          <p className="stat-label">التوثيق</p>
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
