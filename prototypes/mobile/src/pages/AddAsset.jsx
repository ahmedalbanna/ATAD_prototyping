import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Tag, FileText, MapPin, ListTree } from "lucide-react";
import Layout from "../components/Layout";
import { api } from "../services/apiClient";
import { useToast } from "../context/ToastContext";
import { categories } from "../data/mock";

const BASE_URL = import.meta.env.VITE_API_URL || "http://185.190.140.93:3001/api/v1";
const API_HOST = BASE_URL.replace("/api/v1", "");

export default function AddAsset() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: "", description: "", pricePerDay: "",
    city: "", category: categories[1],
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "يرجى إدخال عنوان الأصل";
    if (!form.description.trim()) errs.description = "يرجى إدخال وصف الأصل";
    if (!form.pricePerDay || Number(form.pricePerDay) <= 0) errs.pricePerDay = "يرجى إدخال سعر صحيح";
    if (!form.city.trim()) errs.city = "يرجى اختيار المدينة";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      let imageUrl = "";

      if (selectedFile) {
        const imgData = new FormData();
        imgData.append("image", selectedFile);
        const token = api.getToken();
        const res = await fetch(`${API_HOST}/api/v1/upload`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: imgData,
        });
        const imgJson = await res.json();
        if (imgJson.success) {
          imageUrl = `${API_HOST}${imgJson.data.url}`;
        }
      }

      await api.post("/assets", {
        title: form.title,
        description: form.description,
        price_per_day: Number(form.pricePerDay),
        city: form.city,
        category: form.category,
        image_url: imageUrl,
      });

      showToast("تم إضافة الأصل بنجاح", "success");
      navigate("/lessor-dashboard");
    } catch (err) {
      showToast(err.message || "فشل إضافة الأصل", "error");
    } finally {
      setSaving(false);
    }
  };

  const update = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    if (errors[f]) setErrors(p => { const n = { ...p }; delete n[f]; return n; });
  };

  return (
    <Layout title="إضافة أصل" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100/80">
          <label className="block text-sm font-semibold text-gray-700 mb-3">صورة الأصل</label>
          <input type="file" accept="image/*" ref={fileRef} className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onload = ev => setPreview(ev.target.result);
                reader.readAsDataURL(file);
              }
            }} />
          <div onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all group ${
              preview ? "border-primary/40 bg-primary/[0.02]" : "border-gray-200 hover:border-primary/40 hover:bg-primary/[0.02]"
            }`}>
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-xl object-contain" />
            ) : (
              <>
                <ImagePlus className="w-10 h-10 mx-auto mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium group-hover:text-gray-500 transition-colors">اضغط لإضافة صورة</p>
                <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100/80 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> عنوان الأصل
            </label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)}
              placeholder="مثال: حفار صغير"
              className={`w-full p-3 border rounded-xl focus:outline-none transition-all text-sm ${
                errors.title ? "border-red-300 bg-red-50/50 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:border-primary"
              }`} />
            {errors.title && <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> الوصف
            </label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)}
              placeholder="وصف مفصل للأصل..." rows={3}
              className={`w-full p-3 border rounded-xl focus:outline-none transition-all text-sm resize-none ${
                errors.description ? "border-red-300 bg-red-50/50 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:border-primary"
              }`} />
            {errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">السعر / اليوم</label>
              <input type="number" value={form.pricePerDay} onChange={e => update("pricePerDay", e.target.value)}
                placeholder="0" min={0}
                className={`w-full p-3 border rounded-xl focus:outline-none transition-all text-sm ${
                  errors.pricePerDay ? "border-red-300 bg-red-50/50 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:border-primary"
                }`} />
              {errors.pricePerDay && <p className="text-xs text-red-500 mt-1.5">{errors.pricePerDay}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> المدينة
              </label>
              <input type="text" value={form.city} onChange={e => update("city", e.target.value)}
                placeholder="الرياض"
                className={`w-full p-3 border rounded-xl focus:outline-none transition-all text-sm ${
                  errors.city ? "border-red-300 bg-red-50/50 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:border-primary"
                }`} />
              {errors.city && <p className="text-xs text-red-500 mt-1.5">{errors.city}</p>}
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

        {Object.keys(errors).length > 0 && (
          <p className="text-xs text-red-500 text-center">يرجى تصحيح الحقول المظللة باللون الأحمر</p>
        )}
        <button type="submit" disabled={saving}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <ImagePlus className="w-5 h-5" />
          {saving ? "جاري الإضافة..." : "إضافة الأصل"}
        </button>
      </form>
    </Layout>
  );
}
