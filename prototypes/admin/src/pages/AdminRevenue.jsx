import { useState, useEffect } from "react";
import { Wallet, TrendingUp, CalendarDays, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/apiClient";

const monthNames = {
  "01": "يناير", "02": "فبراير", "03": "مارس", "04": "أبريل",
  "05": "مايو", "06": "يونيو", "07": "يوليو", "08": "أغسطس",
  "09": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر",
};

export default function AdminRevenue() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get("/admin/revenue").then(setData).catch(() => {}); }, []);

  if (!data) return <AdminLayout title="الإيرادات"><div className="shimmer rounded-2xl h-48" /></AdminLayout>;

  const { total_revenue, total_bookings, monthly } = data;
  const months = monthly || [];
  const validMonths = months.filter(m => m.revenue > 0);
  const lastMonth = validMonths[validMonths.length - 1];
  const prevMonth = validMonths[validMonths.length - 2];
  const growth = prevMonth && lastMonth?.revenue > 0
    ? Math.round(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100)
    : 0;
  const avgValue = total_bookings > 0 ? Math.round(total_revenue / total_bookings) : 0;
  const maxRevenue = Math.max(...months.map(m => m.revenue), 1);

  const cards = [
    { label: "إجمالي الإيرادات", value: `${total_revenue} ﷼`, icon: Wallet, color: "bg-purple-50 text-purple-600" },
    { label: "إجمالي الحجوزات", value: total_bookings, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "معدل النمو", value: `${growth}%`, icon: growth > 0 ? ArrowUp : ArrowDown, color: growth > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600" },
    { label: "متوسط الحجز", value: `${avgValue} ﷼`, icon: Wallet, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <AdminLayout title="الإيرادات">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">{c.value}</p>
                <p className="text-xs text-gray-400">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> الإيرادات الشهرية
          </h3>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{months.length} شهر</span>
        </div>

        <div className="p-6">
          <div className="flex items-end gap-3 h-48" style={{ direction: "ltr" }}>
            {months.map((m, i) => {
              const height = m.revenue > 0 ? Math.max((m.revenue / maxRevenue) * 100, 8) : 8;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] text-gray-400 font-medium">{m.revenue || ""}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{
                      height: `${height}%`,
                      background: m.revenue > 0
                        ? "linear-gradient(to top, #E14A11, #E86A3A)"
                        : "#f0f0f0",
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-[10px] text-gray-400 mt-1">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-xs">
                <th className="text-right p-3 font-semibold">الشهر</th>
                <th className="text-right p-3 font-semibold">عدد الحجوزات</th>
                <th className="text-right p-3 font-semibold">الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-3 font-medium text-gray-900">{m.month}</td>
                  <td className="p-3 text-gray-500">{m.bookings}</td>
                  <td className="p-3 font-semibold text-gray-900">{m.revenue} ﷼</td>
                </tr>
              ))}
              <tr className="bg-gray-50/50 font-medium">
                <td className="p-3 text-gray-900">الإجمالي</td>
                <td className="p-3 text-gray-900">{total_bookings}</td>
                <td className="p-3 font-bold text-primary">{total_revenue} ﷼</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
