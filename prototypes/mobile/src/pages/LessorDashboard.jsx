import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ClipboardList, Package, Wallet, Search, Plus, Edit3, Trash2, CalendarDays, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBookings } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/apiClient";
import { useToast } from "../context/ToastContext";
import { assetStatusLabels, assetStatusColors, assets as mockAssets, normalizeAsset } from "../data/mock";
import Layout from "../components/Layout";
import BookingCard from "../components/BookingCard";
import ConfirmDialog from "../components/ConfirmDialog";

const tabs = [
  { key: "orders", label: "الطلبات", icon: ClipboardList },
  { key: "assets", label: "الأصول", icon: Package },
  { key: "earnings", label: "الأرباح", icon: Wallet },
];

function OrdersTab() {
  const { asLessor, updateStatus } = useBookings();
  const [bookingFilter, setBookingFilter] = useState("all");

  const pendingCount = asLessor.filter(b => b.status === "pending").length;

  const bookingStatuses = [
    { key: "all", label: "الكل", count: asLessor.length },
    { key: "pending", label: "قيد الانتظار", count: pendingCount },
    { key: "approved", label: "تمت الموافقة", count: asLessor.filter(b => b.status === "approved").length },
    { key: "active", label: "نشط", count: asLessor.filter(b => b.status === "active").length },
    { key: "completed", label: "مكتمل", count: asLessor.filter(b => b.status === "completed").length },
    { key: "rejected", label: "مرفوض", count: asLessor.filter(b => b.status === "rejected").length },
  ];

  const filteredBookings = bookingFilter === "all" ? asLessor : asLessor.filter(b => b.status === bookingFilter);

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {bookingStatuses.map(s => (
          <button key={s.key} onClick={() => setBookingFilter(s.key)}
            className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-medium transition-all rounded-full ${bookingFilter === s.key
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "bg-white text-gray-500 border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300"
              }`}>
            {s.label}
            <span className={`mr-1.5 ${bookingFilter === s.key ? "text-white/70" : "text-gray-400"}`}>({s.count})</span>
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <ClipboardList className="w-6 h-6 opacity-40" />
          </div>
          <p className="font-medium text-gray-400 text-sm">لا توجد طلبات</p>
          <p className="text-xs text-gray-300 mt-1">
            {bookingFilter === "all" ? "لم يتم تقديم أي طلبات على أصولك بعد" : "لا توجد طلبات بهذه الحالة"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} actions={
              booking.status === "pending" ? (
                <div className="flex gap-1.5 pt-1">
                  <button onClick={() => updateStatus(booking.id, "approved")}
                    className="flex-1 bg-gradient-to-l from-emerald-500 to-emerald-400 text-white text-xs font-bold py-2 btn-pill hover:shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1 active:scale-[0.97]">
                    <CheckCircle className="w-3.5 h-3.5" /> قبول
                  </button>
                  <button onClick={() => updateStatus(booking.id, "rejected")}
                    className="flex-1 bg-white text-red-600 text-xs font-bold py-2 btn-pill border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-1 active:scale-[0.97]">
                    <XCircle className="w-3.5 h-3.5" /> رفض
                  </button>
                </div>
              ) : booking.status === "active" ? (
                <div className="pt-1">
                  <div className="bg-gradient-to-l from-emerald-50 to-emerald-100/60 text-emerald-700 text-xs rounded-xl p-2.5 text-center font-medium border border-emerald-200/50 shadow-sm">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1.5 animate-pulse" />
                    تأجير نشط — ينتهي في {booking.end_date}
                  </div>
                </div>
              ) : booking.status === "approved" ? (
                <div className="pt-1">
                  <div className="bg-gradient-to-l from-blue-50 to-blue-100/60 text-blue-700 text-xs rounded-xl p-2.5 text-center font-medium border border-blue-200/50 shadow-sm">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full ml-1.5" />
                    تمت الموافقة — في انتظار الدفع
                  </div>
                </div>
              ) : null
            } />
          ))}
        </div>
      )}
    </div>
  );
}

function AssetsTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAssets = () => {
    if (user) {
      api.get(`/assets?owner_id=${user.id}`).then(data => {
        setAssets(data.data || data);
      }).catch(() => {
        setAssets(mockAssets.filter(a => String(a.ownerId) === String(user.id)).map(normalizeAsset));
      });
    }
  };

  useEffect(() => { fetchAssets(); }, [user]);

  const toggleStatus = async (assetId, newStatus) => {
    try {
      await api.patch(`/assets/${assetId}/status`, { status: newStatus });
      fetchAssets();
    } catch { }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/assets/${deleteTarget.id}`);
      showToast("تم حذف الأصل بنجاح", "success");
      setDeleteTarget(null);
      fetchAssets();
    } catch {
      showToast("فشل حذف الأصل", "error");
    }
  };

  const myAssets = assets
    .filter(a => filterStatus === "all" || a.status === filterStatus)
    .filter(a => a.title.includes(search) || a.city.includes(search));

  const statuses = [
    { key: "all", label: "الكل" },
    { key: "available", label: "متاح" },
    { key: "rented", label: "مؤجر" },
    { key: "maintenance", label: "صيانة" },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "متاح", value: assets.filter(a => a.status === "available").length, color: "from-emerald-50 to-emerald-100/50 text-emerald-700" },
          { label: "مؤجر", value: assets.filter(a => a.status === "rented").length, color: "from-amber-50 to-amber-100/50 text-amber-700" },
          { label: "صيانة", value: assets.filter(a => a.status === "maintenance").length, color: "from-red-50 to-red-100/50 text-red-700" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-3 text-center shadow-sm`}>
            <p className="text-lg font-black">{s.value}</p>
            <p className="text-[10px] font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-3">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث في أصولك..."
          className="w-full pr-9 pl-3 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {statuses.map(s => (
          <button key={s.key} onClick={() => setFilterStatus(s.key)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all tab-underline ${filterStatus === s.key ? "tab-active text-gray-900" : "text-gray-500"}`}>
            {s.label}
          </button>
        ))}
        <button onClick={() => navigate("/add-asset")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 hover:bg-primary/20 active:scale-[0.97] transition-all">
          <Plus className="w-3 h-3" /> إضافة
        </button>
      </div>

      {myAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Search className="w-6 h-6 opacity-40" />
          </div>
          <p className="font-medium text-gray-400 text-sm">لا توجد أصول</p>
          <button onClick={() => navigate("/add-asset")}
            className="mt-3 text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> إضافة أصل جديد
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {myAssets.map((asset, i) => (
            <div key={asset.id} className="bg-white rounded-xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex gap-3 p-3">
                <Link to={`/asset/${asset.id}`} className="shrink-0">
                  <img src={asset.image_url} alt={asset.title}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 ring-1 ring-gray-100" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/asset/${asset.id}`} className="font-bold text-sm text-gray-900 truncate block hover:text-primary transition-colors">
                    {asset.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{asset.price_per_day} ﷼/يوم • {asset.city}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${assetStatusColors[asset.status]}`}>
                      {assetStatusLabels[asset.status]}
                    </span>
                    <span className="text-[10px] text-gray-300">تصنيف: {asset.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex border-t border-gray-50 divide-x divide-gray-50">
                {[
                  { key: "available", label: "متاح", color: "text-emerald-600" },
                  { key: "maintenance", label: "صيانة", color: "text-red-500" },
                ].map(action => (
                  <button key={action.key} onClick={() => toggleStatus(asset.id, action.key)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium transition-all active:scale-[0.97] ${asset.status === action.key ? "bg-primary/5 text-primary" : "text-gray-400 hover:bg-gray-50"
                      }`}>
                    {action.label}
                  </button>
                ))}
                <Link to={`/edit-asset/${asset.id}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-gray-400 hover:bg-gray-50 transition-all">
                  <Edit3 className="w-3 h-3" />
                  تعديل
                </Link>
                <button onClick={() => setDeleteTarget(asset)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-red-400 hover:bg-red-50 transition-all active:scale-[0.97]">
                  <Trash2 className="w-3 h-3" />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget}
        title="حذف الأصل"
        message={deleteTarget ? `هل أنت متأكد من حذف "${deleteTarget.title}"؟` : ""}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

function EarningsTab() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    if (user) api.get(`/assets?owner_id=${user.id}`).then(() => {
    }).catch(() => { });
  }, [user]);

  const earned = transactions.filter(t => t.status === "completed");
  const pending = transactions.filter(t => t.status === "pending");
  const totalEarned = earned.reduce((sum, t) => sum + t.amount, 0);
  const totalPending = pending.reduce((sum, t) => sum + t.amount, 0);

  const filtered = period === "all" ? transactions : transactions.filter(t => t.status === period);

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
    <div>
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

      <div className="flex gap-1.5 mb-4">
        {periods.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-all tab-underline ${period === p.key ? "tab-active text-gray-900" : "text-gray-500"}`}>
            {p.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Wallet className="w-6 h-6 opacity-40" />
          </div>
          <p className="font-medium text-gray-400 text-sm">لا توجد معاملات</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute right-[17px] top-2 bottom-2 w-0.5 bg-gray-100 rounded-full" />
          <div className="space-y-3">
            {filtered.map((t, i) => (
              <div key={t.id} className="flex gap-3 pr-9 relative animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`absolute right-0 top-1 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${t.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                  {t.status === "completed" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="bg-white rounded-xl border border-gray-100/80 p-3 flex-1 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-gray-900">{t.asset_title}</p>
                    <span className="font-bold text-sm text-primary">{t.amount} ﷼</span>
                  </div>
                  <p className="text-xs text-gray-400">{t.tenant_name}</p>
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
    </div>
  );
}

export default function LessorDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  const tabComponents = { orders: OrdersTab, assets: AssetsTab, earnings: EarningsTab };
  const TabComponent = tabComponents[activeTab];

  return (
    <Layout title="لوحة التحكم">


      <div className="flex gap-1 mb-5 bg-gray-50 rounded-xl p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-lg transition-all ${activeTab === tab.key
                  ? "bg-white text-primary shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-700"
                }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <TabComponent />
    </Layout>
  );
}
