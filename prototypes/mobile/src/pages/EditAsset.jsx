import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImagePlus, Tag, FileText, MapPin, ListTree, Save, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";
import { assets, categories } from "../data/mock";

export default function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = assets.find(a => a.id === Number(id));

  const [form, setForm] = useState({
    title: asset?.title || "",
    description: asset?.description || "",
    pricePerDay: asset?.pricePerDay?.toString() || "",
    city: asset?.city || "",
    category: asset?.category || categories[1],
  });

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const handleSubmit = (e) => { e.preventDefault(); navigate("/lessor-dashboard"); };

  const assetStatuses = [
    { value: "available", label: "متاح" },
    { value: "rented", label: "مؤجر" },
    { value: "maintenance", label: "صيانة" },
  ];
  const [status, setStatus] = useState(asset?.status || "available");

  if (!asset) {
    return (
      <Layout title="غير موجود" onBack={() => navigate(-1)}>
        <div className="text-center py-20 text-gray-300">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-gray-400">الأصل غير موجود</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="تعديل الأصل" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm">
          <img src={asset.image} alt={asset.title}
            className="w-full aspect-[16/9] object-cover bg-gray-100" />
          <div className="p-4 border-t border-gray-100">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 cursor-pointer hover:border-primary/40 transition-all group">
              <ImagePlus className="w-6 h-6 mx-auto mb-1 group-hover:text-primary transition-colors" />
              <p className="text-xs">تغيير الصورة</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> عنوان الأصل
            </label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> الوصف
            </label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">السعر / اليوم</label>
              <input type="number" value={form.pricePerDay} onChange={e => update("pricePerDay", e.target.value)}
                min={0}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> المدينة
              </label>
              <input type="text" value={form.city} onChange={e => update("city", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <ListTree className="w-3.5 h-3.5 text-primary" /> التصنيف
            </label>
            <select value={form.category} onChange={e => update("category", e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm appearance-none">
              {categories.filter(c => c !== "الكل").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">حالة الأصل</label>
            <div className="flex gap-2">
              {assetStatuses.map(s => (
                <button key={s.value} type="button" onClick={() => setStatus(s.value)}
                  className={`flex-1 p-2.5 rounded-xl text-xs font-semibold transition-all border-2 ${
                    status === s.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          حفظ التغييرات
        </button>
      </form>
    </Layout>
  );
}
