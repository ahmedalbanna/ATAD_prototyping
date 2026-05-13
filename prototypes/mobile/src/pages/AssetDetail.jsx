import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, User, Calendar, Check, FileText, Phone } from "lucide-react";
import Layout from "../components/Layout";
import { assets } from "../data/mock";

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = assets.find(a => a.id === Number(id));

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
      {/* Image with curved bottom and decorative overlay */}
      <div className="-mx-4 -mt-4 relative overflow-hidden">
        <img src={asset.image} alt={asset.title}
          className="w-full aspect-[16/9] object-cover scale-110 animate-scale-in" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Category badge */}
        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full text-gray-700 shadow-lg">
          {asset.category}
        </span>

        {/* Rating badge */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {asset.rating}
        </span>

        {/* Floating decorative dots */}
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full animate-float" />
      </div>

      {/* Content overlay card */}
      <div className="relative -mt-8 bg-white rounded-t-3xl p-5 space-y-5 shadow-xl shadow-black/5">
        {/* Title & location */}
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.city}</span>
            <span className="text-gray-200">•</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {asset.ownerName}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">{asset.title}</h1>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent rounded-2xl p-4 animate-scale-in stagger-1">
          <span className="text-4xl font-black text-primary">{asset.pricePerDay}</span>
          <span className="text-gray-400 text-sm font-medium">﷼ / اليوم</span>
        </div>

        {/* Description */}
        <div className="animate-slide-up stagger-2">
          <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            الوصف
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">{asset.description}</p>
        </div>

        {/* Terms */}
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
            <div className="relative">
              <input type="checkbox" className="accent-primary w-4 h-4 rounded border-gray-300 peer" />
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
              أوافق على الشروط والأحكام
            </span>
          </label>
        </div>

        {/* Contact lessor */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900">صاحب الأصل</p>
            <p className="text-[10px] text-gray-400">{asset.ownerName}</p>
          </div>
          <button className="text-xs bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
            اتصل
          </button>
        </div>

        {/* CTA */}
        <button onClick={() => navigate(`/book/${asset.id}`)}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 btn-pill transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          طلب تأجير
        </button>
      </div>
    </Layout>
  );
}
