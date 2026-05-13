import { useParams, useNavigate } from "react-router-dom";
import { Phone, CalendarDays, Package, ClipboardList, ArrowRight, Mail } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { users, assets, bookings, statusLabels, statusColors } from "../data/mock";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر" };
const roleColors = {
  tenant: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  lessor: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find(u => u.id === Number(id));
  const userAssets = assets.filter(a => a.ownerName === user?.name);
  const userBookings = bookings.filter(b => b.tenantName === user?.name);

  if (!user) {
    return (
      <AdminLayout title="المستخدم">
        <div className="text-center py-20 text-gray-400">المستخدم غير موجود</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={user.name}>
      <button onClick={() => navigate("/admin/users")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <ArrowRight className="w-4 h-4" /> عودة للمستخدمين
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User profile */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary">{user.name[0]}</span>
            </div>
            <h2 className="font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-400" dir="ltr">+966 {user.phone}</p>
            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
            <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <CalendarDays className="w-3 h-3" /> عضو منذ {user.joinedAt}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">نظرة سريعة</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">الأصول</span>
                <span className="font-bold text-gray-900">{userAssets.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">الحجوزات</span>
                <span className="font-bold text-gray-900">{userBookings.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">حالة الحساب</span>
                <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full">نشط</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings & Assets */}
        <div className="lg:col-span-2 space-y-4">
          {userBookings.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-primary" /> حجوزات المستخدم
                </h3>
                <span className="text-xs text-gray-400">{userBookings.length} حجز</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400 text-xs">
                      <th className="text-right p-3 font-semibold">الأصل</th>
                      <th className="text-right p-3 font-semibold">المدة</th>
                      <th className="text-right p-3 font-semibold">المبلغ</th>
                      <th className="text-right p-3 font-semibold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBookings.map(b => (
                      <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-3 font-medium text-gray-900">{b.assetTitle}</td>
                        <td className="p-3 text-gray-400 text-xs">{b.startDate} → {b.endDate}</td>
                        <td className="p-3 font-semibold">{b.totalPrice} ﷼</td>
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
            </div>
          )}

          {userAssets.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-primary" /> أصول المستخدم
                </h3>
                <span className="text-xs text-gray-400">{userAssets.length} أصل</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 text-gray-400 text-xs">
                      <th className="text-right p-3 font-semibold">الأصل</th>
                      <th className="text-right p-3 font-semibold">السعر</th>
                      <th className="text-right p-3 font-semibold">المدينة</th>
                      <th className="text-right p-3 font-semibold">الحالة</th>
                      <th className="text-center p-3 font-semibold">حجوزات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAssets.map(a => (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-3 font-medium text-gray-900">{a.title}</td>
                        <td className="p-3 font-semibold">{a.pricePerDay} ﷼</td>
                        <td className="p-3 text-gray-400">{a.city}</td>
                        <td className="p-3">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            a.status === "available" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" :
                            a.status === "rented" ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" :
                            "bg-red-50 text-red-700 ring-1 ring-red-200"
                          }`}>
                            {a.status === "available" ? "متاح" : a.status === "rented" ? "مؤجر" : "صيانة"}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-400">{a.bookingsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {userBookings.length === 0 && userAssets.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              لا توجد نشاطات لهذا المستخدم
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
