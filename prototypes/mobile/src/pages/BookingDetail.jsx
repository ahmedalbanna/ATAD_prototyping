import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, User, Wallet, FileText, AlertCircle, CreditCard, XCircle } from "lucide-react";
import Layout from "../components/Layout";
import { bookings, statusLabels, statusColors } from "../data/mock";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find(b => b.id === Number(id));

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

  const canPay = booking.status === "approved" && booking.paymentStatus !== "paid";
  const canCancel = booking.status === "pending" || booking.status === "approved";

  return (
    <Layout title="تفاصيل الطلب" onBack={() => navigate(-1)}>
      {/* Header with image */}
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm mb-4">
        <div className="aspect-[21/9] bg-gray-100 relative">
          <img src={booking.assetImage} alt={booking.assetTitle}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shadow-sm bg-white/90 backdrop-blur-sm ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-lg font-black text-gray-900">{booking.assetTitle}</h1>
          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
            <User className="w-3.5 h-3.5" /> {booking.tenantName}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100/80 divide-y divide-gray-50 shadow-sm mb-4">
        <div className="p-4 flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-gray-400">فترة التأجير</p>
            <p className="font-semibold text-sm text-gray-900">{booking.startDate} → {booking.endDate}</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-gray-400">المبلغ الإجمالي</p>
            <p className="font-semibold text-sm text-gray-900">{booking.totalPrice} ﷼</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-gray-400">رقم الطلب</p>
            <p className="font-semibold text-sm text-gray-900 font-mono">#{String(booking.id).padStart(4, "0")}</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-gray-400">المستأجر</p>
            <p className="font-semibold text-sm text-gray-900">{booking.tenantName}</p>
          </div>
        </div>
      </div>

      {/* Payment status */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm mb-4">
        <h3 className="font-bold text-sm text-gray-900 mb-2">حالة الدفع</h3>
        {booking.paymentStatus === "paid" ? (
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            تم الدفع
          </div>
        ) : booking.paymentStatus === "pending" ? (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            في انتظار الدفع
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="w-2 h-2 bg-gray-300 rounded-full" />
            غير مطلوب
          </div>
        )}
      </div>

      {/* Actions */}
      {canPay && (
        <button onClick={() => navigate(`/payment/${booking.id}`)}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-2 mb-3">
          <CreditCard className="w-5 h-5" />
          إتمام الدفع
        </button>
      )}
      {canCancel && (
        <button className="w-full text-red-500 font-semibold py-3.5 rounded-2xl border border-red-200/80 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
          <XCircle className="w-5 h-5" />
          إلغاء الطلب
        </button>
      )}
    </Layout>
  );
}
