import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Check, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";
import { assets } from "../data/mock";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = assets.find(a => a.id === Number(id));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agree, setAgree] = useState(false);

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

  return (
    <Layout title="طلب تأجير" onBack={() => navigate(-1)}>
      {/* Asset summary */}
      <div className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-100/80 shadow-sm mb-6">
        <img src={asset.image} alt={asset.title}
          className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0 ring-1 ring-gray-100" />
        <div className="min-w-0">
          <h2 className="font-bold text-gray-900 text-sm truncate">{asset.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{asset.city}</p>
          <p className="text-primary font-bold text-sm mt-1">{asset.pricePerDay} ﷼ / يوم</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Date selection */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> تحديد المدة
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">تاريخ البداية</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all text-sm bg-gray-50/50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">تاريخ النهاية</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all text-sm bg-gray-50/50" />
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        {days > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-4 border border-primary/10">
            <h3 className="font-bold text-sm text-gray-900 mb-3">ملخص التكلفة</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>سعر اليوم × {days} أيام</span>
                <span>{asset.pricePerDay} × {days}</span>
              </div>
              <div className="border-t border-primary/10 pt-2 flex justify-between font-bold text-gray-900">
                <span>الإجمالي</span>
                <span className="text-primary text-lg">{total} ﷼</span>
              </div>
            </div>
          </div>
        )}

        {/* Agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
            className="mt-0.5 accent-primary w-4 h-4 rounded border-gray-300" />
          <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
            أقر بأنني اطلعت على شروط التأجير وأوافق عليها، وأتحمل مسؤولية أي تلفيات قد تحدث للأصل خلال فترة التأجير.
          </span>
        </label>

        <button disabled={!startDate || !endDate || days <= 0 || !agree}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          تقديم الطلب
        </button>
      </div>
    </Layout>
  );
}
