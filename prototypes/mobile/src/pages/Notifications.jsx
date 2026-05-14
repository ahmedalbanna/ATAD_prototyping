import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ClipboardList, Wallet, Settings } from "lucide-react";
import { useBookings } from "../context/BookingContext";
import Layout from "../components/Layout";

const typeIcons = {
  booking_status: ClipboardList,
  payment: Wallet,
  system: Settings,
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useBookings();

  return (
    <Layout title="الإشعارات" onBack={() => navigate(-1)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {unreadCount > 0 ? `${unreadCount} إشعارات غير مقروءة` : "جميع الإشعارات مقروءة"}
        </p>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
            <CheckCheck className="w-3.5 h-3.5" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300 animate-scale-in">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 opacity-40" />
          </div>
          <p className="font-medium text-gray-400">لا توجد إشعارات</p>
          <p className="text-xs text-gray-300 mt-1">سيتم إعلامك عند وجود مستجدات</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => {
            const Icon = typeIcons[n.type] || ClipboardList;
            return (
              <div key={n.id} onClick={() => { markNotificationRead(n.id); if (n.bookingId) navigate(`/booking/${n.bookingId}`); }}
                className={`bg-white rounded-2xl p-4 border transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] animate-slide-up ${
                  n.is_read ? "border-gray-100/80" : "border-primary/20 bg-gradient-to-r from-primary/[0.02] to-transparent"
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === "booking_status" ? "bg-blue-50" :
                    n.type === "payment" ? "bg-emerald-50" : "bg-gray-50"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${n.is_read ? "text-gray-900" : "text-gray-900 font-bold"}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5 animate-pulse-soft" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-300 mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      {(n.createdAt || "").slice(0, 10)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
