import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Tag, FileText, MapPin, ListTree } from "lucide-react";
import Layout from "../components/Layout";
import { categories } from "../data/mock";

export default function AddAsset() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", pricePerDay: "",
    city: "", category: categories[1],
  });

  const handleSubmit = (e) => { e.preventDefault(); navigate("/lessor-dashboard"); };
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <Layout title="إضافة أصل" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80">
          <label className="block text-sm font-semibold text-gray-700 mb-3">صورة الأصل</label>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all group">
            <ImagePlus className="w-10 h-10 mx-auto mb-2 group-hover:text-primary transition-colors" />
            <p className="text-sm font-medium group-hover:text-gray-500 transition-colors">اضغط لإضافة صورة</p>
            <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP</p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> عنوان الأصل
            </label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)}
              placeholder="مثال: حفار صغير"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> الوصف
            </label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)}
              placeholder="وصف مفصل للأصل..." rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">السعر / اليوم</label>
              <input type="number" value={form.pricePerDay} onChange={e => update("pricePerDay", e.target.value)}
                placeholder="0" min={0}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all bg-gray-50/50 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> المدينة
              </label>
              <input type="text" value={form.city} onChange={e => update("city", e.target.value)}
                placeholder="صنعاء"
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
        </div>

        <button type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-2">
          <ImagePlus className="w-5 h-5" />
          إضافة الأصل
        </button>
      </form>
    </Layout>
  );
}
