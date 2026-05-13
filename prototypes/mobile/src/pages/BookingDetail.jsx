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
        <div className="aspect-[21/9] bg-gray-100 relative">
          <img src={booking.asset?.image_url} alt={booking.asset?.title}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shadow-sm bg-white/90 backdrop-blur-sm ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-lg font-black text-gray-900">{booking.asset?.title}</h1>
          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
            <User className="w-3.5 h-3.5" /> {booking.tenant?.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 divide-y divide-gray-50 shadow-sm mb-4 animate-slide-up stagger-1">
        <div className="p-4 flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-gray-400">فترة التأجير</p>
            <p className="font-semibold text-sm text-gray-900">{booking.start_date} → {booking.end_date}</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-gray-400">المبلغ الإجمالي</p>
            <p className="font-semibold text-sm text-gray-900">{booking.total_price} ﷼</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-gray-400">رقم الطلب</p>
            <p className="font-semibold text-sm text-gray-900 font-mono">#{String(booking.id).slice(0, 8)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm mb-4 animate-slide-up stagger-2">
        <h3 className="font-bold text-sm text-gray-900 mb-2">حالة الدفع</h3>
        {booking.payment_status === "paid" ? (
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" /> تم الدفع
          </div>
        ) : booking.payment_status === "pending" ? (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> في انتظار الدفع
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="w-2 h-2 bg-gray-300 rounded-full" /> غير مطلوب
          </div>
        )}
      </div>

      {isLessor && booking.status === "pending" && (
        <div className="flex gap-2 mb-3">
          <button onClick={() => updateStatus(booking.id, "approved")}
            className="flex-1 bg-emerald-500 text-white font-bold py-3 btn-pill hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> قبول
          </button>
          <button onClick={() => updateStatus(booking.id, "rejected")}
            className="flex-1 bg-red-50 text-red-600 font-bold py-3 btn-pill border border-red-200 hover:bg-red-100 transition-all flex items-center justify-center gap-2">
            <XCircle className="w-5 h-5" /> رفض
          </button>
        </div>
      )}

      {canComplete && (
        <button onClick={() => completeBooking(booking.id)}
          className="w-full bg-emerald-500 text-white font-bold py-3 btn-pill hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5" /> تأكيد إنهاء التأجير
        </button>
      )}

      {canPay && (
        <button onClick={() => navigate(`/payment/${booking.id}`)}
          className="w-full bg-primary text-white font-bold py-3 btn-pill hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mb-3">
          <CreditCard className="w-5 h-5" /> إتمام الدفع
        </button>
      )}
      {canCancel && (
        <button onClick={() => cancelBooking(booking.id)}
          className="w-full text-red-500 font-semibold py-3 btn-pill border border-red-200/80 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
          <XCircle className="w-5 h-5" /> إلغاء الطلب
        </button>
      )}
    </Layout>
  );
}
