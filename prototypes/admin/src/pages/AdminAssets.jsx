import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Package, MapPin, DollarSign, Calendar } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/apiClient";

const statusLabels = { available: "متاح", rented: "مؤجر", maintenance: "صيانة" };
const statusColors = {
  available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rented: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  maintenance: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export default function AdminAssets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { api.get("/admin/assets").then(setAssets).catch(() => {}); }, []);

  const filtered = assets
    .filter(a => filterStatus === "all" || a.status === filterStatus)
    .filter(a => a.title.includes(search) || a.owner_name?.includes(search) || a.city.includes(search));

  return (
    <AdminLayout title="الأصول">
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم الأصل أو المالك..."
              className="w-full pr-9 pl-3 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "available", "rented", "maintenance"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterStatus === s ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-500 border border-gray-200/80 hover:border-gray-300"
                }`}>
                {s === "all" ? "الكل" : statusLabels[s]}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{filtered.length} أصل</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-xs">
                <th className="text-right p-3 font-semibold">#</th>
                <th className="text-right p-3 font-semibold"><Package className="w-3 h-3 inline ml-1" />الأصل</th>
                <th className="text-right p-3 font-semibold">المالك</th>
                <th className="text-right p-3 font-semibold"><DollarSign className="w-3 h-3 inline ml-1" />السعر/يوم</th>
                <th className="text-right p-3 font-semibold"><MapPin className="w-3 h-3 inline ml-1" />المدينة</th>
                <th className="text-right p-3 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset, idx) => (
                <tr key={asset.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="p-3">
                    <Link to={`/admin/asset/${asset.id}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {asset.title}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-500">{asset.owner_name}</td>
                  <td className="p-3 font-semibold text-gray-900">{asset.price_per_day} ﷼</td>
                  <td className="p-3 text-gray-400">{asset.city}</td>
                  <td className="p-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[asset.status]}`}>
                      {statusLabels[asset.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
