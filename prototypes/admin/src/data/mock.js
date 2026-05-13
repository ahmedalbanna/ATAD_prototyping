export const users = [
  { id: 1, name: "أحمد محمد", phone: "777123456", role: "tenant", joinedAt: "2026-01-15", bookingsCount: 4 },
  { id: 2, name: "سارة علي", phone: "777654321", role: "lessor", joinedAt: "2026-01-20", assetsCount: 6 },
  { id: 3, name: "خالد المدير", phone: "777000000", role: "admin", joinedAt: "2026-01-01" },
  { id: 4, name: "فاطمة أحمد", phone: "777111222", role: "tenant", joinedAt: "2026-02-10", bookingsCount: 2 },
  { id: 5, name: "عمر حسن", phone: "777333444", role: "lessor", joinedAt: "2026-03-05", assetsCount: 3 },
];

export const assets = [
  { id: 1, ownerName: "سارة علي", title: "حفار صغير", pricePerDay: 150, city: "صنعاء", status: "available", bookingsCount: 5 },
  { id: 2, ownerName: "سارة علي", title: "شاحنة نقل", pricePerDay: 250, city: "عدن", status: "available", bookingsCount: 3 },
  { id: 3, ownerName: "سارة علي", title: "مولد كهربائي", pricePerDay: 80, city: "تعز", status: "rented", bookingsCount: 8 },
  { id: 4, ownerName: "سارة علي", title: "خلاطة خرسانة", pricePerDay: 120, city: "صنعاء", status: "available", bookingsCount: 2 },
  { id: 5, ownerName: "سارة علي", title: "رافعة برجية", pricePerDay: 500, city: "صنعاء", status: "maintenance", bookingsCount: 1 },
  { id: 6, ownerName: "عمر حسن", title: "منشار كهربائي", pricePerDay: 40, city: "إب", status: "available", bookingsCount: 0 },
];

export const bookings = [
  { id: 1, assetTitle: "حفار صغير", assetId: 1, tenantName: "أحمد محمد", startDate: "2026-05-20", endDate: "2026-05-25", totalPrice: 750, status: "pending" },
  { id: 2, assetTitle: "شاحنة نقل", assetId: 2, tenantName: "أحمد محمد", startDate: "2026-05-18", endDate: "2026-05-20", totalPrice: 500, status: "approved" },
  { id: 3, assetTitle: "مولد كهربائي", assetId: 3, tenantName: "أحمد محمد", startDate: "2026-05-10", endDate: "2026-05-15", totalPrice: 400, status: "completed" },
  { id: 4, assetTitle: "خلاطة خرسانة", assetId: 4, tenantName: "أحمد محمد", startDate: "2026-06-01", endDate: "2026-06-05", totalPrice: 600, status: "rejected" },
  { id: 5, assetTitle: "مولد كهربائي", assetId: 3, tenantName: "فاطمة أحمد", startDate: "2026-05-22", endDate: "2026-05-25", totalPrice: 240, status: "active" },
];

export const statusLabels = {
  pending: "قيد الانتظار", approved: "تمت الموافقة", rejected: "مرفوض",
  active: "نشط", completed: "مكتمل", expired: "منتهي",
};

export const statusColors = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
  active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  completed: "bg-gray-50 text-gray-600 ring-1 ring-gray-200",
  expired: "bg-gray-50 text-gray-400 ring-1 ring-gray-200",
};

export const stats = {
  totalUsers: 5, totalAssets: 6, totalBookings: 5,
  activeRentals: 1, revenue: 2490,
  pendingBookings: 1,
};
