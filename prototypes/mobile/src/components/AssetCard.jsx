import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ImageOff } from "lucide-react";
import { assetStatusLabels, assetStatusColors } from "../data/mock";

export default function AssetCard({ asset }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/asset/${asset.id}`}
      className="block card card-hover overflow-hidden">
      <div className="aspect-[4/3] image-frame rounded-t-[20px]">
        {imgError || !asset.image_url ? (
          <div className="image-fallback w-full h-full">
            <ImageOff className="w-6 h-6 opacity-40" />
            <span>لا توجد صورة</span>
          </div>
        ) : (
          <img src={asset.image_url} alt={asset.title} loading="lazy"
            onError={() => setImgError(true)} />
        )}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[11px] font-semibold px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
          {asset.category}
        </span>
        <span className={`absolute bottom-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full border-2 shadow-sm ${assetStatusColors[asset.status] || assetStatusColors.available}`}>
          {assetStatusLabels[asset.status] || "متاح"}
        </span>
        {asset.rating > 0 && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-600 shadow-sm flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {asset.rating}
          </span>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug truncate">{asset.title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.city}</span>
        </div>
        <div className="divider-warm" />
        <div className="flex items-center justify-between pt-1">
          <span className="price-highlight">
            <span className="text-primary font-black text-xl tracking-tight">{asset.price_per_day}</span>
            <span className="text-[10px] font-medium text-gray-400">﷼/يوم</span>
          </span>
          <span className="text-[10px] text-gray-400">{asset.owner?.name}</span>
        </div>
      </div>
    </Link>
  );
}
