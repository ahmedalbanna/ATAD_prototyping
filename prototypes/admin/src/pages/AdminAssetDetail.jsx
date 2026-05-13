import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, MapPin, User, DollarSign, CalendarDays, ArrowRight } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/apiClient";
import { statusLabels, statusColors } from "../data/mock";

const statusLabels2 = { available: "متاح", rented: "مؤجر", maintenance: "صيانة" };
const statusColors2 = {
  available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rented: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  maintenance: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export default function AdminAssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/assets/${id}`).then(setData).catch(() => setData(null));
  }, [id]);

  if (!data) return <AdminLayout title="الأصل"><div className="text-center py-20 text-gray-400">الأصل غير موجود</div></AdminLayout>;

  const { image_url, title, city, owner_name, price_per_day, status, description, category, bookings } = data;

  return (
    <AdminLayout title={title}>
      <button onClick={() => navigate("/admin/assets")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowRight className="w-4 h-4" /> عودة للأصول
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {image_url && <img src={image_url} alt={title} className="w-full aspect-[16/10] object-cover" />}
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {city}</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {owner_name}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-2xl font-black text-primary">{price_per_day} <span className="text-sm font-medium text-gray-400">﷼/يوم</span></span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors2[status]}`}>
                  {statusLabels2[status]}
                </span>
              </div>
            </div>
          </div>

          {description && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-2">الوصف</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              {category && <span className="inline-block mt-2 text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{category}</span>}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">إحصائيات</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">إجمالي الحجوزات</span><span className="font-bold">{bookings?.length || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">المالك</span><span className="font-semibold">{owner_name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">المدينة</span><span>{city}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">حجوزات هذا الأصل</h3>
              <span className="text-xs text-gray-400">{bookings?.length || 0} حجز</span>
            </div>
            {!bookings || bookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">لا توجد حجوزات</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400 text-xs">
                      <th className="text-right p-3 font-semibold">المستأجر</th>
                      <th className="text-right p-3 font-semibold">المدة</th>
                      <th className="text-right p-3 font-semibold">المبلغ</th>
                      <th className="text-right p-3 font-semibold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-3 font-medium text-gray-900">{b.tenant_name}</td>
                        <td className="p-3 text-gray-400 text-xs">{b.start_date} → {b.end_date}</td>
                        <td className="p-3 font-semibold">{b.total_price} ﷼</td>
                        <td className="p-3">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                            {statusLabels[b.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
