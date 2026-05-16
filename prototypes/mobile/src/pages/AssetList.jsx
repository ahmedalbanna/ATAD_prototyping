import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ArrowUpDown } from "lucide-react";
import { api } from "../services/apiClient";
import Layout from "../components/Layout";
import AssetCard from "../components/AssetCard";
import { categories, assets as mockAssets, normalizeAsset } from "../data/mock";

export default function AssetList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allAssets, setAllAssets] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "الكل");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  useEffect(() => {
    api.get("/assets").then(data => {
      setAllAssets(data.data || data);
    }).catch(() => {
      setAllAssets(mockAssets.map(normalizeAsset));
    });
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (activeCategory !== "الكل") params.category = activeCategory;
    if (sortBy) params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [search, activeCategory, sortBy, setSearchParams]);

  const filtered = allAssets
    .filter(a => activeCategory === "الكل" || a.category === activeCategory)
    .filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q)
        || a.city.toLowerCase().includes(q)
        || (a.category || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price_per_day - b.price_per_day;
      if (sortBy === "price_desc") return b.price_per_day - a.price_per_day;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <Layout title="الأصول">
      <div className="relative mb-4">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن أصل، مدينة، أو تصنيف..."
          className="w-full pr-11 pl-4 py-3 bg-white border border-gray-200/80 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm placeholder:text-gray-400" />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97]"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs text-gray-400">ترتيب:</span>
        {[
          { value: "price_asc", label: "السعر: الأقل" },
          { value: "price_desc", label: "السعر: الأعلى" },
          { value: "rating", label: "التقييم" },
        ].map(opt => (
          <button key={opt.value} onClick={() => setSortBy(opt.value === sortBy ? "" : opt.value)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
              sortBy === opt.value
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-400 bg-white border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97]"
            }`}>
            {opt.label}
          </button>
        ))}
        <span className="text-xs text-gray-400 mr-auto">{filtered.length} نتيجة</span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300 animate-scale-in">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-4">
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <p className="font-medium text-gray-400">لا توجد نتائج</p>
          <p className="text-xs text-gray-300 mt-1">حاول تغيير معايير البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((asset, i) => (
            <div key={asset.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
