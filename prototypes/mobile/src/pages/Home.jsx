import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, ClipboardList, ArrowLeft, MapPin, Star, TrendingUp,
  Clock, Search, Building2, Wrench, Zap, Truck, Drill, HardHat,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/apiClient";
import Layout from "../components/Layout";
import AssetCard from "../components/AssetCard";
import { assets as mockAssets, normalizeAsset } from "../data/mock";

const categoryIcons = {
  "الكل": { icon: Package, color: "text-gray-600 bg-gray-100" },
  "معدات ثقيلة": { icon: Building2, color: "text-orange-600 bg-orange-50" },
  "مركبات": { icon: Truck, color: "text-blue-600 bg-blue-50" },
  "معدات كهربائية": { icon: Zap, color: "text-yellow-600 bg-yellow-50" },
  "معدات بناء": { icon: HardHat, color: "text-amber-600 bg-amber-50" },
  "معدات صناعية": { icon: Wrench, color: "text-emerald-600 bg-emerald-50" },
  "أدوات يدوية": { icon: Drill, color: "text-purple-600 bg-purple-50" },
};

const cities = [
  { name: "الرياض", count: 24 },
  { name: "جدة", count: 18 },
  { name: "مكة", count: 12 },
  { name: "الدمام", count: 9 },
  { name: "الخبر", count: 7 },
  { name: "المدينة", count: 6 },
];

const RECENT_KEY = "atad_recent_views";

export default function Home() {
  const navigate = useNavigate();
  const { user, isLessor, isTenant } = useAuth();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [recentViews, setRecentViews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    api.get("/assets").then(data => {
      setAssets(data.data || data);
    }).catch(() => {
      setAssets(mockAssets.map(normalizeAsset));
    });
  }, []);

  const trending = [...assets].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const recentAssets = assets.filter(a => recentViews.includes(a.id)).slice(0, 5);
  const popularCities = cities.filter(c => assets.some(a => a.city === c.name)).slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/assets?search=${encodeURIComponent(search)}`);
  };

  return (
    <Layout title="عتاد">
      {/* Role-aware banner */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-[#7a0e0d] rounded-2xl p-5 text-white mb-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/10 rounded-full" />
        <div className="relative z-10">
          <p className="text-white/60 text-xs mb-0.5">
            {user ? `أهلاً، ${user.name}` : "أهلاً بك"}
          </p>
          <h2 className="text-xl font-bold mb-1">منصة عتاد</h2>
          {isLessor ? (
            <div className="flex items-center gap-4 mt-2">
              <div>
                <p className="text-2xl font-black">{assets.filter(a => a.owner?.id === user?.id).length}</p>
                <p className="text-[10px] text-white/60">أصولك</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-2xl font-black">{assets.filter(a => a.status === "rented").length}</p>
                <p className="text-[10px] text-white/60">مؤجر حالياً</p>
              </div>
            </div>
          ) : (
            <p className="text-white/70 text-sm">استأجر المعدات والأدوات التي تحتاجها</p>
          )}
          <div className="flex gap-2 mt-3">
            <Link to="/assets"
              className="inline-flex items-center gap-1 bg-white text-primary text-xs font-bold px-4 py-2 btn-pill shadow-md hover:bg-white/90 transition-all">
              تصفح الأصول <ArrowLeft className="w-3 h-3" />
            </Link>
            {isLessor && (
              <button onClick={() => navigate("/lessor-dashboard")}
                className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-bold px-4 py-2 btn-pill border border-white/20 hover:bg-white/20 transition-all">
                لوحة المؤجر
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative mb-5">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن معدات، أدوات، أو مدينة..."
          className="w-full pr-11 pl-4 py-3 bg-white border border-gray-200/80 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm placeholder:text-gray-400 shadow-sm" />
      </form>

      {/* Categories visual grid */}
      <div className="mb-5">
        <h3 className="section-title">التصنيفات</h3>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(categoryIcons).slice(0, 8).map(([name, { icon: Icon, color }]) => {
            const count = name === "الكل" ? assets.length : assets.filter(a => a.category === name).length;
            return (
              <button key={name} onClick={() => navigate(`/assets?category=${encodeURIComponent(name)}`)}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white border border-gray-100/80 shadow-sm hover:border-primary/20 hover:shadow-md transition-all active:scale-[0.96]">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{name}</span>
                <span className="text-[9px] text-gray-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular cities */}
      {popularCities.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="section-title">مدن شائعة</h3>
            <Link to="/assets" className="text-xs text-primary font-semibold">عرض الكل</Link>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {popularCities.map(city => (
              <button key={city.name} onClick={() => navigate(`/assets?city=${encodeURIComponent(city.name)}`)}
                className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5 border border-gray-100/80 shadow-sm hover:border-primary/20 hover:shadow-md transition-all shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-gray-900">{city.name}</span>
                <span className="text-[10px] text-gray-400">{city.count} أصل</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recently viewed */}
      {recentAssets.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="section-title">شوهد مؤخراً</h3>
            <button onClick={() => { localStorage.removeItem(RECENT_KEY); setRecentViews([]); }}
              className="text-[10px] text-gray-400 hover:text-gray-600">مسح</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {recentAssets.map(asset => (
              <div key={asset.id} className="min-w-[160px] max-w-[200px] shrink-0">
                <AssetCard asset={asset} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="section-title">
            <TrendingUp className="w-3.5 h-3.5 inline ml-1 text-primary" />
            الأكثر تقييماً
          </h3>
          <Link to="/assets?sort=rating" className="text-xs text-primary font-semibold">عرض الكل</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {trending.map(asset => (
            <div key={asset.id} className="min-w-[200px] max-w-[240px] shrink-0">
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions - role aware */}
      <div className="mb-5">
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => navigate("/assets")}
            className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100/80 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div className="text-right">
              <p className="font-bold text-xs text-gray-900">تصفح الأصول</p>
              <p className="text-[10px] text-gray-400">{assets.length} متاح</p>
            </div>
          </button>
          {isLessor ? (
            <button onClick={() => navigate("/lessor-dashboard")}
              className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100/80 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-right">
                <p className="font-bold text-xs text-gray-900">إدارة الأصول</p>
                <p className="text-[10px] text-gray-400">لوحة المؤجر</p>
              </div>
            </button>
          ) : (
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
          )}
        </div>
      </div>

      {/* All assets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="section-title">جميع الأصول</h3>
          <Link to="/assets" className="text-xs text-primary font-semibold">عرض الكل</Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {assets.slice(0, 4).map((asset, i) => (
            <div key={asset.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
