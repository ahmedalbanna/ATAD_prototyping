import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import BookingCard from "../components/BookingCard";
import { bookings, statusLabels } from "../data/mock";

const tabs = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "approved", label: "تمت الموافقة" },
  { key: "active", label: "نشط" },
  { key: "completed", label: "مكتملة" },
];

export default function MyBookings() {
  const { user, isLessor } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const myBookings = isLessor
    ? bookings.filter(b => b.tenantId !== user?.id)
    : bookings.filter(b => b.tenantId === user?.id || b.tenantId === 1);

  const filtered = activeTab === "all"
    ? myBookings : myBookings.filter(b => b.status === activeTab);

  return (
    <Layout title="طلباتي">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200/80 hover:border-gray-300"
            }`}>
            {tab.label}
            {tab.key !== "all" && (
              <span className="mr-1.5 text-[10px] opacity-60">({myBookings.filter(b => b.status === tab.key).length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-300">
          <ClipboardList className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="font-medium text-gray-400">لا توجد طلبات</p>
          <p className="text-xs text-gray-300 mt-1">ستظهر طلبات التأجير هنا</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </Layout>
  );
}
