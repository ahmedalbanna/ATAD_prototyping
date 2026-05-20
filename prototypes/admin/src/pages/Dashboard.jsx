import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Users, Package, ClipboardList, Wallet, ArrowLeft, ShieldCheck } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import StatCard from "../components/StatCard";
import { api } from "../services/apiClient";
import { statusLabels, statusColors } from "../data/mock";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (location.pathname !== "/admin") return;
    api.get("/admin/stats").then(setStats).catch(() => {});
    api.get("/admin/bookings").then(setBookings).catch(() => {});
    api.get("/admin/users").then(setUsers).catch(() => {});
    api.get("/admin/assets").then(setAssets).catch(() => {});
  }, [location.pathname]);

  if (!stats) {
    return <AdminLayout title="لوحة التحكم"><div className="text-center py-20 text-gray-400 shimmer rounded-2xl h-48" /></AdminLayout>;
  }

  const recentBookings = bookings.slice(0, 5);
  const tenants = users.filter(u => u.role === "tenant").length;
  const lessors = users.filter(u => u.role === "lessor").length;
  const available = assets.filter(a => a.status === "available").length;
  const rented = assets.filter(a => a.status === "rented").length;

  return (
    <AdminLayout title="لوحة التحكم">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <StatCard label="إجمالي المستخدمين" value={stats.total_users} icon={Users} color="bg-primary/10 text-primary" />
        <StatCard label="إجمالي الأصول" value={stats.total_assets} icon={Package} color="bg-accent/10 text-accent" />
        <StatCard label="الطلبات النشطة" value={stats.active_rentals} icon={ClipboardList} color="bg-primary-dark/10 text-primary-dark" />
        <Link to="/admin/users?verified=pending"
          className="block bg-white rounded-xl border border-gray-100/80 p-3 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900">{stats.pending_verifications}</p>
              <p className="text-[10px] text-gray-400 font-medium">توثيق قيد المراجعة</p>
            </div>
          </div>
        </Link>
        <StatCard label="الإيرادات" value={`${stats.revenue} ﷼`} icon={Wallet} color="bg-primary/10 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
          <Link to="/admin/bookings" className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" /> آخر الطلبات
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-primary font-semibold">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </span>
          </Link>
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
                  <tr key={b.id} onClick={() => navigate(`/admin/booking/${b.id}`)} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="p-3 font-medium text-gray-900">{b.asset_title}</td>
                    <td className="p-3 text-gray-500">{b.tenant_name}</td>
                    <td className="p-3 text-gray-400 text-xs">{b.start_date} → {b.end_date}</td>
                    <td className="p-3 font-semibold text-gray-900">{b.total_price} ﷼</td>
                    <td className="p-3">
                      <span className={`badge ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            نظرة سريعة
          </h3>
          <div className="space-y-3">
            <Link to="/admin/users" className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
              <span className="text-sm text-gray-500">المستخدمين</span>
              <div className="flex gap-4 text-sm">
                <span><span className="font-bold text-gray-900">{tenants}</span> <span className="text-gray-400">مستأجر</span></span>
                <span><span className="font-bold text-gray-900">{lessors}</span> <span className="text-gray-400">مؤجر</span></span>
              </div>
            </Link>
            <Link to="/admin/assets" className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
              <span className="text-sm text-gray-500">الأصول حسب الحالة</span>
              <div className="flex gap-4 text-sm">
                <span><span className="font-bold text-accent">{available}</span> <span className="text-gray-400">متاح</span></span>
                <span><span className="font-bold text-primary-dark">{rented}</span> <span className="text-gray-400">مؤجر</span></span>
              </div>
            </Link>
            <Link to="/admin/bookings" className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
              <span className="text-sm text-gray-500">الطلبات قيد الانتظار</span>
              <span className="font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full text-sm">{stats.pending_bookings}</span>
            </Link>
            <Link to="/admin/users?verified=pending" className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl hover:bg-amber-100/50 transition-colors border border-amber-200/50">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> طلبات توثيق
              </span>
              <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full text-sm">{stats.pending_verifications}</span>
            </Link>
            <Link to="/admin/revenue" className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-xl hover:from-primary/10 transition-all">
              <span className="text-sm text-gray-500">إجمالي الإيرادات</span>
              <span className="font-bold text-gray-900 text-lg">{stats.revenue} ﷼</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
