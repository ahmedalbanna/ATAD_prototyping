import { useState } from "react";
import { Wallet, TrendingUp, CalendarDays, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { stats, revenueByMonth } from "../data/mock";

export default function AdminRevenue() {
  const [period, setPeriod] = useState("monthly");

  const totalRevenue = revenueByMonth.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = revenueByMonth.reduce((s, m) => s + m.bookings, 0);
  const lastMonth = revenueByMonth.filter(m => m.revenue > 0).slice(-1)[0];
  const prevMonth = revenueByMonth.filter(m => m.revenue > 0).slice(-2, -1)[0];
  const growth = prevMonth && lastMonth
    ? ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(0)
    : 0;

  const cards = [
    { label: "إجمالي الإيرادات", value: `${totalRevenue} ﷼`, icon: Wallet, color: "bg-purple-50 text-purple-600" },
    { label: "إجمالي الحجوزات", value: totalBookings, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "معدل النمو", value: `${growth}%`, icon: growth > 0 ? ArrowUp : ArrowDown, color: growth > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600" },
    { label: "متوسط الحجز", value: totalBookings > 0 ? `${Math.round(totalRevenue / totalBookings)} ﷼` : "0", icon: Wallet, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <AdminLayout title="الإيرادات">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => {
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

      {/* Monthly chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> الإيرادات الشهرية
          </h3>
          <div className="flex gap-1">
            {["monthly", "yearly"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  period === p ? "bg-primary text-white" : "bg-gray-50 text-gray-500"
                }`}>
                {p === "monthly" ? "شهري" : "سنوي"}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 lg:p-6">
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-40">
            {revenueByMonth.map((m, i) => {
              const max = Math.max(...revenueByMonth.map(x => x.revenue), 1);
              const height = (m.revenue / max) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-semibold text-gray-900">{m.revenue > 0 ? `${m.revenue} ﷼` : ""}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-light transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <span className="text-[10px] text-gray-400 mt-1">{m.month.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>

          {/* Monthly table */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs">
                  <th className="text-right p-2 font-semibold">الشهر</th>
                  <th className="text-right p-2 font-semibold">الحجوزات</th>
                  <th className="text-right p-2 font-semibold">الإيرادات</th>
                </tr>
              </thead>
              <tbody>
                {revenueByMonth.map(m => (
                  <tr key={m.month} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-2 font-medium text-gray-900">{m.month}</td>
                    <td className="p-2 text-gray-500">{m.bookings}</td>
                    <td className="p-2 font-semibold text-primary">{m.revenue} ﷼</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="p-2 text-gray-900">الإجمالي</td>
                  <td className="p-2 text-gray-900">{totalBookings}</td>
                  <td className="p-2 text-primary">{totalRevenue} ﷼</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
