import { Link, useNavigate } from "react-router-dom";
import { Plus, Settings, CheckCircle, XCircle, Edit3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import BookingCard from "../components/BookingCard";
import { assets, bookings } from "../data/mock";

export default function LessorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const myAssets = assets.filter(a => a.ownerId === (user?.id || 2));
  const pendingBookings = bookings.filter(b => b.status === "pending");

  const stats = [
    { label: "أصولي", value: myAssets.length, color: "from-blue-50 to-blue-100/50 text-blue-700", icon: "📦" },
    { label: "طلبات جديدة", value: pendingBookings.length, color: "from-amber-50 to-amber-100/50 text-amber-700", icon: "📋" },
    { label: "نشطة", value: bookings.filter(b => b.status === "active").length, color: "from-emerald-50 to-emerald-100/50 text-emerald-700", icon: "✅" },
  ];

  return (
    <Layout title="لوحة المؤجر">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-center shadow-sm`}>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs mt-0.5 font-medium opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => navigate("/add-asset")}
          className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-2 shadow-md">
          <Plus className="w-4 h-4" />
          إضافة أصل
        </button>
        <button onClick={() => navigate("/assets")}
          className="flex-1 bg-white text-gray-700 text-sm font-bold py-3.5 rounded-2xl border border-gray-200/80 hover:border-primary/30 hover:shadow-sm transition-all flex items-center justify-center gap-2">
          <Settings className="w-4 h-4" />
          إدارة الأصول
        </button>
      </div>

      {/* Pending bookings */}
      {pendingBookings.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            طلبات قيد الانتظار
            <span className="text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">{pendingBookings.length}</span>
          </h3>
          <div className="space-y-3">
            {pendingBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
                <BookingCard booking={booking} />
                <div className="flex gap-2 px-3 pb-3">
                  <button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    قبول
                  </button>
                  <button className="flex-1 bg-red-50 text-red-600 text-sm font-bold py-2.5 rounded-xl border border-red-200 hover:bg-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My assets */}
      <div>
        <h3 className="font-bold text-sm text-gray-900 mb-3">أصولي</h3>
        <div className="space-y-2">
          {myAssets.map(asset => (
            <Link key={asset.id} to={`/edit-asset/${asset.id}`}
              className="bg-white rounded-xl p-3 border border-gray-100/80 flex items-center gap-3 shadow-sm hover:shadow-md transition-all group">
              <img src={asset.image} alt={asset.title}
                className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0 ring-1 ring-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate group-hover:text-primary transition-colors">{asset.title}</p>
                <p className="text-xs text-gray-400">{asset.pricePerDay} ﷼/يوم • {asset.city}</p>
              </div>
              <Edit3 className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
