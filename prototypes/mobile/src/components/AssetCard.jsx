import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

export default function AssetCard({ asset }) {
  return (
    <Link to={`/asset/${asset.id}`}
      className="group block bg-white rounded-2xl border border-gray-100/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.98]">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        <img src={asset.image} alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[11px] font-semibold px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
          {asset.category}
        </span>
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">{asset.title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {asset.city}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {asset.rating}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <span className="text-primary font-bold text-lg tracking-tight">
            {asset.pricePerDay} <span className="text-xs font-medium text-gray-400">﷼/يوم</span>
          </span>
          <span className="text-[11px] text-gray-400">{asset.ownerName}</span>
        </div>
      </div>
    </Link>
  );
}
