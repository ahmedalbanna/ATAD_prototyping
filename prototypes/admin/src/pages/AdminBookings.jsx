import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ClipboardList, CalendarDays, DollarSign, Eye, Package } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { bookings, statusLabels, statusColors } from "../data/mock";

const filterTabs = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "approved", label: "تمت الموافقة" },
  { key: "active", label: "نشط" },
  { key: "completed", label: "مكتمل" },
];

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = bookings
    .filter(b => activeTab === "all" || b.status === activeTab)
    .filter(b => b.assetTitle.includes(search) || b.tenantName.includes(search));

  return (
    <AdminLayout title="الطلبات">
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم الأصل أو المستأجر..."
              className="w-full pr-9 pl-3 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide items-center">
            {filterTabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all tab-underline ${
                  activeTab === tab.key ? "tab-active text-gray-900" : "text-gray-500"
                }`}>
                {tab.label}
                {tab.key !== "all" && (
                  <span className="mr-1.5 text-[10px] opacity-70">({bookings.filter(b => b.status === tab.key).length})</span>
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
                <th className="text-right p-3 font-semibold"><Package className="w-3 h-3 inline ml-1" />الأصل</th>
                <th className="text-right p-3 font-semibold">المستأجر</th>
                <th className="text-right p-3 font-semibold"><CalendarDays className="w-3 h-3 inline ml-1" />تاريخ البداية</th>
                <th className="text-right p-3 font-semibold"><CalendarDays className="w-3 h-3 inline ml-1" />تاريخ النهاية</th>
                <th className="text-right p-3 font-semibold"><DollarSign className="w-3 h-3 inline ml-1" />المبلغ</th>
                <th className="text-right p-3 font-semibold">الحالة</th>
                <th className="text-center p-3 font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, idx) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="p-3 font-medium text-gray-900">{b.assetTitle}</td>
                  <td className="p-3 text-gray-500">{b.tenantName}</td>
                  <td className="p-3 text-gray-400 text-xs">{b.startDate}</td>
                  <td className="p-3 text-gray-400 text-xs">{b.endDate}</td>
                  <td className="p-3 font-semibold text-gray-900">{b.totalPrice} ﷼</td>
                  <td className="p-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                      {statusLabels[b.status]}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link to={`/admin/booking/${b.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:bg-primary/5 px-2.5 py-1.5 rounded-lg transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      تفاصيل
                    </Link>
                  </td>
                </tr>
              ))}
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
