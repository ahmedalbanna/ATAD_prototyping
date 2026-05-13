import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Star } from "lucide-react";
import { useBookings } from "../context/BookingContext";
import Layout from "../components/Layout";
import { statusLabels, statusColors, ratings } from "../data/mock";

export default function RentalHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const { bookings } = useBookings();
  const history = bookings.filter(b => ["completed", "expired", "rejected"].includes(b.status));

  const filtered = filter === "all" ? history : history.filter(b => b.status === filter);

  const getRating = (bookingId) => ratings.find(r => r.bookingId === bookingId);

  return (
    <Layout title="سجل التأجير" onBack={() => navigate(-1)}>
      <div className="flex gap-1.5 mb-4">
        {[
          { key: "all", label: "الكل" },
          { key: "completed", label: "مكتمل" },
          { key: "rejected", label: "مرفوض" },
          { key: "expired", label: "منتهي" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-all tab-underline ${
              filter === f.key ? "tab-active text-gray-900" : "text-gray-500"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <Clock className="w-12 h-12 mb-3 opacity-40" />
          <p className="font-medium text-gray-400 text-sm">لا يوجد سابق تأجير</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(b => {
            const rating = getRating(b.id);
            return (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100/80 p-3 shadow-sm">
                <div className="flex gap-2.5">
                  <img src={b.assetImage} alt={b.assetTitle}
                    className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{b.assetTitle}</p>
                    <p className="text-xs text-gray-400">{b.startDate} → {b.endDate}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-primary text-sm">{b.totalPrice} ﷼</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {b.status === "completed" && (
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    {rating ? (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= rating.score ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <span className="text-gray-400">{rating.comment}</span>
                      </div>
                    ) : (
                      <button onClick={() => navigate(`/rate/${b.id}`)}
                        className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                        <Star className="w-3 h-3" /> قيّم هذا الأصل
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
