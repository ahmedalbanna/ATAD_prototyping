import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import Layout from "../components/Layout";
import BookingCard from "../components/BookingCard";

const tabs = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "approved", label: "تمت الموافقة" },
  { key: "active", label: "نشط" },
  { key: "completed", label: "مكتملة" },
];

export default function MyBookings() {
  const { user, isLessor } = useAuth();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState("all");

  const myBookings = isLessor
    ? bookings
    : bookings.filter(b => b.tenantId === user?.id || b.tenantId === 1);

  const filtered = activeTab === "all"
    ? myBookings : myBookings.filter(b => b.status === activeTab);

  return (
    <Layout title="طلباتي">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all tab-underline ${
              activeTab === tab.key ? "tab-active text-gray-900" : "text-gray-500"
            }`}>
            {tab.label}
            {tab.key !== "all" && (
              <span className="mr-1.5 text-[10px] opacity-60">({myBookings.filter(b => b.status === tab.key).length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <ClipboardList className="w-12 h-12 mb-3 opacity-40" />
          <p className="font-medium text-gray-400 text-sm">لا توجد طلبات</p>
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
