import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { api } from "../services/apiClient";
import Layout from "../components/Layout";
import BookingCard from "../components/BookingCard";

export default function LessorDashboard() {
  const { user } = useAuth();
  const { bookings, updateStatus } = useBookings();
  const [myAssetIds, setMyAssetIds] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("all");

  useEffect(() => {
    if (user) {
      api.get(`/assets?owner_id=${user.id}`).then(data => {
        const assets = data.data || data;
        setMyAssetIds(assets.map(a => a.id));
      }).catch(() => {});
    }
  }, [user]);

  const myBookings = bookings.filter(b => myAssetIds.includes(b.asset?.id));
  const pendingCount = myBookings.filter(b => b.status === "pending").length;

  const bookingStatuses = [
    { key: "all", label: "الكل", count: myBookings.length },
    { key: "pending", label: "قيد الانتظار", count: pendingCount },
    { key: "approved", label: "تمت الموافقة", count: myBookings.filter(b => b.status === "approved").length },
    { key: "active", label: "نشط", count: myBookings.filter(b => b.status === "active").length },
    { key: "completed", label: "مكتمل", count: myBookings.filter(b => b.status === "completed").length },
    { key: "rejected", label: "مرفوض", count: myBookings.filter(b => b.status === "rejected").length },
  ];

  const filteredBookings = bookingFilter === "all" ? myBookings : myBookings.filter(b => b.status === bookingFilter);

  return (
    <Layout title="إدارة الطلبات">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {bookingStatuses.map(s => (
          <button key={s.key} onClick={() => setBookingFilter(s.key)}
            className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-medium transition-all rounded-full ${
              bookingFilter === s.key
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "bg-white text-gray-500 border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300"
            }`}>
            {s.label}
            <span className={`mr-1.5 ${bookingFilter === s.key ? "text-white/70" : "text-gray-400"}`}>({s.count})</span>
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <ClipboardList className="w-6 h-6 opacity-40" />
          </div>
          <p className="font-medium text-gray-400 text-sm">لا توجد طلبات</p>
          <p className="text-xs text-gray-300 mt-1">
            {bookingFilter === "all" ? "لم يتم تقديم أي طلبات على أصولك بعد" : "لا توجد طلبات بهذه الحالة"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} actions={
              booking.status === "pending" ? (
                <div className="flex gap-1.5 pt-1">
                  <button onClick={() => updateStatus(booking.id, "approved")}
                    className="flex-1 bg-gradient-to-l from-emerald-500 to-emerald-400 text-white text-xs font-bold py-2 btn-pill hover:shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1 active:scale-[0.97]">
                    <CheckCircle className="w-3.5 h-3.5" /> قبول
                  </button>
                  <button onClick={() => updateStatus(booking.id, "rejected")}
                    className="flex-1 bg-white text-red-600 text-xs font-bold py-2 btn-pill border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-1 active:scale-[0.97]">
                    <XCircle className="w-3.5 h-3.5" /> رفض
                  </button>
                </div>
              ) : booking.status === "active" ? (
                <div className="pt-1">
                  <div className="bg-gradient-to-l from-emerald-50 to-emerald-100/60 text-emerald-700 text-xs rounded-xl p-2.5 text-center font-medium border border-emerald-200/50 shadow-sm">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1.5 animate-pulse" />
                    تأجير نشط — ينتهي في {booking.end_date}
                  </div>
                </div>
              ) : booking.status === "approved" ? (
                <div className="pt-1">
                  <div className="bg-gradient-to-l from-blue-50 to-blue-100/60 text-blue-700 text-xs rounded-xl p-2.5 text-center font-medium border border-blue-200/50 shadow-sm">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full ml-1.5" />
                    تمت الموافقة — في انتظار الدفع
                  </div>
                </div>
              ) : null
            } />
          ))}
        </div>
      )}
    </Layout>
  );
}
