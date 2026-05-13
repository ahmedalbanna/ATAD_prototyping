import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, User, Calendar, Check, FileText } from "lucide-react";
import Layout from "../components/Layout";
import { assets } from "../data/mock";

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = assets.find(a => a.id === Number(id));

  if (!asset) {
    return (
      <Layout title="غير موجود" onBack={() => navigate(-1)}>
        <div className="text-center py-20 text-gray-300">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-gray-400">الأصل غير موجود</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" onBack={() => navigate(-1)}>
      <div className="-mx-4 -mt-4 relative">
        <img src={asset.image} alt={asset.title}
          className="w-full aspect-[16/9] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="relative -mt-8 bg-white rounded-t-3xl p-5 space-y-5">
        <div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            <span className="bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full">{asset.category}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.city}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {asset.rating}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">{asset.title}</h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> {asset.ownerName}
          </p>
        </div>

        <div className="flex items-baseline gap-1.5 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-4">
          <span className="text-4xl font-black text-primary">{asset.pricePerDay}</span>
          <span className="text-gray-400 text-sm font-medium">﷼ / اليوم</span>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> الوصف
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">{asset.description}</p>
        </div>

        {/* Terms */}
        <div className="bg-[oklch(0.47_0.2_32_/_0.04)] rounded-2xl p-5 border border-primary/10">
          <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> شروط التأجير
          </h3>
          <ul className="space-y-2">
            {[
              "يتم دفع قيمة التأجير كاملة قبل الاستلام",
              "المستأجر مسؤول عن أي تلفيات تحدث للأصل",
              "مدة التأجير تبدأ من تاريخ الاستلام",
              "يتم إعادة الأصل بنفس الحالة عند الاستلام",
            ].map((term, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                {term}
              </li>
            ))}
          </ul>
          <label className="flex items-center gap-2.5 mt-4 pt-3 border-t border-primary/10 cursor-pointer group">
            <input type="checkbox" className="accent-primary w-4 h-4 rounded border-gray-300" />
            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">أوافق على الشروط والأحكام</span>
          </label>
        </div>

        <button onClick={() => navigate(`/book/${asset.id}`)}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          طلب تأجير
        </button>
      </div>
    </Layout>
  );
}
