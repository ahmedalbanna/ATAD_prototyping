import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ChevronLeft } from "lucide-react";
import Layout from "../components/Layout";
import { notifications } from "../data/mock";

const typeIcons = {
  booking_status: "📋",
  payment: "💰",
  system: "⚙️",
};

export default function Notifications() {
  const navigate = useNavigate();
  const [list, setList] = useState(notifications);
  const unread = list.filter(n => !n.read).length;

  const markAllRead = () => setList(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <Layout title="الإشعارات" onBack={() => navigate(-1)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {unread > 0 ? `${unread} إشعارات غير مقروءة` : "جميع الإشعارات مقروءة"}
        </p>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
            <CheckCheck className="w-3.5 h-3.5" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="text-center py-20 text-gray-300">
          <Bell className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="font-medium text-gray-400">لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(n => (
            <div key={n.id}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-sm ${
                n.read ? "border-gray-100/80" : "border-primary/20 bg-primary/[0.02]"
              }`}>
              <div className="flex gap-3">
                <span className="text-xl mt-0.5">{typeIcons[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${n.read ? "text-gray-900" : "text-gray-900 font-bold"}`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-300 mt-2">{n.createdAt.slice(0, 10)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
