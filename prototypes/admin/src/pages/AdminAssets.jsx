import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Package, MapPin, DollarSign, Calendar, Eye, Layers, BarChart3, CheckCircle, AlertCircle, Wrench, Plus, X, Loader, User, Image } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/apiClient";

const statusLabels = { available: "متاح", rented: "مؤجر", maintenance: "صيانة" };
const statusColors = {
  available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rented: "bg-primary/10 text-primary ring-1 ring-primary/30",
  maintenance: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

function CreateAssetModal({ onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("available");
  const [ownerId, setOwnerId] = useState("");
  const [lessors, setLessors] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    api.get("/admin/users").then(users => {
      setLessors(users.filter(u => u.role === "lessor"));
    }).catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يتجاوز 5 ميجابايت");
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width < 400 || img.height < 300) {
        setError(`الصورة صغيرة جداً. الحد الأدنى 400×300 بكسل (حجمها ${img.width}×${img.height})`);
        URL.revokeObjectURL(objectUrl);
        return;
      }
      URL.revokeObjectURL(objectUrl);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    };
    img.onerror = () => {
      setError("تعذر فتح الصورة. يرجى اختيار صورة صالحة");
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;
    const API_HOST = (import.meta.env.VITE_API_URL || "http://185.190.140.93:3001/api/v1").replace("/api/v1", "");
    const token = localStorage.getItem("atad_admin_token");
    const formData = new FormData();
    formData.append("image", selectedFile);
    const res = await fetch(`${API_HOST}/api/v1/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "فشل رفع الصورة");
    return `${API_HOST}${json.data.url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price || !city.trim() || !ownerId) {
      setError("العنوان والسعر والمدينة والمالك مطلوبون");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const imageUrl = await uploadImage();
      await api.post("/admin/assets", {
        title, category, price_per_day: parseFloat(price), city, description, status, owner_id: ownerId,
        ...(imageUrl && { image_url: imageUrl }),
      });
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
          <h3 className="font-bold text-gray-900">إضافة أصل جديد</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-all hover:rotate-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 border border-red-100">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">المالك (المؤجر)</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <select value={ownerId} onChange={e => setOwnerId(e.target.value)}
                className="w-full pr-10 pl-3 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all appearance-none bg-white">
                <option value="">اختر المالك...</option>
                {lessors.map(l => (
                  <option key={l.id} value={l.id}>{l.name} — {l.phone}</option>
                ))}
              </select>
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">صورة الأصل</label>
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
              {preview ? (
                <img src={preview} alt="معاينة" className="max-h-32 mx-auto rounded-lg" />
              ) : (
                <div className="text-gray-400">
                  <Image className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-xs">اضغط لاختيار صورة</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الحالة</label>
            <div className="grid grid-cols-3 gap-2">
              {["available", "rented", "maintenance"].map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`p-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    status === s ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader className="w-4 h-4 animate-spin" />}
            إضافة الأصل
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminAssets() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => { api.get("/admin/assets").then(setAssets).catch(() => {}); }, []);

  const filtered = assets
    .filter(a => filterStatus === "all" || a.status === filterStatus)
    .filter(a => a.title.includes(search) || a.owner_name?.includes(search) || a.city.includes(search) || (a.category || "").includes(search));

  const statsCards = [
    { label: "إجمالي الأصول", value: assets.length, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "متاح", value: assets.filter(a => a.status === "available").length, icon: CheckCircle, color: "bg-accent/10 text-accent" },
    { label: "مؤجر", value: assets.filter(a => a.status === "rented").length, icon: BarChart3, color: "bg-primary-dark/10 text-primary-dark" },
    { label: "صيانة", value: assets.filter(a => a.status === "maintenance").length, icon: Wrench, color: "bg-red-50 text-red-600" },
  ];

  return (
    <AdminLayout title="الأصول">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statsCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100/80 p-3 flex items-center gap-3 shadow-sm animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم الأصل أو المالك أو المدينة..."
              className="w-full pr-9 pl-3 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "available", "rented", "maintenance"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterStatus === s ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-500 border border-gray-200/80 hover:border-gray-300"
                }`}>
                {s === "all" ? "الكل" : statusLabels[s]}
              </button>
            ))}
          </div>
          <button onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all active:scale-[0.97] shrink-0">
            <Plus className="w-3.5 h-3.5" /> إضافة أصل
          </button>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{filtered.length} أصل</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-xs">
                <th className="text-right p-3 font-semibold">#</th>
                <th className="text-right p-3 font-semibold"><Package className="w-3 h-3 inline ml-1" />الأصل</th>
                <th className="text-right p-3 font-semibold">المالك</th>
                <th className="text-right p-3 font-semibold"><Layers className="w-3 h-3 inline ml-1" />التصنيف</th>
                <th className="text-right p-3 font-semibold"><DollarSign className="w-3 h-3 inline ml-1" />السعر/يوم</th>
                <th className="text-right p-3 font-semibold"><MapPin className="w-3 h-3 inline ml-1" />المدينة</th>
                <th className="text-right p-3 font-semibold">الحالة</th>
                <th className="text-right p-3 font-semibold"><Calendar className="w-3 h-3 inline ml-1" />تاريخ الإضافة</th>
                <th className="text-center p-3 font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset, idx) => (
                <tr key={asset.id} onClick={() => navigate(`/admin/asset/${asset.id}`)}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="p-3 text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="p-3">
                    <Link to={`/admin/asset/${asset.id}`} onClick={e => e.stopPropagation()}
                      className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {asset.title}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-500">{asset.owner_name}</td>
                  <td className="p-3 text-gray-400 text-xs">{asset.category || "—"}</td>
                  <td className="p-3 font-semibold text-gray-900 whitespace-nowrap">{asset.price_per_day} ﷼</td>
                  <td className="p-3 text-gray-400">{asset.city}</td>
                  <td className="p-3">
                    <span className={`badge ${statusColors[asset.status]}`}>
                      {statusLabels[asset.status]}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 text-xs">{asset.created_at?.slice(0, 10)}</td>
                  <td className="p-3 text-center">
                    <Eye className="w-3.5 h-3.5 inline text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-300">
            <Package className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-gray-400">لا توجد أصول</p>
          </div>
        )}
      </div>

      {createOpen && (
        <CreateAssetModal onClose={() => setCreateOpen(false)} onSaved={() => { setCreateOpen(false); api.get("/admin/assets").then(setAssets).catch(() => {}); }} />
      )}
    </AdminLayout>
  );
}
