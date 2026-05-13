import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, User, Wallet, FileText, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/apiClient";
import { statusLabels, statusColors } from "../data/mock";

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.get(`/admin/bookings/${id}`).then(setBooking).catch(() => setBooking(null));
  }, [id]);

  const handleAction = async (status) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      const updated = await api.get(`/admin/bookings/${id}`);
      setBooking(updated);
    } catch {}
  };

  if (!booking) return <AdminLayout title="الطلب"><div className="text-center py-20 text-gray-400">الطلب غير موجود</div></AdminLayout>;

  return (
    <AdminLayout title={`طلب #${String(booking.id).slice(0, 8)}`}>
      <button onClick={() => navigate("/admin/bookings")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowRight className="w-4 h-4" /> عودة للطلبات
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              {booking.asset?.image_url && (
                <img src={booking.asset.image_url} alt={booking.asset?.title}
                  className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900">{booking.asset?.title}</h2>
                <p className="text-sm text-gray-500 mt-1">المستأجر: {booking.tenant?.name}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                    {statusLabels[booking.status]}
                  </span>
                  <span className="text-gray-400">{booking.start_date} → {booking.end_date}</span>
                </div>
              </div>
            </div>
          </div>

          {booking.asset?.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-2">وصف الأصل</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{booking.asset.description}</p>
            </div>
          )}

          {booking.status_history?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">سجل الحالة</h3>
              <div className="space-y-3">
                {booking.status_history.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.to_status === booking.status ? "bg-primary" : "bg-gray-200"}`} />
                    <span className={`text-sm ${s.to_status === booking.status ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                      {s.to_status === "pending" ? "تقديم الطلب" : statusLabels[s.to_status] || s.to_status}
                    </span>
                    <span className="text-xs text-gray-400 mr-auto">{s.created_at?.slice(0, 10)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">معلومات الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">رقم الطلب</span>
                <span className="font-semibold text-gray-900 font-mono">#{String(booking.id).slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المبلغ</span>
                <span className="font-bold text-primary">{booking.total_price} ﷼</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المستأجر</span>
                <span className="font-semibold text-gray-900">{booking.tenant?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تاريخ البداية</span>
                <span className="text-gray-900">{booking.start_date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تاريخ النهاية</span>
                <span className="text-gray-900">{booking.end_date}</span>
              </div>
            </div>
          </div>

          {booking.status === "pending" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">إجراءات</h3>
              <div className="flex gap-2">
                <button onClick={() => handleAction("approved")}
                  className="flex-1 bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> قبول
                </button>
                <button onClick={() => handleAction("rejected")}
                  className="flex-1 bg-red-50 text-red-600 text-sm font-bold py-2.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5">
                  <XCircle className="w-4 h-4" /> رفض
                </button>
              </div>
            </div>
          )}

          {booking.status === "active" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <button onClick={() => handleAction("completed")}
                className="w-full bg-primary text-white text-sm font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> تأكيد الإنهاء
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
