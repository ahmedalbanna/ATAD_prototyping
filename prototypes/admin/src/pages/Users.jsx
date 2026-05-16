import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Users as UsersIcon, Phone, Mail, Plus, Edit3, Trash2, X, Loader, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import { api } from "../services/apiClient";

const roleLabels = { tenant: "مستأجر", lessor: "مؤجر", admin: "مدير" };
const roleColors = {
  tenant: "bg-primary/10 text-primary ring-1 ring-primary/30",
  lessor: "bg-accent/10 text-accent ring-1 ring-accent/30",
  admin: "bg-primary-dark/10 text-primary-dark ring-1 ring-primary-dark/30",
};
const avatarColors = [
  "from-primary to-primary-dark",
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-purple-500 to-purple-700",
  "from-rose-500 to-rose-700",
];
const roles = ["tenant", "lessor", "admin"];
const PAGE_SIZE = 10;
const STATS_ICONS = [UsersIcon, UsersIcon, UsersIcon, UsersIcon];

function UserModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone?.replace("+966", "") || "");
  const [email, setEmail] = useState(user?.email || "");
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
        await api.put(`/admin/users/${user.id}`, { name, phone: fullPhone, email: email || undefined, role });
      } else {
        await api.post("/admin/users", { name, phone: fullPhone, email: email || undefined, role });
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
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
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
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(0);

  const fetchUsers = () => {
    api.get("/admin/users").then(setUsers).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users
    .filter(u => filterRole === "all" || u.role === filterRole)
    .filter(u => u.name.includes(search) || u.phone.includes(search) || (u.email || "").includes(search));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  useEffect(() => { setPage(0); }, [search, filterRole]);

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

  const stats = [
    { label: "إجمالي المستخدمين", value: users.length, color: "bg-primary/10 text-primary" },
    { label: "مستأجر", value: users.filter(u => u.role === "tenant").length, color: "bg-accent/10 text-accent" },
    { label: "مؤجر", value: users.filter(u => u.role === "lessor").length, color: "bg-primary-dark/10 text-primary-dark" },
    { label: "مدير", value: users.filter(u => u.role === "admin").length, color: "bg-gray-brand/10 text-gray-brand" },
  ];

  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  return (
    <AdminLayout title="المستخدمين">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => {
          const Icon = STATS_ICONS[i];
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100/80 p-3 flex items-center gap-3 shadow-sm animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الجوال أو البريد..."
              className="w-full pr-9 pl-3 p-2.5 border border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all active:scale-[0.97] shrink-0">
            <Plus className="w-3.5 h-3.5" /> إضافة مستخدم
          </button>
          <span className="text-xs text-gray-400 self-center bg-gray-50 px-2.5 py-1 rounded-full shrink-0">{filtered.length} مستخدم</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-xs">
                <th className="text-right p-3 font-semibold">#</th>
                <th className="text-right p-3 font-semibold">المستخدم</th>
                <th className="text-right p-3 font-semibold"><Phone className="w-3 h-3 inline ml-1" />رقم الجوال</th>
                <th className="text-right p-3 font-semibold"><Mail className="w-3 h-3 inline ml-1" />البريد</th>
                <th className="text-right p-3 font-semibold">نوع الحساب</th>
                <th className="text-right p-3 font-semibold"><CalendarDays className="w-3 h-3 inline ml-1" />التسجيل</th>
                <th className="text-center p-3 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((user, idx) => (
                <tr key={user.id} onClick={() => navigate(`/admin/user/${user.id}`)}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                  <td className="p-3 text-gray-400 font-mono text-xs">{String(safePage * PAGE_SIZE + idx + 1).padStart(2, "0")}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}>
                        {user.name?.[0]}
                      </div>
                      <Link to={`/admin/user/${user.id}`} onClick={e => e.stopPropagation()}
                        className="font-medium text-gray-900 hover:text-primary transition-colors">
                        {user.name}
                      </Link>
                    </div>
                  </td>
                  <td className="p-3 text-gray-500" dir="ltr">{user.phone}</td>
                  <td className="p-3 text-gray-400 text-xs max-w-[160px] truncate" dir="ltr">{user.email || "—"}</td>
                  <td className="p-3">
                    <span className={`badge ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 text-xs whitespace-nowrap">{user.created_at?.slice(0, 10)}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={e => { e.stopPropagation(); openEdit(user); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                        title="تعديل">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setDeleteTarget(user); }}
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
          <div className="text-center py-16 text-gray-300">
            <UsersIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-gray-400">لا يوجد مستخدمين</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              عرض {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} من {filtered.length}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                className="p-2 rounded-xl text-xs border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                    safePage === i ? "bg-primary text-white shadow-sm" : "text-gray-500 border border-gray-200 hover:border-gray-300"
                  }`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage === totalPages - 1}
                className="p-2 rounded-xl text-xs border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
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
