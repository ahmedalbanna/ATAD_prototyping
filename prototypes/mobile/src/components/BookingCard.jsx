import { Link } from "react-router-dom";
import { CalendarDays, User } from "lucide-react";
import { statusLabels, statusColors } from "../data/mock";

export default function BookingCard({ booking, actions }) {
  return (
    <Link to={`/booking/${booking.id}`}
      className="block card card-hover overflow-hidden">
      <div className="flex gap-3 p-3">
        <img src={booking.assetImage} alt={booking.assetTitle}
          className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0 ring-1 ring-gray-100" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="font-heading font-bold text-sm text-gray-900 truncate">{booking.assetTitle}</h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User className="w-3 h-3" />
            <span>{booking.tenantName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarDays className="w-3 h-3" />
            <span>{booking.startDate} → {booking.endDate}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-primary text-sm">{booking.totalPrice} ﷼</span>
            <span className={`badge-dot text-[11px] px-2 py-0.5 rounded-full font-medium border ${statusColors[booking.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                booking.status === "pending" ? "bg-amber-500" :
                booking.status === "approved" ? "bg-blue-500" :
                booking.status === "active" ? "bg-emerald-500" :
                booking.status === "completed" ? "bg-gray-500" :
                booking.status === "rejected" ? "bg-red-500" : "bg-gray-400"
              }`} />
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>
      </div>
      {actions && <div className="px-3 pb-3" onClick={e => e.preventDefault()}>{actions}</div>}
    </Link>
  );
}
