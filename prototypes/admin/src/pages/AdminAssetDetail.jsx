import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Package, MapPin, User, DollarSign, CalendarDays, ArrowRight, Edit3, Trash2, Phone, Layers, Tag, TrendingUp, X, Check, Loader, CreditCard, BarChart3 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import { api } from "../services/apiClient";
import { statusLabels, statusColors } from "../data/mock";

const assetStatusLabels = { available: "متاح", rented: "مؤجر", maintenance: "صيانة" };
const assetStatusColors = {
  available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rented: "bg-primary/10 text-primary ring-1 ring-primary/30",
  maintenance: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

function EditAssetModal({ asset, onClose, onSaved }) {
  const [title, setTitle] = useState(asset?.title || "");
  const [category, setCategory] = useState(asset?.category || "");
  const [price, setPrice] = useState(asset?.price_per_day || "");
  const [city, setCity] = useState(asset?.city || "");
  const [description, setDescription] = useState(asset?.description || "");
  const [status, setStatus] = useState(asset?.status || "available");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price || !city.trim()) {
      setError("العنوان والسعر والمدينة مطلوبون");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.put(`/admin/assets/${asset.id}`, { title, category, price_per_day: parseFloat(price), city, description, status });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">تعديل الأصل</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-all hover:rotate-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 border border-red-100">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">العنوان</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">السعر/يوم (﷼)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">المدينة</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">التصنيف</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الوصف</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الحالة</label>
            <div className="grid grid-cols-3 gap-2">
              {["available", "rented", "maintenance"].map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`p-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    status === s ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  {assetStatusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader className="w-4 h-4 animate-spin" />}
            حفظ التغييرات
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminAssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchData = () => {
    api.get(`/admin/assets/${id}`).then(setData).catch(() => setData(null));
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/assets/${id}`);
      navigate("/admin/assets");
    } catch {}
  };

  if (!data) return <AdminLayout title="الأصل"><div className="text-center py-20 text-gray-400">الأصل غير موجود</div></AdminLayout>;

  const { image_url, title, city, owner_name, owner_phone, owner_id, price_per_day, status, description, category, bookings, revenue, booking_stats, created_at } = data;
  const totalBookings = bookings?.length || 0;

  return (
    <AdminLayout title={title}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate("/admin/assets")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowRight className="w-4 h-4" /> عودة للأصول
        </button>
        <div className="flex gap-1">
          <button onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all">
            <Edit3 className="w-3.5 h-3.5" /> تعديل
          </button>
          <button onClick={() => setShowDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-all">
            <Trash2 className="w-3.5 h-3.5" /> حذف
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {image_url && <img src={image_url} alt={title} className="w-full aspect-[16/10] object-cover" />}
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {city}</span>
                {category && <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {category}</span>}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-2xl font-black text-primary">{price_per_day} <span className="text-sm font-medium text-gray-400">﷼/يوم</span></span>
                <span className={`badge ${assetStatusColors[status]}`}>
                  {assetStatusLabels[status]}
                </span>
              </div>
            </div>
          </div>

          {description && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-2">الوصف</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">معلومات المالك</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent text-sm">
                {owner_name?.[0]}
              </div>
              <div>
                <Link to={`/admin/user/${owner_id}`} className="font-semibold text-gray-900 text-sm hover:text-primary transition-colors">
                  {owner_name}
                </Link>
                {owner_phone && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5" dir="ltr">
                    <Phone className="w-3 h-3" /> {owner_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">إحصائيات</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">إجمالي الحجوزات</span>
                <span className="font-bold">{totalBookings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">إجمالي الإيرادات</span>
                <span className="font-bold text-primary">{revenue} ﷼</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">تاريخ الإضافة</span>
                <span className="text-gray-900 text-xs">{created_at?.slice(0, 10)}</span>
              </div>
              {booking_stats?.map(s => (
                <div key={s.status} className="flex justify-between text-sm">
                  <span className="text-gray-400 text-xs">{statusLabels[s.status] || s.status}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-500">إجمالي الإيرادات</span>
              </div>
              <p className="text-xl font-black text-gray-900">{revenue} ﷼</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-500">إجمالي الحجوزات</span>
              </div>
              <p className="text-xl font-black text-gray-900">{totalBookings}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">حجوزات هذا الأصل</h3>
              <span className="text-xs text-gray-400">{totalBookings} حجز</span>
            </div>
            {!bookings || bookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">لا توجد حجوزات</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400 text-xs">
                      <th className="text-right p-3 font-semibold">المستأجر</th>
                      <th className="text-right p-3 font-semibold">المدة</th>
                      <th className="text-right p-3 font-semibold">المبلغ</th>
                      <th className="text-right p-3 font-semibold">الحالة</th>
                      <th className="text-center p-3 font-semibold">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} onClick={() => navigate(`/admin/booking/${b.id}`)}
                        className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                        <td className="p-3 font-medium text-gray-900">{b.tenant_name}</td>
                        <td className="p-3 text-gray-400 text-xs whitespace-nowrap">{b.start_date} → {b.end_date}</td>
                        <td className="p-3 font-semibold whitespace-nowrap">{b.total_price} ﷼</td>
                        <td className="p-3">
                          <span className={`badge ${statusColors[b.status]}`}>
                            {statusLabels[b.status]}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-xs text-gray-300">←</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog open={showDelete}
        title="حذف الأصل"
        message={`هل أنت متأكد من حذف "${title}"؟ سيتم حذف جميع الحجوزات والمدفوعات المرتبطة به.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        danger
        onConfirm={() => { setShowDelete(false); handleDelete(); }}
        onCancel={() => setShowDelete(false)} />

      {editOpen && (
        <EditAssetModal asset={data} onClose={() => setEditOpen(false)} onSaved={() => { setEditOpen(false); fetchData(); }} />
      )}
    </AdminLayout>
  );
}
