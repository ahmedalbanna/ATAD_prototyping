export const users = [
  { id: 1, name: "أحمد محمد", phone: "777123456", role: "tenant" },
  { id: 2, name: "سارة علي", phone: "777654321", role: "lessor" },
  { id: 3, name: "خالد المدير", phone: "777000000", role: "admin" },
];

export const categories = [
  "الكل", "معدات ثقيلة", "مركبات", "معدات كهربائية", "معدات بناء", "معدات صناعية", "أدوات يدوية"
];

export const assets = [
  { id: 1, ownerId: 2, ownerName: "سارة علي", title: "حفار صغير", description: "حفار صغير للإيجار بحالة ممتازة، مناسب لأعمال البناء والحفر", pricePerDay: 150, city: "صنعاء", image: "https://placehold.co/400x300/2563eb/ffffff?text=حفار", category: "معدات ثقيلة", rating: 4.5 },
  { id: 2, ownerId: 2, ownerName: "سارة علي", title: "شاحنة نقل", description: "شاحنة لنقل المواد والبضائع، حمولة تصل إلى 5 أطنان", pricePerDay: 250, city: "عدن", image: "https://placehold.co/400x300/16a34a/ffffff?text=شاحنة", category: "مركبات", rating: 4.2 },
  { id: 3, ownerId: 2, ownerName: "سارة علي", title: "مولد كهربائي", description: "مولد كهربائي 20 كيلوواط، مناسب للمنشآت والفعاليات", pricePerDay: 80, city: "تعز", image: "https://placehold.co/400x300/dc2626/ffffff?text=مولد", category: "معدات كهربائية", rating: 4.8 },
  { id: 4, ownerId: 2, ownerName: "سارة علي", title: "خلاطة خرسانة", description: "خلاطة خرسانة بحالة جيدة، مناسبة لمشاريع البناء", pricePerDay: 120, city: "صنعاء", image: "https://placehold.co/400x300/ca8a04/ffffff?text=خلاطة", category: "معدات بناء", rating: 4.0 },
  { id: 5, ownerId: 2, ownerName: "سارة علي", title: "رافعة برجية", description: "رافعة برجية للأعمال الشاهقة، بارتفاع 30 متراً", pricePerDay: 500, city: "صنعاء", image: "https://placehold.co/400x300/7c3aed/ffffff?text=رافعة", category: "معدات ثقيلة", rating: 4.6 },
  { id: 6, ownerId: 2, ownerName: "سارة علي", title: "ضاغط هواء", description: "ضاغط هواء صناعي مع جميع الملحقات", pricePerDay: 60, city: "الحديدة", image: "https://placehold.co/400x300/db2777/ffffff?text=ضاغط", category: "معدات صناعية", rating: 4.1 },
];

export const bookings = [
  { id: 1, assetId: 1, assetTitle: "حفار صغير", assetImage: "https://placehold.co/400x300/2563eb/ffffff?text=حفار", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-05-20", endDate: "2026-05-25", totalPrice: 750, status: "pending" },
  { id: 2, assetId: 2, assetTitle: "شاحنة نقل", assetImage: "https://placehold.co/400x300/16a34a/ffffff?text=شاحنة", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-05-18", endDate: "2026-05-20", totalPrice: 500, status: "approved" },
  { id: 3, assetId: 3, assetTitle: "مولد كهربائي", assetImage: "https://placehold.co/400x300/dc2626/ffffff?text=مولد", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-05-10", endDate: "2026-05-15", totalPrice: 400, status: "completed" },
  { id: 4, assetId: 4, assetTitle: "خلاطة خرسانة", assetImage: "https://placehold.co/400x300/ca8a04/ffffff?text=خلاطة", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-06-01", endDate: "2026-06-05", totalPrice: 600, status: "rejected" },
  { id: 5, assetId: 6, assetTitle: "ضاغط هواء", assetImage: "https://placehold.co/400x300/db2777/ffffff?text=ضاغط", tenantId: 2, tenantName: "سارة علي", startDate: "2026-05-22", endDate: "2026-05-28", totalPrice: 360, status: "pending" },
];

export const statusLabels = {
  pending: "قيد الانتظار", approved: "تمت الموافقة", rejected: "مرفوض",
  active: "نشط", completed: "مكتمل", expired: "منتهي",
};

export const statusColors = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-gray-50 text-gray-600 border-gray-200",
  expired: "bg-gray-50 text-gray-400 border-gray-200",
};
