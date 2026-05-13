import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";
import { assets } from "../data/mock";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const { showToast } = useToast();
  const asset = assets.find(a => a.id === Number(id));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  if (!asset) {
    return (
      <Layout title="غير موجود" onBack={() => navigate(-1)}>
        <div className="text-center py-20 text-gray-300">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-gray-400">الأصل غير موجود</p>
        </div>
      </Layout>
    );
  }

  const days = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = days * asset.pricePerDay;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!startDate) errs.startDate = "يرجى اختيار تاريخ البداية";
    if (!endDate) errs.endDate = "يرجى اختيار تاريخ النهاية";
    if (startDate && endDate && days <= 0) errs.endDate = "تاريخ النهاية يجب أن يكون بعد تاريخ البداية";
    if (!agree) errs.agree = "يرجى الموافقة على الشروط";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    createBooking({
      assetId: asset.id,
      assetTitle: asset.title,
      assetImage: asset.image,
      tenantId: user?.id || 1,
      tenantName: user?.name || "مستأجر",
      startDate,
      endDate,
      totalPrice: total,
    });
    showToast("تم تقديم الطلب بنجاح! بانتظار موافقة المؤجر", "success");
    setTimeout(() => navigate("/bookings", { replace: true }), 800);
  };

  return (
    <Layout title="طلب تأجير" onBack={() => navigate(-1)}>
      <div className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-100/80 shadow-sm mb-6">
        <img src={asset.image} alt={asset.title}
          className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0 ring-1 ring-gray-100" />
        <div className="min-w-0">
          <h2 className="font-bold text-gray-900 text-sm truncate">{asset.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{asset.city}</p>
          <p className="text-primary font-bold text-sm mt-1">{asset.pricePerDay} ﷼ / يوم</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> تحديد المدة
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">تاريخ البداية</label>
              <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); if (errors.startDate) setErrors(p => { const n = { ...p }; delete n.startDate; return n; }); }}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full p-3 border rounded-xl focus:outline-none transition-all text-sm ${
                  errors.startDate ? "border-red-300 bg-red-50/50" : "border-gray-200 bg-gray-50/50 focus:border-primary"
                }`} />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">تاريخ النهاية</label>
              <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); if (errors.endDate) setErrors(p => { const n = { ...p }; delete n.endDate; return n; }); }}
                min={startDate || new Date().toISOString().split("T")[0]}
                className={`w-full p-3 border rounded-xl focus:outline-none transition-all text-sm ${
                  errors.endDate ? "border-red-300 bg-red-50/50" : "border-gray-200 bg-gray-50/50 focus:border-primary"
                }`} />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        {days > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-4 border border-primary/10">
            <h3 className="font-bold text-sm text-gray-900 mb-3">ملخص التكلفة</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{asset.pricePerDay} ﷼ × {days} يوم</span>
                <span>{total} ﷼</span>
              </div>
              <div className="border-t border-primary/10 pt-2 flex justify-between font-bold text-gray-900">
                <span>الإجمالي</span>
                <span className="text-primary text-lg">{total} ﷼</span>
              </div>
            </div>
          </div>
        )}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={agree} onChange={e => { setAgree(e.target.checked); if (errors.agree) setErrors(p => { const n = { ...p }; delete n.agree; return n; }); }}
            className="mt-0.5 accent-primary w-4 h-4 rounded border-gray-300" />
          <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
            أقر بأنني اطلعت على شروط التأجير وأوافق عليها.
          </span>
        </label>
        {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

        <button type="submit" disabled={!startDate || !endDate || days <= 0 || !agree}
          className="w-full bg-primary text-white font-bold py-4 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          تقديم طلب التأجير
        </button>
      </form>
    </Layout>
  );
}
