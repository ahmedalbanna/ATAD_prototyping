import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ImageOff } from "lucide-react";
import { assetStatusLabels, assetStatusColors } from "../data/mock";

export default function AssetCard({ asset }) {
  const [imgError, setImgError] = useState(false);

  const statusKey = asset.status || "available";
  const statusLabel = assetStatusLabels[statusKey] || "متاح";
  const statusColor = assetStatusColors[statusKey] || assetStatusColors.available;

  return (
    <Link to={`/asset/${asset.id}`}
      className="block card card-hover overflow-hidden">
      <div className="aspect-[4/3] image-frame rounded-t-[20px]">
        {imgError || !asset.image_url ? (
          <div className="image-fallback">
            <ImageOff className="w-7 h-7 opacity-30" />
            <span>لا توجد صورة</span>
          </div>
        ) : (
          <img src={asset.image_url} alt={asset.title} loading="lazy"
            onError={() => setImgError(true)} />
        )}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] font-semibold px-2 py-0.5 rounded-full text-gray-700 shadow-sm">
          {asset.category}
        </span>
        <span className={`absolute bottom-2 left-2 text-[11px] font-bold px-2.5 py-1 rounded-full border-2 shadow-sm ${statusColor}`}>
          {statusLabel}
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
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.city}</span>
          <span className="text-gray-200">•</span>
          <span className="text-gray-400 truncate">{asset.owner?.name}</span>
        </div>
        <div className="divider-warm" />
        <div className="flex items-center justify-between pt-1">
          <span className="price-highlight">
            <span className="price-amount">{asset.price_per_day}</span>
            <span className="price-unit">﷼/يوم</span>
          </span>
          {asset.discount_price && (
            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              خصم {Math.round((1 - asset.discount_price / asset.price_per_day) * 100)}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
