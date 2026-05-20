import { Link } from "react-router-dom";
import { CalendarDays, User } from "lucide-react";
import { statusLabels } from "../data/mock";

const statusStyles = {
  pending: {
    gradient: "from-amber-50 to-amber-100/60",
    badge: "bg-amber-500",
    border: "border-r-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  approved: {
    gradient: "from-blue-50 to-blue-100/60",
    badge: "bg-blue-500",
    border: "border-r-accent",
    text: "text-blue-700",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
  },
  rejected: {
    gradient: "from-red-50 to-red-100/60",
    badge: "bg-red-500",
    border: "border-r-red-400",
    text: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
  active: {
    gradient: "from-emerald-50 to-emerald-100/60",
    badge: "bg-emerald-500",
    border: "border-r-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
  completed: {
    gradient: "from-gray-50 to-gray-100/60",
    badge: "bg-gray-400",
    border: "border-r-gray-300",
    text: "text-gray-600",
    bg: "bg-gray-50",
    dot: "bg-gray-400",
  },
  expired: {
    gradient: "from-gray-50 to-gray-100/60",
    badge: "bg-gray-300",
    border: "border-r-gray-300",
    text: "text-gray-400",
    bg: "bg-gray-50",
    dot: "bg-gray-300",
  },
};

export default function BookingCard({ booking, actions }) {
  const style = statusStyles[booking.status] || statusStyles.pending;
  const statusColor = statusLabels[booking.status] ? style.text : "text-gray-600";
  const statusDot = statusLabels[booking.status] ? style.dot : "bg-gray-400";

  return (
    <Link to={`/booking/${booking.id}`}
      className={`block bg-gradient-to-l ${style.gradient} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-white/60 border-r-[3px] ${style.border} active:scale-[0.99]`}>
      <div className="flex gap-3 p-3">
        <div className="relative">
          <img src={booking.asset?.image_url} alt={booking.asset?.title}
            className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0 ring-1 ring-white/80 shadow-sm" />
          {booking.status === "active" && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-heading font-bold text-sm text-gray-900 truncate">{booking.asset?.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>{booking.tenant?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CalendarDays className="w-3 h-3" />
            <span>{booking.start_date} → {booking.end_date}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <span className="font-black text-sm bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
              {booking.total_price} ﷼
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[12px] px-3 py-1 rounded-full font-bold border-2 ${style.bg} ${style.text} border-current/20 shadow-sm`}>
              <span className={`w-2 h-2 rounded-full ${statusDot} ${booking.status === "active" ? "animate-pulse" : ""}`} />
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>
      </div>
      {actions && <div className="px-3 pb-3 pt-0" onClick={e => e.preventDefault()}>{actions}</div>}
    </Link>
  );
}
