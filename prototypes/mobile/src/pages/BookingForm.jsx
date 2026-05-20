import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/apiClient";
import Layout from "../components/Layout";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const { showToast } = useToast();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/assets/${id}`).then(setAsset).catch(() => setAsset(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout title="طلب تأجير" onBack={() => navigate(-1)}><div className="shimmer rounded-2xl h-64" /></Layout>;

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
  const total = days * asset.price_per_day;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!startDate) errs.startDate = "يرجى اختيار تاريخ البداية";
    if (!endDate) errs.endDate = "يرجى اختيار تاريخ النهاية";
    if (startDate && endDate && days <= 0) errs.endDate = "تاريخ النهاية يجب أن يكون بعد تاريخ البداية";
    if (!agree) errs.agree = "يرجى الموافقة على الشروط";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await createBooking({
        assetId: asset.id,
        startDate,
        endDate,
        totalPrice: total,
      });
      setTimeout(() => navigate("/bookings", { replace: true }), 800);
    } catch (err) {
      showToast(err.message || "فشل إنشاء الطلب", "error");
    }
  };

  return (
    <Layout title="طلب تأجير" onBack={() => navigate(-1)}>
      <div className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-100/80 shadow-sm mb-6">
        <img src={asset.image_url} alt={asset.title}
          className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0 ring-1 ring-gray-100" />
        <div className="min-w-0">
          <h2 className="font-bold text-gray-900 text-sm truncate">{asset.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{asset.city}</p>
          <p className="text-primary font-bold text-sm mt-1">{asset.price_per_day} ﷼ / يوم</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> تحديد المدة
          </h3>

          <AvailabilityCalendar
            assetId={id}
            startDate={startDate}
            endDate={endDate}
            onChangeStart={(v) => { setStartDate(v); if (errors.startDate) setErrors(p => { const n = { ...p }; delete n.startDate; return n; }); }}
            onChangeEnd={(v) => { setEndDate(v); if (errors.endDate) setErrors(p => { const n = { ...p }; delete n.endDate; return n; }); }}
          />

          {startDate && endDate && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 text-xs">
              <span className="text-gray-500">من <span className="font-semibold text-gray-700">{startDate}</span> إلى <span className="font-semibold text-gray-700">{endDate}</span></span>
              <button type="button" onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-red-400 hover:text-red-500 font-semibold transition-colors">
                إلغاء
              </button>
            </div>
          )}

          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
        </div>

        {days > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-4 border border-primary/10">
            <h3 className="font-bold text-sm text-gray-900 mb-3">ملخص التكلفة</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{asset.price_per_day} ﷼ × {days} يوم</span>
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
