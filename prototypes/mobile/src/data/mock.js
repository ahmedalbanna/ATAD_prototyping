export const users = [
  { id: 1, name: "أحمد محمد", phone: "777123456", role: "tenant" },
  { id: 2, name: "سارة علي", phone: "777654321", role: "lessor" },
  { id: 3, name: "خالد المدير", phone: "777000000", role: "admin" },
];

export const categories = [
  "الكل", "معدات ثقيلة", "مركبات", "معدات كهربائية", "معدات بناء", "معدات صناعية", "أدوات يدوية"
];

export const assets = [
  { id: 1, ownerId: 2, ownerName: "سارة علي", title: "حفار صغير", description: "حفار صغير للإيجار بحالة ممتازة، مناسب لأعمال البناء والحفر", pricePerDay: 150, city: "صنعاء", image: "https://placehold.co/400x300/2563eb/ffffff?text=حفار", category: "معدات ثقيلة", rating: 4.5, status: "available" },
  { id: 2, ownerId: 2, ownerName: "سارة علي", title: "شاحنة نقل", description: "شاحنة لنقل المواد والبضائع، حمولة تصل إلى 5 أطنان", pricePerDay: 250, city: "عدن", image: "https://placehold.co/400x300/16a34a/ffffff?text=شاحنة", category: "مركبات", rating: 4.2, status: "available" },
  { id: 3, ownerId: 2, ownerName: "سارة علي", title: "مولد كهربائي", description: "مولد كهربائي 20 كيلوواط، مناسب للمنشآت والفعاليات", pricePerDay: 80, city: "تعز", image: "https://placehold.co/400x300/dc2626/ffffff?text=مولد", category: "معدات كهربائية", rating: 4.8, status: "rented" },
  { id: 4, ownerId: 2, ownerName: "سارة علي", title: "خلاطة خرسانة", description: "خلاطة خرسانة بحالة جيدة، مناسبة لمشاريع البناء", pricePerDay: 120, city: "صنعاء", image: "https://placehold.co/400x300/ca8a04/ffffff?text=خلاطة", category: "معدات بناء", rating: 4.0, status: "available" },
  { id: 5, ownerId: 2, ownerName: "سارة علي", title: "رافعة برجية", description: "رافعة برجية للأعمال الشاهقة، بارتفاع 30 متراً", pricePerDay: 500, city: "صنعاء", image: "https://placehold.co/400x300/7c3aed/ffffff?text=رافعة", category: "معدات ثقيلة", rating: 4.6, status: "maintenance" },
  { id: 6, ownerId: 2, ownerName: "سارة علي", title: "ضاغط هواء", description: "ضاغط هواء صناعي مع جميع الملحقات", pricePerDay: 60, city: "الحديدة", image: "https://placehold.co/400x300/db2777/ffffff?text=ضاغط", category: "معدات صناعية", rating: 4.1, status: "available" },
];

export const assetStatusLabels = {
  available: "متاح", rented: "مؤجر", maintenance: "صيانة",
};

export const assetStatusColors = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rented: "bg-amber-50 text-amber-700 border-amber-200",
  maintenance: "bg-red-50 text-red-700 border-red-200",
};

export const bookings = [
  { id: 1, assetId: 1, assetTitle: "حفار صغير", assetImage: "https://placehold.co/400x300/2563eb/ffffff?text=حفار", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-05-20", endDate: "2026-05-25", totalPrice: 750, status: "pending", createdAt: "2026-05-14", paymentStatus: null },
  { id: 2, assetId: 2, assetTitle: "شاحنة نقل", assetImage: "https://placehold.co/400x300/16a34a/ffffff?text=شاحنة", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-05-18", endDate: "2026-05-20", totalPrice: 500, status: "approved", createdAt: "2026-05-13", paymentStatus: "pending" },
  { id: 3, assetId: 3, assetTitle: "مولد كهربائي", assetImage: "https://placehold.co/400x300/dc2626/ffffff?text=مولد", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-05-10", endDate: "2026-05-15", totalPrice: 400, status: "completed", createdAt: "2026-05-08", paymentStatus: "paid" },
  { id: 4, assetId: 4, assetTitle: "خلاطة خرسانة", assetImage: "https://placehold.co/400x300/ca8a04/ffffff?text=خلاطة", tenantId: 1, tenantName: "أحمد محمد", startDate: "2026-06-01", endDate: "2026-06-05", totalPrice: 600, status: "rejected", createdAt: "2026-05-12", paymentStatus: null },
  { id: 5, assetId: 6, assetTitle: "ضاغط هواء", assetImage: "https://placehold.co/400x300/db2777/ffffff?text=ضاغط", tenantId: 2, tenantName: "سارة علي", startDate: "2026-05-22", endDate: "2026-05-28", totalPrice: 360, status: "pending", createdAt: "2026-05-14", paymentStatus: null },
  { id: 6, assetId: 1, assetTitle: "حفار صغير", assetImage: "https://placehold.co/400x300/2563eb/ffffff?text=حفار", tenantId: 2, tenantName: "سارة علي", startDate: "2026-06-10", endDate: "2026-06-15", totalPrice: 750, status: "active", createdAt: "2026-05-05", paymentStatus: "paid" },
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

export const notifications = [
  { id: 1, type: "booking_status", title: "تمت الموافقة على طلبك", message: "تمت الموافقة على طلب تأجير شاحنة نقل. يرجى إتمام الدفع لتأكيد الحجز.", bookingId: 2, read: false, createdAt: "2026-05-14T10:30:00" },
  { id: 2, type: "booking_status", title: "طلب تأجير جديد", message: "قام أحمد محمد بتقديم طلب تأجير لحفار صغير.", bookingId: 1, read: false, createdAt: "2026-05-14T09:15:00" },
  { id: 3, type: "payment", title: "تم استلام الدفع", message: "تم استلام دفعة تأجير مولد كهربائي بقيمة 400 ﷼.", bookingId: 3, read: true, createdAt: "2026-05-10T14:00:00" },
  { id: 4, type: "booking_status", title: "تم رفض الطلب", message: "عذراً، تم رفض طلب تأجير خلاطة خرسانة.", bookingId: 4, read: true, createdAt: "2026-05-12T16:45:00" },
  { id: 5, type: "system", title: "مرحباً بك في عتاد", message: "شكراً لانضمامك إلى منصة عتاد. يمكنك الآن تصفح الأصول المتاحة للتأجير.", bookingId: null, read: true, createdAt: "2026-05-01T08:00:00" },
];

export const payments = [
  { id: 1, bookingId: 3, amount: 400, method: "mock", status: "paid", paidAt: "2026-05-10", reference: "TXN-20260510-001" },
  { id: 2, bookingId: 6, amount: 750, method: "bank_transfer", status: "paid", paidAt: "2026-05-06", reference: "TXN-20260506-002" },
];
