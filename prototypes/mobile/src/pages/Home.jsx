import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ClipboardList, ArrowLeft, Bell, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import AssetCard from "../components/AssetCard";
import { assets, categories } from "../data/mock";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered = activeCategory === "الكل" ? assets : assets.filter(a => a.category === activeCategory);
  const featured = assets.slice(0, 3);

  return (
    <Layout title="عتاد">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-l from-primary via-primary-dark to-[oklch(0.3_0.14_28)] rounded-3xl p-6 text-white mb-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <p className="text-white/60 text-xs font-medium mb-1 tracking-wide">أهلاً بك{user ? `، ${user.name}` : ""}</p>
        <h2 className="text-2xl font-black mb-1">عتاد</h2>
        <p className="text-white/70 text-sm mb-5 max-w-xs leading-relaxed">استأجر المعدات والأدوات التي تحتاجها بسهولة وأمان</p>
        <Link to="/assets"
          className="inline-flex items-center gap-1.5 bg-white text-primary text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-white/90 active:scale-95">
          تصفح الأصول
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-sm mb-3">التصنيفات</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-gray-500 border border-gray-200/80 hover:border-gray-300 hover:text-gray-700"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm">أصول مميزة</h3>
          <Link to="/assets" className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
            عرض الكل <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {featured.map(asset => (
            <div key={asset.id} className="min-w-[220px] max-w-[260px] flex-shrink-0">
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-sm mb-3">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/assets")}
            className="group bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 text-right active:scale-[0.98]">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-sm text-gray-900">تصفح الأصول</p>
            <p className="text-xs text-gray-400 mt-0.5">ابحث عن ما تحتاجه</p>
          </button>
          <button onClick={() => navigate("/bookings")}
            className="group bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 text-right active:scale-[0.98]">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-sm text-gray-900">طلباتي</p>
            <p className="text-xs text-gray-400 mt-0.5">تتبع حالة الطلبات</p>
          </button>
        </div>
      </div>

      {/* More actions */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-sm mb-3">المزيد</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/notifications")}
            className="group bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 text-right active:scale-[0.98]">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-bold text-sm text-gray-900">الإشعارات</p>
            <p className="text-xs text-gray-400 mt-0.5">آخر التحديثات</p>
          </button>
          <button onClick={() => navigate("/terms")}
            className="group bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 text-right active:scale-[0.98]">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-bold text-sm text-gray-900">الشروط</p>
            <p className="text-xs text-gray-400 mt-0.5">سياسة الاستخدام</p>
          </button>
        </div>
      </div>

      {/* All assets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm">جميع الأصول</h3>
          <Link to="/assets" className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
            عرض الكل <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.slice(0, 4).map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
