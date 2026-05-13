import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, TrendingUp, CalendarDays, Download, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { transactions } from "../data/mock";

export default function LessorEarnings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [period, setPeriod] = useState("all");

  const earned = transactions.filter(t => t.status === "completed");
  const pending = transactions.filter(t => t.status === "pending");
  const totalEarned = earned.reduce((sum, t) => sum + t.amount, 0);
  const totalPending = pending.reduce((sum, t) => sum + t.amount, 0);

  const filtered = period === "all" ? transactions
    : transactions.filter(t => t.status === period);

  const stats = [
    { label: "الإجمالي", value: `${totalEarned + totalPending} ﷼`, color: "from-primary/10 to-primary/5 text-primary", icon: Wallet },
    { label: "المحصل", value: `${totalEarned} ﷼`, color: "from-emerald-50 to-emerald-100/50 text-emerald-700", icon: CheckCircle },
    { label: "قيد الانتظار", value: `${totalPending} ﷼`, color: "from-amber-50 to-amber-100/50 text-amber-700", icon: Clock },
  ];

  const periods = [
    { key: "all", label: "الكل" },
    { key: "completed", label: "مكتمل" },
    { key: "pending", label: "معلق" },
  ];

  return (
    <Layout title="الأرباح" onBack={() => navigate("/lessor-dashboard")}>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-3 text-center shadow-sm animate-slide-up`} style={{ animationDelay: `${i * 0.06}s` }}>
              <Icon className="w-4 h-4 mx-auto mb-1 opacity-70" />
              <p className="font-black text-sm">{s.value}</p>
              <p className="text-[9px] font-medium opacity-70 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Period filter */}
      <div className="flex gap-1.5 mb-4">
        {periods.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-all tab-underline ${
              period === p.key ? "tab-active text-gray-900" : "text-gray-500"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Transactions timeline */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Wallet className="w-6 h-6 opacity-40" />
          </div>
          <p className="font-medium text-gray-400 text-sm">لا توجد معاملات</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute right-[17px] top-2 bottom-2 w-0.5 bg-gray-100 rounded-full" />

          <div className="space-y-3">
            {filtered.map((t, i) => (
              <div key={t.id} className="flex gap-3 pr-9 relative animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                {/* Timeline dot */}
                <div className={`absolute right-0 top-1 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                  t.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {t.status === "completed" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>

                <div className="bg-white rounded-xl border border-gray-100/80 p-3 flex-1 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-gray-900">{t.assetTitle}</p>
                    <span className="font-bold text-sm text-primary">{t.amount} ﷼</span>
                  </div>
                  <p className="text-xs text-gray-400">{t.tenantName}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-300">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {t.date}</span>
                    <span>•</span>
                    <span>{t.days} أيام</span>
                    <span>•</span>
                    <span className={t.status === "completed" ? "text-emerald-600" : "text-amber-600"}>
                      {t.status === "completed" ? "مكتمل" : "معلق"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
