import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, User, Wallet, FileText, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { bookings, statusLabels, statusColors, assetDetails } from "../data/mock";

const actionColors = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
  active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  completed: "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
  expired: "bg-gray-50 text-gray-400 ring-1 ring-gray-200",
};

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find(b => b.id === Number(id));
  const assetInfo = assetDetails[booking?.assetId];

  if (!booking) {
    return (
      <AdminLayout title="الطلب">
        <div className="text-center py-20 text-gray-400">الطلب غير موجود</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`طلب #${String(booking.id).padStart(4, "0")}`}>
      <button onClick={() => navigate("/admin/bookings")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowRight className="w-4 h-4" /> عودة للطلبات
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              {assetInfo?.image && (
                <img src={assetInfo.image} alt={booking.assetTitle}
                  className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900">{booking.assetTitle}</h2>
                <p className="text-sm text-gray-500 mt-1">المستأجر: {booking.tenantName}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                    {statusLabels[booking.status]}
                  </span>
                  <span className="text-gray-400">{booking.startDate} → {booking.endDate}</span>
                </div>
              </div>
            </div>
          </div>

          {assetInfo?.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-2">وصف الأصل</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{assetInfo.description}</p>
              {assetInfo.category && (
                <span className="inline-block mt-2 text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{assetInfo.category}</span>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">سجل الحالة</h3>
            <div className="space-y-3">
              {[
                { action: "تقديم الطلب", date: booking.createdAt || "2026-05-14", done: true },
                { action: statusLabels[booking.status], date: "", done: booking.status !== "pending" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.done ? "bg-primary" : "bg-gray-200"}`} />
                  <span className={`text-sm ${s.done ? "text-gray-900" : "text-gray-400"}`}>{s.action}</span>
                  {s.date && <span className="text-xs text-gray-400 mr-auto">{s.date}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">معلومات الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">رقم الطلب</span>
                <span className="font-semibold text-gray-900 font-mono">#{String(booking.id).padStart(4, "0")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المبلغ</span>
                <span className="font-bold text-primary">{booking.totalPrice} ﷼</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المستأجر</span>
                <span className="font-semibold text-gray-900">{booking.tenantName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تاريخ البداية</span>
                <span className="text-gray-900">{booking.startDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تاريخ النهاية</span>
                <span className="text-gray-900">{booking.endDate}</span>
              </div>
            </div>
          </div>

          {/* Admin actions */}
          {booking.status === "pending" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">إجراءات</h3>
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> قبول
                </button>
                <button className="flex-1 bg-red-50 text-red-600 text-sm font-bold py-2.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5">
                  <XCircle className="w-4 h-4" /> رفض
                </button>
              </div>
            </div>
          )}

          {booking.status === "active" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <button className="w-full bg-primary text-white text-sm font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> تأكيد الإنهاء
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
