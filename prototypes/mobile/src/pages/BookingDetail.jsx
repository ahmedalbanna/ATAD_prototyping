import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, User, Wallet, FileText, AlertCircle, CreditCard, XCircle, CheckCircle } from "lucide-react";
import { useBookings } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { statusLabels, statusColors } from "../data/mock";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLessor } = useAuth();
  const { bookings, updateStatus, cancelBooking, completeBooking } = useBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return (
      <Layout title="غير موجود" onBack={() => navigate(-1)}>
        <div className="text-center py-20 text-gray-300">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-gray-400">الطلب غير موجود</p>
        </div>
      </Layout>
    );
  }

  const canPay = booking.status === "approved" && booking.payment_status !== "paid";
  const canCancel = (booking.status === "pending" || booking.status === "approved") && !isLessor;
  const canComplete = booking.status === "active" && isLessor;

  return (
    <Layout title="تفاصيل الطلب" onBack={() => navigate(-1)}>
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm mb-4 animate-slide-up">
        <div className="aspect-[21/9] bg-gradient-to-br from-gray-100 to-gray-200 relative">
          <img src={booking.asset?.image_url} alt={booking.asset?.title}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium border shadow-lg backdrop-blur-sm ${statusColors[booking.status]} bg-white/95`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                booking.status === "pending" ? "bg-amber-500" :
                booking.status === "approved" ? "bg-blue-500" :
                booking.status === "active" ? "bg-emerald-500" :
                booking.status === "completed" ? "bg-gray-500" :
                booking.status === "rejected" ? "bg-red-500" : "bg-gray-400"
              }`} />
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-lg font-black text-gray-900">{booking.asset?.title}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <User className="w-3.5 h-3.5 text-primary/60" /> {booking.tenant?.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 divide-y divide-gray-50 shadow-sm mb-4 animate-slide-up stagger-1 overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <CalendarDays className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-400">فترة التأجير</p>
            <p className="font-semibold text-sm text-gray-900">{booking.start_date} → {booking.end_date}</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <Wallet className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-400">المبلغ الإجمالي</p>
            <p className="font-semibold text-sm bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">{booking.total_price} ﷼</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-400">رقم الطلب</p>
            <p className="font-semibold text-sm text-gray-900 font-mono tracking-wide">#{String(booking.id).slice(0, 8)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm mb-4 animate-slide-up stagger-2">
        <h3 className="font-bold text-sm text-gray-900 mb-3">حالة الدفع</h3>
        <div className={`rounded-xl p-3 flex items-center gap-2.5 text-sm border ${
          booking.payment_status === "paid"
            ? "bg-gradient-to-l from-emerald-50 to-emerald-100/60 border-emerald-200/50 text-emerald-700"
            : booking.payment_status === "pending"
            ? "bg-gradient-to-l from-amber-50 to-amber-100/60 border-amber-200/50 text-amber-700"
            : "bg-gradient-to-l from-gray-50 to-gray-100/60 border-gray-200/50 text-gray-500"
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            booking.payment_status === "paid" ? "bg-emerald-500" :
            booking.payment_status === "pending" ? "bg-amber-500 animate-pulse" :
            "bg-gray-300"
          }`} />
          <span className="font-medium">
            {booking.payment_status === "paid" ? "تم الدفع" :
             booking.payment_status === "pending" ? "في انتظار الدفع" :
             "غير مطلوب"}
          </span>
        </div>
      </div>

      {isLessor && booking.status === "pending" && (
        <div className="flex gap-2 mb-3">
          <button onClick={() => updateStatus(booking.id, "approved")}
            className="flex-1 bg-gradient-to-l from-emerald-500 to-emerald-400 text-white font-bold py-3 btn-pill hover:shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.97]">
            <CheckCircle className="w-5 h-5" /> قبول
          </button>
          <button onClick={() => updateStatus(booking.id, "rejected")}
            className="flex-1 bg-white text-red-600 font-bold py-3 btn-pill border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 active:scale-[0.97]">
            <XCircle className="w-5 h-5" /> رفض
          </button>
        </div>
      )}

      {canComplete && (
        <button onClick={() => completeBooking(booking.id)}
          className="w-full bg-gradient-to-l from-emerald-500 to-emerald-400 text-white font-bold py-3 btn-pill hover:shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mb-3 active:scale-[0.97]">
          <CheckCircle className="w-5 h-5" /> تأكيد إنهاء التأجير
        </button>
      )}

      {canPay && (
        <button onClick={() => navigate(`/payment/${booking.id}`)}
          className="w-full bg-gradient-to-l from-primary to-primary-light text-white font-bold py-3 btn-pill hover:shadow-md hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 mb-3 active:scale-[0.97]">
          <CreditCard className="w-5 h-5" /> إتمام الدفع
        </button>
      )}
      {canCancel && (
        <button onClick={() => cancelBooking(booking.id)}
          className="w-full text-red-500 font-semibold py-3 btn-pill border-2 border-red-200/80 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 active:scale-[0.97]">
          <XCircle className="w-5 h-5" /> إلغاء الطلب
        </button>
      )}
    </Layout>
  );
}
