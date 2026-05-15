import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, User, Wallet, Phone, Building2, ArrowRight, CheckCircle, XCircle, CreditCard, Clock, ChevronLeft } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import { api } from "../services/apiClient";
import { statusLabels, statusColors } from "../data/mock";

const statusSteps = ["pending", "approved", "active", "completed"];

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [actionTarget, setActionTarget] = useState(null);

  const fetchBooking = () => {
    api.get(`/admin/bookings/${id}`).then(setBooking).catch(() => setBooking(null));
  };

  useEffect(() => { fetchBooking(); }, [id]);

  const handleAction = async (status) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      fetchBooking();
      setActionTarget(null);
    } catch {}
  };

  if (!booking) return <AdminLayout title="الطلب"><div className="text-center py-20 text-gray-400">الطلب غير موجود</div></AdminLayout>;

  const currentStepIndex = statusSteps.indexOf(booking.status);
  const payment = booking.payments?.[0];
  const duration = Math.max(1, Math.round((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)));

  return (
    <AdminLayout title={`طلب #${String(booking.id).slice(0, 8)}`}>
      <button onClick={() => navigate("/admin/bookings")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowRight className="w-4 h-4" /> عودة للطلبات
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Booking header */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              {booking.asset_image && (
                <img src={booking.asset_image} alt={booking.asset_title}
                  className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{booking.asset_title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{booking.asset_city}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[booking.status]}`}>
                    {statusLabels[booking.status]}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {booking.start_date} → {booking.end_date}</span>
                  <span>{duration} يوم</span>
                  {booking.asset_price && <span>{booking.asset_price} ﷼/يوم</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-4">حالة الطلب</h3>
            <div className="relative">
              <div className="absolute right-[11px] top-2 bottom-2 w-0.5 bg-gray-100 rounded-full" />
              <div className="space-y-4">
                {statusSteps.map((step, i) => {
                  const isReached = currentStepIndex >= i;
                  const isCurrent = currentStepIndex === i;
                  const isRejected = booking.status === "rejected";
                  const Icon = step === "pending" ? Clock : step === "approved" ? CheckCircle : step === "active" ? CalendarDays : CheckCircle;
                  return (
                    <div key={step} className="flex gap-3 pr-8 relative">
                      <div className={`absolute right-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        isRejected && i === 0 ? "border-red-300 bg-red-50" :
                        isCurrent ? "border-primary bg-primary/10" :
                        isReached ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-white"
                      }`}>
                        <Icon className={`w-3 h-3 ${
                          isRejected && i === 0 ? "text-red-500" :
                          isCurrent ? "text-primary" :
                          isReached ? "text-emerald-500" : "text-gray-300"
                        }`} />
                      </div>
                      <div className={`pb-1 ${isCurrent ? "font-semibold text-gray-900" : isReached ? "text-gray-600" : "text-gray-400"}`}>
                        <p className={`text-sm ${isCurrent ? "font-bold" : ""}`}>
                          {step === "pending" ? "تقديم الطلب" :
                           step === "approved" ? "تمت الموافقة" :
                           step === "active" ? "قيد التنفيذ" :
                           "مكتمل"}
                        </p>
                        {booking.status_history?.filter(h => h.to_status === step).map((h, j) => (
                          <p key={j} className="text-xs text-gray-400 mt-0.5">{h.created_at?.slice(0, 16)?.replace("T", " ")}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {booking.status === "rejected" && (
                  <div className="flex gap-3 pr-8 relative">
                    <div className="absolute right-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-red-300 bg-red-50">
                      <XCircle className="w-3 h-3 text-red-500" />
                    </div>
                    <div className="text-sm text-red-600 font-semibold">
                      <p>مرفوض</p>
                      {booking.status_history?.filter(h => h.to_status === "rejected").map((h, j) => (
                        <p key={j} className="text-xs text-gray-400 mt-0.5 font-normal">{h.created_at?.slice(0, 16)?.replace("T", " ")}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status history */}
          {booking.status_history?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">سجل الحالة</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400 text-xs">
                      <th className="text-right p-2 font-semibold">من</th>
                      <th className="text-right p-2 font-semibold">إلى</th>
                      <th className="text-right p-2 font-semibold">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.status_history.map((s, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-2 text-gray-500 text-xs">{s.from_status ? statusLabels[s.from_status] || s.from_status : "—"}</td>
                        <td className="p-2">
                          <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColors[s.to_status]}`}>
                            {statusLabels[s.to_status] || s.to_status}
                          </span>
                        </td>
                        <td className="p-2 text-gray-400 text-xs">{s.created_at?.slice(0, 16)?.replace("T", " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment info */}
          {payment && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-primary" /> معلومات الدفع
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">المبلغ</span>
                  <span className="font-bold text-gray-900">{payment.amount} ﷼</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">طريقة الدفع</span>
                  <span className="text-gray-900">{payment.method === "mock" ? "تجريبي" : payment.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">رقم المرجع</span>
                  <span className="text-gray-900 font-mono text-xs">{payment.reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">تاريخ الدفع</span>
                  <span className="text-gray-900">{payment.paid_at?.slice(0, 10)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">معلومات الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">رقم الطلب</span>
                <span className="font-semibold text-gray-900 font-mono text-xs">#{String(booking.id).slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المبلغ</span>
                <span className="font-bold text-primary">{booking.total_price} ﷼</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المدة</span>
                <span className="text-gray-900">{duration} يوم</span>
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

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" /> المستأجر
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-sm">
                {booking.tenant_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{booking.tenant_name}</p>
                {booking.tenant_phone && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5" dir="ltr">
                    <Phone className="w-3 h-3" /> {booking.tenant_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" /> المؤجر
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-emerald-600 text-sm">
                {booking.owner_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{booking.owner_name}</p>
                {booking.owner_phone && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5" dir="ltr">
                    <Phone className="w-3 h-3" /> {booking.owner_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">إجراءات</h3>
            {booking.status === "pending" && (
              <div className="space-y-2">
                <button onClick={() => setActionTarget("approved")}
                  className="w-full bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]">
                  <CheckCircle className="w-4 h-4" /> قبول الطلب
                </button>
                <button onClick={() => setActionTarget("rejected")}
                  className="w-full bg-red-50 text-red-600 text-sm font-bold py-2.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]">
                  <XCircle className="w-4 h-4" /> رفض الطلب
                </button>
              </div>
            )}
            {booking.status === "approved" && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3 text-center font-medium">
                في انتظار تأكيد الدفع من المستأجر
              </p>
            )}
            {booking.status === "active" && (
              <button onClick={() => setActionTarget("completed")}
                className="w-full bg-primary text-white text-sm font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]">
                <CheckCircle className="w-4 h-4" /> تأكيد الإنهاء
              </button>
            )}
            {booking.status === "completed" && (
              <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg p-3 text-center font-medium">
                تم إكمال هذا الطلب
              </p>
            )}
            {booking.status === "rejected" && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg p-3 text-center font-medium">
                تم رفض هذا الطلب
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog open={!!actionTarget}
        title={actionTarget === "approved" ? "قبول الطلب" : actionTarget === "rejected" ? "رفض الطلب" : "تأكيد الإنهاء"}
        message={
          actionTarget === "approved" ? "هل أنت متأكد من قبول هذا الطلب؟" :
          actionTarget === "rejected" ? "هل أنت متأكد من رفض هذا الطلب؟" :
          "هل أنت متأكد من تأكيد إنهاء هذا الطلب؟"
        }
        confirmLabel={actionTarget === "approved" ? "قبول" : actionTarget === "rejected" ? "رفض" : "تأكيد"}
        danger={actionTarget === "rejected"}
        onConfirm={() => actionTarget && handleAction(actionTarget)}
        onCancel={() => setActionTarget(null)} />
    </AdminLayout>
  );
}
