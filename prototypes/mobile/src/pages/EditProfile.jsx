import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, User, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = "يرجى إدخال الاسم";
    if (!phone || phone.length < 9) errs.phone = "يرجى إدخال رقم جوال صحيح";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    login(phone, user?.role, name);
    showToast("تم حفظ التغييرات", "success");
    setTimeout(() => navigate("/profile", { replace: true }), 500);
  };

  return (
    <Layout title="تعديل البيانات" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" /> الاسم
          </label>
          <input type="text" value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => { const n = { ...p }; delete n.name; return n; }); }}
            className={`w-full p-3 border rounded-xl text-sm focus:outline-none transition-all ${
              errors.name ? "border-red-300 bg-red-50/50 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:border-primary"
            }`} />
          {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" /> رقم الجوال
          </label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 border border-gray-200 rounded-xl text-gray-500 bg-gray-50 text-sm shrink-0">+966</span>
            <input type="tel" value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); if (errors.phone) setErrors(p => { const n = { ...p }; delete n.phone; return n; }); }}
              className={`w-full p-3 border rounded-xl text-sm focus:outline-none transition-all ${
                errors.phone ? "border-red-300 bg-red-50/50 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:border-primary"
              }`} />
          {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
          </div>
        </div>
        <button type="submit"
          className="w-full bg-primary text-white font-bold py-3 btn-pill hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> حفظ التغييرات
        </button>
      </form>
    </Layout>
  );
}
