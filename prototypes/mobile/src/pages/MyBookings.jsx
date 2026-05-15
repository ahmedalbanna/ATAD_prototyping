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
  const { isLessor } = useAuth();
  const { asTenant, asLessor } = useBookings();
  const [activeTab, setActiveTab] = useState("all");

  const myBookings = isLessor ? asLessor : asTenant;

  const filtered = activeTab === "all"
    ? myBookings : myBookings.filter(b => b.status === activeTab);

  return (
    <Layout title="طلباتي">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-medium transition-all rounded-full ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "bg-white text-gray-500 border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300"
            }`}>
            {tab.label}
            {tab.key !== "all" && (
              <span className="mr-1.5 text-[10px] opacity-70">({myBookings.filter(b => b.status === tab.key).length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <ClipboardList className="w-7 h-7 text-primary/40" />
          </div>
          <p className="font-bold text-gray-400 text-sm">لا توجد طلبات</p>
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
