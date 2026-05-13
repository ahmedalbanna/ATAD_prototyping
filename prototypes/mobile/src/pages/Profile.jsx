import { useNavigate } from "react-router-dom";
import { User, ClipboardList, Package, FileText, Info, LogOut, ChevronLeft } from "lucide-react";
import Layout from "../components/Layout";

export default function Profile() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "بياناتي", icon: User, desc: "الاسم، رقم الجوال" },
    { label: "طلباتي", icon: ClipboardList, desc: "عرض كل الطلبات", to: "/bookings" },
    { label: "الأصول المضافة", icon: Package, desc: "إذا كنت مؤجراً", to: "/lessor-dashboard" },
    { label: "الشروط والأحكام", icon: FileText, desc: "سياسة الاستخدام" },
    { label: "عن التطبيق", icon: Info, desc: "الإصدار 1.0.0" },
  ];

  return (
    <Layout title="حسابي">
      <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-sm mb-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/10">
          <span className="text-3xl font-black text-primary">أ</span>
        </div>
        <h2 className="font-bold text-lg text-gray-900">أحمد محمد</h2>
        <p className="text-sm text-gray-400" dir="ltr">+967 777 123 456</p>
        <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
          مستأجر
        </span>
      </div>

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

      <button onClick={() => navigate("/auth")}
        className="w-full mt-6 text-red-500 font-semibold text-sm py-3.5 rounded-xl border border-red-200/80 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </button>
    </Layout>
  );
}
