import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Users as UsersIcon, Phone, Plus, Edit3, Trash2, X, Loader } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import { api } from "../services/apiClient";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر", admin: "مدير" };
const roleColors = {
  tenant: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  lessor: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  admin: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
};
const roles = ["tenant", "lessor", "admin"];

function UserModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone?.replace("+966", "") || "");
  const [role, setRole] = useState(user?.role || "tenant");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 6) {
      setError("يرجى إدخال الاسم ورقم الجوال");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const fullPhone = phone.startsWith("+966") ? phone : `+966${phone}`;
      if (user) {
        await api.put(`/admin/users/${user.id}`, { name, phone: fullPhone, role });
      } else {
        await api.post("/admin/users", { name, phone: fullPhone, role });
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">{user ? "تعديل مستخدم" : "إضافة مستخدم"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-all hover:rotate-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 border border-red-100">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الاسم الكامل</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="مثال: محمد العلي"
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">رقم الجوال</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 border border-gray-200 rounded-xl text-gray-500 bg-gray-50 text-sm shrink-0">+966</span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder="500000000"
                className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">الدور</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`p-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    role === r ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  {roleLabels[r]}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader className="w-4 h-4 animate-spin" />}
            {user ? "حفظ التغييرات" : "إضافة المستخدم"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = () => {
    api.get("/admin/users").then(setUsers).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users
    .filter(u => filterRole === "all" || u.role === filterRole)
    .filter(u => u.name.includes(search) || u.phone.includes(search));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch {}
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  return (
    <AdminLayout title="المستخدمين">
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
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
                  filterRole === r ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-500 border border-gray-200/80 hover:border-gray-300"
                }`}>
                {r === "all" ? "الكل" : roleLabels[r]}
              </button>
            ))}
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all active:scale-[0.97]">
            <Plus className="w-3.5 h-3.5" /> إضافة مستخدم
          </button>
          <span className="text-xs text-gray-400 self-center bg-gray-50 px-2.5 py-1 rounded-full">{filtered.length} مستخدم</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-xs">
                <th className="text-right p-3 font-semibold">#</th>
                <th className="text-right p-3 font-semibold"><UsersIcon className="w-3 h-3 inline ml-1" />الاسم</th>
                <th className="text-right p-3 font-semibold"><Phone className="w-3 h-3 inline ml-1" />رقم الجوال</th>
                <th className="text-right p-3 font-semibold">نوع الحساب</th>
                <th className="text-right p-3 font-semibold">تاريخ التسجيل</th>
                <th className="text-center p-3 font-semibold">إجراءات</th>
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
                  <td className="p-3 text-gray-500" dir="ltr">{user.phone}</td>
                  <td className="p-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 text-xs">{user.created_at?.slice(0, 10)}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(user)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                        title="تعديل">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(user)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="حذف">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">لا يوجد مستخدمين</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <UserModal user={editingUser} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); fetchUsers(); }} />
      )}

      <ConfirmDialog open={!!deleteTarget}
        title="حذف المستخدم"
        message={deleteTarget ? `هل أنت متأكد من حذف "${deleteTarget.name}"؟ لا يمكن التراجع عن هذا الإجراء.` : ""}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
