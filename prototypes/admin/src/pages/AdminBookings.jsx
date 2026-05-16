import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ClipboardList, CalendarDays, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/apiClient";
import { statusLabels, statusColors } from "../data/mock";

const statuses = ["all", "pending", "approved", "active", "completed", "rejected"];

function daysBetween(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

export default function AdminBookings() {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { api.get("/admin/bookings").then(setAllBookings).catch(() => {}); }, []);

  const filtered = allBookings
    .filter(b => activeTab === "all" || b.status === activeTab)
    .filter(b => (b.asset_title || "").includes(search) || (b.tenant_name || "").includes(search) || (b.owner_name || "").includes(search));

  const countByStatus = (s) => allBookings.filter(b => b.status === s).length;

  const statsCards = [
    { label: "إجمالي الطلبات", value: allBookings.length, icon: ClipboardList, color: "bg-primary/10 text-primary" },
    { label: "قيد الانتظار", value: countByStatus("pending"), icon: Clock, color: "bg-accent/10 text-accent" },
    { label: "نشط", value: countByStatus("active"), icon: AlertCircle, color: "bg-primary-dark/10 text-primary-dark" },
    { label: "مكتمل", value: countByStatus("completed"), icon: CheckCircle, color: "bg-gray-brand/10 text-gray-brand" },
    { label: "مرفوض", value: countByStatus("rejected"), icon: XCircle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <AdminLayout title="الطلبات">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {statsCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100/80 p-3 flex items-center gap-3 shadow-sm animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم الأصل أو المستأجر أو المؤجر..."
              className="w-full pr-9 pl-3 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide items-center">
            {statuses.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all tab-underline ${
                  activeTab === tab ? "tab-active text-gray-900" : "text-gray-500"
                }`}>
                {tab === "all" ? "الكل" : statusLabels[tab]}
                {tab !== "all" && (
                  <span className="mr-1.5 text-[10px] opacity-70">({countByStatus(tab)})</span>
                )}
              </button>
            ))}
            <span className="text-xs text-gray-400 mr-auto bg-gray-50 px-2.5 py-1 rounded-full">{filtered.length} طلب</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-xs">
                <th className="text-right p-3 font-semibold">#</th>
                <th className="text-right p-3 font-semibold">الأصل</th>
                <th className="text-right p-3 font-semibold">المستأجر</th>
                <th className="text-right p-3 font-semibold">المؤجر</th>
                <th className="text-right p-3 font-semibold"><CalendarDays className="w-3 h-3 inline ml-1" />المدة</th>
                <th className="text-right p-3 font-semibold">عدد الأيام</th>
                <th className="text-right p-3 font-semibold"><DollarSign className="w-3 h-3 inline ml-1" />المبلغ</th>
                <th className="text-right p-3 font-semibold">الحالة</th>
                <th className="text-center p-3 font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, idx) => {
                const duration = daysBetween(b.start_date, b.end_date);
                return (
                  <tr key={b.id} onClick={() => navigate(`/admin/booking/${b.id}`)}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="p-3 text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="p-3">
                      <Link to={`/admin/booking/${b.id}`} onClick={e => e.stopPropagation()}
                        className="font-medium text-gray-900 hover:text-primary transition-colors">
                        {b.asset_title}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-500">{b.tenant_name}</td>
                    <td className="p-3 text-gray-500">{b.owner_name}</td>
                    <td className="p-3 text-gray-400 text-xs whitespace-nowrap">{b.start_date} <span className="text-gray-300">→</span> {b.end_date}</td>
                    <td className="p-3 text-gray-500 text-xs">{duration} يوم</td>
                    <td className="p-3 font-semibold text-gray-900 whitespace-nowrap">{b.total_price} ﷼</td>
                    <td className="p-3">
                      <span className={`badge ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Eye className="w-3.5 h-3.5 inline text-gray-300" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-300">
            <ClipboardList className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-gray-400">لا توجد طلبات</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
