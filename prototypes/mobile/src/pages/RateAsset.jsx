import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Send, AlertCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";
import { bookings } from "../data/mock";

export default function RateAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find(b => b.id === Number(id));
  const { showToast } = useToast();
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  if (!booking) {
    return (
      <Layout title="" onBack={() => navigate(-1)}>
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <AlertCircle className="w-12 h-12 mb-3 opacity-40" />
          <p className="font-bold text-gray-400">الحجز غير موجود</p>
        </div>
      </Layout>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    showToast("شكراً على تقييمك! تقييمك يساعد في تحسين الخدمة", "success");
    setTimeout(() => navigate("/rental-history", { replace: true }), 800);
  };

  return (
    <Layout title="تقييم الأصل" onBack={() => navigate(-1)}>
      <div className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100/80 shadow-sm mb-6">
        <img src={booking.assetImage} alt={booking.assetTitle}
          className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
        <div>
          <p className="font-bold text-sm text-gray-900">{booking.assetTitle}</p>
          <p className="text-xs text-gray-400">{booking.startDate} → {booking.endDate}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100/80 shadow-sm text-center">
          <p className="font-bold text-sm text-gray-900 mb-3">تقييمك للأصل</p>
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setScore(s)}
                className="p-1 transition-all hover:scale-110 active:scale-90">
                <Star className={`w-8 h-8 transition-colors ${s <= score ? "fill-amber-400 text-amber-400" : "text-gray-200 hover:text-amber-300"}`} />
              </button>
            ))}
          </div>
          {score > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {score <= 2 ? "سيء" : score === 3 ? "مقبول" : score === 4 ? "جيد" : "ممتاز"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">تعليق (اختياري)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder={"شارك تجربتك مع هذا الأصل..."}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-colors resize-none bg-gray-50/50" />
        </div>

        <button type="submit" disabled={score === 0}
          className="w-full bg-primary text-white font-bold py-3 btn-pill transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> إرسال التقييم
        </button>
      </form>
    </Layout>
  );
}
