import { Users, Package, ClipboardList, Wallet } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { assets, bookings, users, stats, statusLabels, statusColors } from "../data/mock";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-sm text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const recentBookings = bookings.slice(0, 5);

  return (
    <AdminLayout title="لوحة التحكم">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="إجمالي المستخدمين" value={stats.totalUsers} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard label="إجمالي الأصول" value={stats.totalAssets} icon={Package} color="bg-emerald-50 text-emerald-600" />
        <StatCard label="الطلبات النشطة" value={stats.activeRentals} icon={ClipboardList} color="bg-amber-50 text-amber-600" />
        <StatCard label="الإيرادات" value={`${stats.revenue} ﷼`} icon={Wallet} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" /> آخر الطلبات
            </h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">إجمالي: {stats.totalBookings}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-gray-400 text-xs">
                  <th className="text-right p-3 font-semibold">الأصل</th>
                  <th className="text-right p-3 font-semibold">المستأجر</th>
                  <th className="text-right p-3 font-semibold">المدة</th>
                  <th className="text-right p-3 font-semibold">المبلغ</th>
                  <th className="text-right p-3 font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 font-medium text-gray-900">{b.assetTitle}</td>
                    <td className="p-3 text-gray-500">{b.tenantName}</td>
                    <td className="p-3 text-gray-400 text-xs">{b.startDate} → {b.endDate}</td>
                    <td className="p-3 font-semibold text-gray-900">{b.totalPrice} ﷼</td>
                    <td className="p-3">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick summary */}
        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            نظرة سريعة
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
              <span className="text-sm text-gray-500">المستخدمين</span>
              <div className="flex gap-4 text-sm">
                <span><span className="font-bold text-gray-900">{users.filter(u => u.role === "tenant").length}</span> <span className="text-gray-400">مستأجر</span></span>
                <span><span className="font-bold text-gray-900">{users.filter(u => u.role === "lessor").length}</span> <span className="text-gray-400">مؤجر</span></span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
              <span className="text-sm text-gray-500">الأصول حسب الحالة</span>
              <div className="flex gap-4 text-sm">
                <span><span className="font-bold text-emerald-600">{assets.filter(a => a.status === "available").length}</span> <span className="text-gray-400">متاح</span></span>
                <span><span className="font-bold text-amber-600">{assets.filter(a => a.status === "rented").length}</span> <span className="text-gray-400">مؤجر</span></span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
              <span className="text-sm text-gray-500">الطلبات قيد الانتظار</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-sm">{stats.pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-xl">
              <span className="text-sm text-gray-500">إجمالي الإيرادات</span>
              <span className="font-bold text-gray-900 text-lg">{stats.revenue} ﷼</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
