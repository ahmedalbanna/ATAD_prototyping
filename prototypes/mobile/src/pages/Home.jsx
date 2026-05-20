import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, ClipboardList, ArrowLeft, MapPin, Star, TrendingUp,
  Clock, Search, Monitor, Server, Tablet, Printer, Code,
  ShieldCheck, FileSignature, MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/apiClient";
import Layout from "../components/Layout";
import AssetCard from "../components/AssetCard";


const categoryIcons = {
  "الكل": { icon: Package, color: "text-gray-600 bg-gray-100" },
  "أجهزة تقنية": { icon: Monitor, color: "text-blue-600 bg-blue-50" },
  "أجهزة محمولة": { icon: Tablet, color: "text-purple-600 bg-purple-50" },
  "شاشات": { icon: Monitor, color: "text-cyan-600 bg-cyan-50" },
  "طابعات": { icon: Printer, color: "text-amber-600 bg-amber-50" },
  "خوادم": { icon: Server, color: "text-emerald-600 bg-emerald-50" },
  "برمجيات": { icon: Code, color: "text-indigo-600 bg-indigo-50" },
};

const cities = [
  "الرياض", "جدة", "مكة", "الدمام", "الخبر", "المدينة",
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
    }).catch(() => {});
  }, []);

  const trending = [...assets].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const recentAssets = assets.filter(a => recentViews.includes(a.id)).slice(0, 5);
  const popularCities = cities.filter(c => assets.some(a => a.city === c)).slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/assets?search=${encodeURIComponent(search)}`);
  };

  return (
    <Layout title="عتاد">
      {/* Role-aware banner with tagline */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-[#7a0e0d] rounded-2xl p-6 text-white mb-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/10 rounded-full" />
        <div className="absolute top-1/2 -translate-y-1/2 left-6 text-[80px] font-black text-white/[0.03] select-none">عتاد</div>
        <div className="relative z-10">
          <p className="text-white/60 text-xs mb-1">
            {user ? `أهلاً، ${user.name}` : "أهلاً بك في"}
          </p>
          <h2 className="text-3xl font-black mb-1 leading-tight">عتاد</h2>
          <p className="text-accent font-bold text-sm mb-1">الوصول أسهل من التملك</p>
          <p className="text-white/60 text-[11px] mb-3 leading-relaxed">
            أول منصة سعودية لتأجير الأجهزة والمعدات — استأجر ما تحتاجه بأمان وثقة، بدون عناء التملك
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="flex items-center gap-1 bg-white/10 text-[10px] px-2.5 py-1 rounded-full text-white/80">
              <ShieldCheck className="w-3 h-3" /> مستخدمون موثّقون
            </span>
            <span className="flex items-center gap-1 bg-white/10 text-[10px] px-2.5 py-1 rounded-full text-white/80">
              <FileSignature className="w-3 h-3" /> عقود إلكترونية
            </span>
            <span className="flex items-center gap-1 bg-white/10 text-[10px] px-2.5 py-1 rounded-full text-white/80">
              ⭐ تقييمات شفافة
            </span>
          </div>
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
            <p className="text-white/70 text-sm">استأجر الأجهزة والمعدات التي تحتاجها، وادفع فقط مقابل ما تستخدم</p>
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

      {/* Trust bar */}
      <div className="trust-bar mb-5">
        {[
          { icon: ShieldCheck, label: "توثيق", desc: "جميع المستخدمين موثّقون بهوية حقيقية", color: "from-emerald-500/10 to-emerald-500/5 border-emerald-200/50" },
          { icon: FileSignature, label: "عقود إلكترونية", desc: "عقود تأجير إلكترونية آمنة وقانونية", color: "from-blue-500/10 to-blue-500/5 border-blue-200/50" },
          { icon: MessageSquare, label: "تقييمات شفافة", desc: "تقييمات حقيقية من مستخدمين سابقين", color: "from-amber-500/10 to-amber-500/5 border-amber-200/50" },
        ].map(({ icon: Icon, label, desc, color }) => (
          <div key={label} className={`trust-bar-item bg-gradient-to-br ${color}`}>
            <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
              <Icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">{label}</span>
            <span className="text-[9px] text-gray-400 leading-relaxed px-1">{desc}</span>
          </div>
        ))}
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
              <button key={city} onClick={() => navigate(`/assets?city=${encodeURIComponent(city)}`)}
                className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5 border border-gray-100/80 shadow-sm hover:border-primary/20 hover:shadow-md transition-all shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-gray-900">{city}</span>
                <span className="text-[10px] text-gray-400">{assets.filter(a => a.city === city).length} أصل</span>
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
