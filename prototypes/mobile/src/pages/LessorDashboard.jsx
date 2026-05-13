import { Link, useNavigate } from "react-router-dom";
import { Plus, Wallet, LayoutGrid, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import Layout from "../components/Layout";
import BookingCard from "../components/BookingCard";
import { assets, transactions as staticTx } from "../data/mock";

export default function LessorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, updateStatus } = useBookings();
  const myAssets = assets.filter(a => a.ownerId === (user?.id || 2));
  const myAssetIds = myAssets.map(a => a.id);
  const pendingBookings = bookings.filter(b => b.status === "pending" && myAssetIds.includes(b.assetId));
  const activeRentals = bookings.filter(b => b.status === "active" && myAssetIds.includes(b.assetId));
  const totalEarned = staticTx.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);

  const handleAccept = (bookingId) => {
    updateStatus(bookingId, "approved");
  };

  const handleReject = (bookingId) => {
    updateStatus(bookingId, "rejected");
  };

  return (
    <Layout title="لوحة المؤجر">
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "أصولي", value: myAssets.length, color: "bg-blue-50 text-blue-700" },
          { label: "نشطة", value: activeRentals.length, color: "bg-emerald-50 text-emerald-700" },
          { label: "جديدة", value: pendingBookings.length, color: "bg-amber-50 text-amber-700" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center shadow-sm`}>
            <p className="text-xl font-black">{s.value}</p>
            <p className="text-[10px] font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-l from-primary to-primary-dark rounded-2xl p-4 mb-4 text-white shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <p className="text-white/60 text-xs">إجمالي الأرباح</p>
          <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">{myAssets.length} أصول</span>
        </div>
        <p className="text-2xl font-black">{totalEarned} <span className="text-base font-medium text-white/70">﷼</span></p>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => navigate("/add-asset")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-bold py-2.5 btn-pill hover:bg-primary-dark transition-all shadow-sm">
          <Plus className="w-4 h-4" /> إضافة أصل
        </button>
        <button onClick={() => navigate("/lessor-assets")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 text-xs font-bold py-2.5 btn-pill border border-gray-200/80 hover:border-primary/30 transition-all">
          <LayoutGrid className="w-4 h-4" /> إدارة الأصول
        </button>
        <button onClick={() => navigate("/lessor-earnings")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 text-xs font-bold py-2.5 btn-pill border border-gray-200/80 hover:border-primary/30 transition-all">
          <Wallet className="w-4 h-4" /> الأرباح
        </button>
      </div>

      {pendingBookings.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-sm text-gray-900 mb-2">
            طلبات قيد الانتظار ({pendingBookings.length})
          </h3>
          <div className="space-y-2">
            {pendingBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl border border-gray-100/80 shadow-sm overflow-hidden">
                <BookingCard booking={booking} />
                <div className="flex gap-1.5 px-3 pb-3 pt-0">
                  <button onClick={() => handleAccept(booking.id)}
                    className="flex-1 bg-emerald-500 text-white text-xs font-bold py-2 btn-pill hover:bg-emerald-600 transition-all flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> قبول
                  </button>
                  <button onClick={() => handleReject(booking.id)}
                    className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2 btn-pill border border-red-200 hover:bg-red-100 transition-all flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(pendingBookings.length === 0) && (
        <div className="bg-white rounded-xl p-4 border border-gray-100/80 text-center mb-4">
          <p className="text-sm text-gray-400">لا توجد طلبات جديدة</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-gray-900">أصولي</h3>
          <Link to="/lessor-assets" className="text-xs text-primary font-semibold">إدارة</Link>
        </div>
        <div className="space-y-1.5">
          {myAssets.slice(0, 4).map(asset => (
            <Link key={asset.id} to={`/edit-asset/${asset.id}`}
              className="bg-white rounded-xl p-2.5 border border-gray-100/80 flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all">
              <img src={asset.image} alt={asset.title}
                className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-gray-900 truncate">{asset.title}</p>
                <p className="text-[10px] text-gray-400">{asset.pricePerDay} ﷼/يوم</p>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                asset.status === "available" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                asset.status === "rented" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-red-50 text-red-700 border-red-200"
              }`}>
                {asset.status === "available" ? "متاح" : asset.status === "rented" ? "مؤجر" : "صيانة"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
