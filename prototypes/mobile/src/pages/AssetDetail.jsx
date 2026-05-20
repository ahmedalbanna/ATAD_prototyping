import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, User, Calendar, Check, FileText, Phone, ShieldCheck, AlertCircle } from "lucide-react";
import { api } from "../services/apiClient";
import Layout from "../components/Layout";
import { assetStatusLabels, assetStatusColors } from "../data/mock";
import { useAuth } from "../context/AuthContext";

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isVerified, isTenant } = useAuth();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/assets/${id}`).then(setAsset).catch(() => setAsset(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout title="" onBack={() => navigate(-1)}><div className="text-center py-20 text-gray-300 shimmer rounded-2xl h-64" /></Layout>;

  if (!asset) {
    return (
      <Layout title="" onBack={() => navigate(-1)}>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-300 px-6">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <p className="font-bold text-gray-400 text-lg">الأصل غير موجود</p>
        </div>
      </Layout>
    );
  }

  const terms = [
    "يتم دفع قيمة التأجير كاملة قبل الاستلام",
    "المستأجر مسؤول عن أي تلفيات تحدث للأصل",
    "مدة التأجير تبدأ من تاريخ الاستلام",
    "يتم إعادة الأصل بنفس الحالة عند الاستلام",
  ];

  return (
    <Layout title="" onBack={() => navigate(-1)}>
      <div className="-mx-4 -mt-4 relative overflow-hidden">
        <img src={asset.image_url} alt={asset.title}
          className="w-full aspect-[16/9] object-cover scale-110 animate-scale-in" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full text-gray-700 shadow-lg">
          {asset.category}
        </span>
        {asset.rating > 0 && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {asset.rating}
          </span>
        )}
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full animate-float" />
      </div>

      <div className="relative -mt-8 bg-white rounded-t-3xl p-5 space-y-5 shadow-xl shadow-black/5">
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.city}</span>
            <span className="text-gray-200">•</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {asset.owner?.name}</span>
            <span className="trust-badge">
              <ShieldCheck className="w-2.5 h-2.5" /> موثّق
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">{asset.title}</h1>
          <span className={`status-badge-lg mt-2 ${assetStatusColors[asset.status] || assetStatusColors.available}`}>
            {assetStatusLabels[asset.status] || "متاح"}
          </span>
        </div>

        <div className="bg-gradient-to-r from-primary/[0.07] via-primary/[0.02] to-transparent rounded-2xl p-4 animate-scale-in stagger-1 border border-primary/10">
          <span className="text-[10px] text-gray-400 font-medium block mb-1">السعر ليوم واحد</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-black text-primary tracking-tight">{asset.price_per_day}</span>
            <span className="text-gray-400 text-sm font-medium">﷼</span>
          </div>
        </div>

        <div className="animate-slide-up stagger-2">
          <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            الوصف
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">{asset.description}</p>
        </div>

        <div className="bg-gradient-to-br from-primary/[0.04] to-transparent rounded-2xl p-5 border border-primary/10 animate-slide-up stagger-3">
          <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> شروط التأجير
          </h3>
          <ul className="space-y-3">
            {terms.map((term, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500">
                <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </span>
                {term}
              </li>
            ))}
          </ul>
          <label className="flex items-center gap-2.5 mt-4 pt-3 border-t border-primary/10 cursor-pointer group transition-all">
            <input type="checkbox" className="accent-primary w-4 h-4 rounded border-gray-300 peer" />
            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">أوافق على الشروط والأحكام</span>
          </label>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900">صاحب الأصل</p>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-gray-400">{asset.owner?.name}</p>
              <span className="trust-badge">
                <ShieldCheck className="w-2 h-2" /> موثّق
              </span>
            </div>
          </div>
          <button className="text-xs bg-primary/10 text-primary font-semibold px-3 py-1.5 btn-pill hover:bg-primary/20 transition-colors">
            اتصل
          </button>
        </div>

        {asset.status === "available" ? (
          <>
            {isTenant && !isVerified ? (
              <div className="space-y-2">
                <button onClick={() => navigate("/verification")}
                  className="w-full bg-amber-500 text-white font-bold py-4 btn-pill transition-all hover:bg-amber-600 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                  <ShieldCheck className="w-5 h-5" />
                  وثّق حسابك أولاً للتأجير
                </button>
                <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  يجب توثيق الحساب قبل استئجار الأصول
                </p>
              </div>
            ) : (
              <button onClick={() => navigate(`/book/${asset.id}`)}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 btn-pill transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                طلب تأجير
              </button>
            )}
          </>
        ) : (
          <button disabled
            className="w-full bg-gray-300 text-white font-bold py-4 btn-pill flex items-center justify-center gap-2 cursor-not-allowed">
            غير متاح للتأجير
          </button>
        )}
      </div>
    </Layout>
  );
}
