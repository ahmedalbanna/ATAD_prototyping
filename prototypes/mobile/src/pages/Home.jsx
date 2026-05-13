import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ClipboardList, ArrowLeft, Bell } from "lucide-react";
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
      {/* Banner */}
      <div className="bg-gradient-to-l from-primary to-primary-dark rounded-2xl p-5 text-white mb-5 shadow-lg">
        <p className="text-white/60 text-xs mb-0.5">أهلاً بك{user ? `، ${user.name}` : ""}</p>
        <h2 className="text-xl font-bold mb-1">عتاد</h2>
        <p className="text-white/70 text-sm mb-4">استأجر المعدات والأدوات التي تحتاجها</p>
        <Link to="/assets"
          className="inline-flex items-center gap-1 bg-white text-primary text-sm font-bold px-5 py-2.5 btn-pill shadow-md hover:bg-white/90 transition-colors">
          تصفح الأصول <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Categories */}
      <div className="mb-5">
        <h3 className="section-title">التصنيفات</h3>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat ? "bg-primary text-white" : "bg-white text-gray-500 border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97]"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold text-gray-900 text-sm">أصول مميزة</h3>
          <Link to="/assets" className="text-xs text-primary font-semibold">عرض الكل</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {featured.map(asset => (
            <div key={asset.id} className="min-w-[200px] max-w-[240px] shrink-0">
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-5 animate-slide-up stagger-1">
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => navigate("/assets")}
            className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100/80 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div className="text-right">
              <p className="font-bold text-xs text-gray-900">تصفح الأصول</p>
              <p className="text-[10px] text-gray-400">ابحث عن ما تحتاجه</p>
            </div>
          </button>
          <button onClick={() => navigate("/bookings")}
            className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100/80 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-right">
              <p className="font-bold text-xs text-gray-900">طلباتي</p>
              <p className="text-[10px] text-gray-400">تتبع حالة الطلبات</p>
            </div>
          </button>
        </div>
      </div>

      {/* All assets */}
      <div className="animate-slide-up stagger-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold text-gray-900 text-sm">جميع الأصول</h3>
          <Link to="/assets" className="text-xs text-primary font-semibold">عرض الكل</Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.slice(0, 4).map((asset, i) => (
            <div key={asset.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
