import { useState, useEffect, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { api } from "../services/apiClient";

const DAYS = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  const startDow = first.getDay();
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

function dateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

export default function AvailabilityCalendar({ assetId, startDate, endDate, onChangeStart, onChangeEnd }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const start = dateStr(year, month, 1);
    const end = dateStr(year + (month === 11 ? 1 : 0), (month + 1) % 12, 0);
    api.get(`/assets/${assetId}/availability?start=${start}&end=${end}`)
      .then(setBookedRanges)
      .catch(() => setBookedRanges([]))
      .finally(() => setLoading(false));
  }, [assetId, year, month]);

  const bookedSet = useMemo(() => {
    const set = new Set();
    for (const range of bookedRanges) {
      const s = new Date(range.start_date);
      const e = new Date(range.end_date);
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        set.add(d.toISOString().split("T")[0]);
      }
    }
    return set;
  }, [bookedRanges]);

  const isBooked = (year, month, day) => {
    return bookedSet.has(dateStr(year, month, day));
  };

  const isPast = (year, month, day) => {
    const d = new Date(year, month, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  };

  const isSelected = (year, month, day) => {
    const s = dateStr(year, month, day);
    return s === startDate || s === endDate;
  };

  const isInRange = (year, month, day) => {
    if (!startDate || !endDate) return false;
    const d = dateStr(year, month, day);
    return d > startDate && d < endDate;
  };

  const handleDayClick = (year, month, day) => {
    if (isPast(year, month, day) || isBooked(year, month, day)) return;

    const clicked = dateStr(year, month, day);

    if (!startDate || (startDate && endDate)) {
      onChangeStart(clicked);
      onChangeEnd("");
    } else {
      if (clicked <= startDate) {
        onChangeStart(clicked);
      } else {
        onChangeEnd(clicked);
      }
    }
  };

  const monthDays = getMonthDays(year, month);
  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="font-bold text-sm text-gray-900">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {monthDays.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;

          const booked = isBooked(year, month, day);
          const past = isPast(year, month, day);
          const selected = isSelected(year, month, day);
          const inRange = isInRange(year, month, day);
          const disabled = booked || past;

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => handleDayClick(year, month, day)}
              className={`
                relative text-xs py-1.5 rounded-lg font-medium transition-all
                ${disabled ? "text-gray-200 cursor-not-allowed" : "hover:bg-primary/5 active:scale-90"}
                ${selected ? "bg-primary text-white font-bold shadow-sm hover:bg-primary-dark" : ""}
                ${inRange ? "bg-primary/10 text-primary" : ""}
                ${booked && !selected ? "line-through" : ""}
                ${past && !selected ? "text-gray-100" : ""}
              `}
            >
              {day}
              {booked && !selected && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary/10" />
          <span className="text-[10px] text-gray-400">محدد</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-50 border border-gray-200">
            <span className="w-full h-full flex items-center justify-center text-[6px] text-red-400">●</span>
          </span>
          <span className="text-[10px] text-gray-400">محجوز</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-white border border-gray-200" />
          <span className="text-[10px] text-gray-400">متاح</span>
        </div>
      </div>
    </div>
  );
}
