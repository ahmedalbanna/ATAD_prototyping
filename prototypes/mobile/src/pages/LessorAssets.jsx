import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Search, Edit3, Eye, MoreHorizontal, Check, X, Wrench } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { assets, assetStatusLabels, assetStatusColors } from "../data/mock";

export default function LessorAssets() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [localAssets, setLocalAssets] = useState(assets);

  const myAssets = localAssets
    .filter(a => a.ownerId === (user?.id || 2))
    .filter(a => filterStatus === "all" || a.status === filterStatus)
    .filter(a => a.title.includes(search) || a.city.includes(search));

  const toggleStatus = (assetId, newStatus) => {
    setLocalAssets(prev => prev.map(a =>
      a.id === assetId ? { ...a, status: newStatus } : a
    ));
  };

  const statuses = [
    { key: "all", label: "الكل" },
    { key: "available", label: "متاح" },
    { key: "rented", label: "مؤجر" },
    { key: "maintenance", label: "صيانة" },
  ];

  return (
    <Layout title="إدارة الأصول" onBack={() => navigate("/lessor-dashboard")}>
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "متاح", value: myAssets.filter(a => a.status === "available").length, color: "from-emerald-50 to-emerald-100/50 text-emerald-700" },
          { label: "مؤجر", value: myAssets.filter(a => a.status === "rented").length, color: "from-amber-50 to-amber-100/50 text-amber-700" },
          { label: "صيانة", value: myAssets.filter(a => a.status === "maintenance").length, color: "from-red-50 to-red-100/50 text-red-700" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-3 text-center shadow-sm`}>
            <p className="text-lg font-black">{s.value}</p>
            <p className="text-[10px] font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث في أصولك..."
          className="w-full pr-9 pl-3 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
      </div>

      {/* Status filter */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {statuses.map(s => (
          <button key={s.key} onClick={() => setFilterStatus(s.key)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all tab-underline ${
              filterStatus === s.key ? "tab-active text-gray-900" : "text-gray-500"
            }`}>
            {s.label}
          </button>
        ))}
        <button onClick={() => navigate("/add-asset")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 hover:bg-primary/20 active:scale-[0.97] transition-all">
          <Plus className="w-3 h-3" /> إضافة
        </button>
      </div>

      {/* Asset list */}
      {myAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Search className="w-6 h-6 opacity-40" />
          </div>
          <p className="font-medium text-gray-400 text-sm">لا توجد أصول</p>
          <button onClick={() => navigate("/add-asset")}
            className="mt-3 text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> إضافة أصل جديد
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {myAssets.map((asset, i) => (
            <div key={asset.id} className="bg-white rounded-xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex gap-3 p-3">
                <Link to={`/asset/${asset.id}`} className="shrink-0">
                  <img src={asset.image} alt={asset.title}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 ring-1 ring-gray-100" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/asset/${asset.id}`} className="font-bold text-sm text-gray-900 truncate block hover:text-primary transition-colors">
                    {asset.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{asset.pricePerDay} ﷼/يوم • {asset.city}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${assetStatusColors[asset.status]}`}>
                      {assetStatusLabels[asset.status]}
                    </span>
                    <span className="text-[10px] text-gray-300">تصنيف: {asset.category}</span>
                  </div>
                </div>
              </div>

              {/* Quick status toggle */}
              <div className="flex border-t border-gray-50 divide-x divide-gray-50">
                {[
                  { key: "available", label: "متاح", icon: Check, color: "text-emerald-600" },
                  { key: "maintenance", label: "صيانة", icon: Wrench, color: "text-red-500" },
                ].map(action => (
                  <button key={action.key} onClick={() => toggleStatus(asset.id, action.key)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium transition-all active:scale-[0.97] ${
                      asset.status === action.key
                        ? "bg-primary/5 text-primary"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}>
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
                <Link to={`/edit-asset/${asset.id}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-gray-400 hover:bg-gray-50 transition-all">
                  <Edit3 className="w-3 h-3" />
                  تعديل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
