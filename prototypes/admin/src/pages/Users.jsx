import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users as UsersIcon, Phone, Calendar, Activity } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { users } from "../data/mock";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر", admin: "مدير" };
const roleColors = {
  tenant: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  lessor: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  admin: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
};

export default function Users() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filtered = users
    .filter(u => filterRole === "all" || u.role === filterRole)
    .filter(u => u.name.includes(search) || u.phone.includes(search));

  return (
    <AdminLayout title="المستخدمين">
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو رقم الجوال..."
              className="w-full pr-9 pl-3 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>
          <div className="flex gap-2">
            {["all", "tenant", "lessor", "admin"].map(r => (
              <button key={r} onClick={() => setFilterRole(r)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterRole === r
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-50 text-gray-500 border border-gray-200/80 hover:border-gray-300"
                }`}>
                {r === "all" ? "الكل" : roleLabels[r]}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 self-center bg-gray-50 px-2.5 py-1 rounded-full">{filtered.length} مستخدم</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-xs">
                <th className="text-right p-3 font-semibold">#</th>
                <th className="text-right p-3 font-semibold"><UsersIcon className="w-3 h-3 inline ml-1" />الاسم</th>
                <th className="text-right p-3 font-semibold"><Phone className="w-3 h-3 inline ml-1" />رقم الجوال</th>
                <th className="text-right p-3 font-semibold">نوع الحساب</th>
                <th className="text-right p-3 font-semibold"><Calendar className="w-3 h-3 inline ml-1" />تاريخ التسجيل</th>
                <th className="text-center p-3 font-semibold"><Activity className="w-3 h-3 inline ml-1" />نشاط</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="p-3">
                    <Link to={`/admin/user/${user.id}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {user.name}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-500" dir="ltr">+967 {user.phone}</td>
                  <td className="p-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 text-xs">{user.joinedAt}</td>
                  <td className="p-3 text-center">
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {user.bookingsCount !== undefined ? `${user.bookingsCount} حجوزات` : `${user.assetsCount} أصول`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
