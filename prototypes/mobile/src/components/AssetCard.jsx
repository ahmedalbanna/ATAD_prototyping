import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { assetStatusLabels, assetStatusColors } from "../data/mock";

export default function AssetCard({ asset }) {
  return (
    <Link to={`/asset/${asset.id}`}
      className="block card card-hover overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden rounded-t-[20px]">
        <img src={asset.image_url} alt={asset.title}
          className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-2 right-2 bg-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
          {asset.category}
        </span>
        <span className={`absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-sm ${assetStatusColors[asset.status] || assetStatusColors.available}`}>
          {assetStatusLabels[asset.status] || "متاح"}
        </span>
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug truncate">{asset.title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.city}</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {asset.rating}</span>
        </div>
        <div className="divider-warm" />
        <div className="flex items-center justify-between pt-1.5">
          <span className="text-primary font-bold text-lg tracking-tight">
            {asset.price_per_day} <span className="text-xs font-medium text-gray-400">﷼/يوم</span>
          </span>
          <span className="text-[10px] text-gray-400">{asset.owner?.name}</span>
        </div>
      </div>
    </Link>
  );
}
