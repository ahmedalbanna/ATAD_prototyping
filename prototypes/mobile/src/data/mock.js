export const users = [
  { id: 1, name: "أحمد الحربي", phone: "555123456", role: "tenant" },
  { id: 2, name: "سارة القحطاني", phone: "555654321", role: "lessor" },
];

export const normalizeAsset = (a) => ({
  id: a.id,
  title: a.title,
  description: a.description,
  category: a.category,
  price_per_day: a.pricePerDay,
  city: a.city,
  image_url: a.image,
  rating: a.rating,
  status: a.status,
  owner: { id: a.ownerId, name: a.ownerName },
});

export const normalizeBooking = (b) => ({
  id: b.id,
  asset: {
    id: b.assetId,
    title: b.assetTitle,
    image_url: b.assetImage,
  },
  tenant: {
    id: b.tenantId,
    name: b.tenantName,
  },
  start_date: b.startDate,
  end_date: b.endDate,
  total_price: b.totalPrice,
  status: b.status,
  payment_status: b.paymentStatus,
  created_at: b.createdAt,
});

export const categories = [
  "الكل", "معدات ثقيلة", "مركبات", "معدات كهربائية", "معدات بناء", "معدات صناعية", "أدوات يدوية"
];

const img = (id, text) => `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&auto=format`;

export const assets = [
  { id: 1, ownerId: 2, ownerName: "سارة القحطاني", title: "حفار صغير", description: "حفار صغير للإيجار بحالة ممتازة، مناسب لأعمال البناء والحفر", pricePerDay: 150, city: "الرياض", image: img("1581091226825-a6a2a5aee158", "حفار"), category: "معدات ثقيلة", rating: 4.5, status: "available" },
  { id: 2, ownerId: 2, ownerName: "سارة القحطاني", title: "شاحنة نقل", description: "شاحنة لنقل المواد والبضائع، حمولة تصل إلى 5 أطنان", pricePerDay: 250, city: "جدة", image: img("1558618666-fcd25c85f82e", "شاحنة"), category: "مركبات", rating: 4.2, status: "available" },
  { id: 3, ownerId: 2, ownerName: "سارة القحطاني", title: "مولد كهربائي", description: "مولد كهربائي 20 كيلوواط، مناسب للمنشآت والفعاليات", pricePerDay: 80, city: "مكة", image: img("1504328345606-18bbc8c9d7d1", "مولد"), category: "معدات كهربائية", rating: 4.8, status: "rented" },
  { id: 4, ownerId: 2, ownerName: "سارة القحطاني", title: "خلاطة خرسانة", description: "خلاطة خرسانة بحالة جيدة، مناسبة لمشاريع البناء", pricePerDay: 120, city: "الرياض", image: img("1581092160607-ee22621dd758", "خلاطة"), category: "معدات بناء", rating: 4.0, status: "available" },
  { id: 5, ownerId: 2, ownerName: "سارة القحطاني", title: "رافعة برجية", description: "رافعة برجية للأعمال الشاهقة، بارتفاع 30 متراً", pricePerDay: 500, city: "الدمام", image: img("1541888946425-d81bb4b8e605", "رافعة"), category: "معدات ثقيلة", rating: 4.6, status: "maintenance" },
  { id: 6, ownerId: 2, ownerName: "سارة القحطاني", title: "ضاغط هواء", description: "ضاغط هواء صناعي مع جميع الملحقات", pricePerDay: 60, city: "الخبر", image: img("1581092795360-fd1ca04f0952", "ضاغط"), category: "معدات صناعية", rating: 4.1, status: "available" },
];

export const assetStatusLabels = { available: "متاح", rented: "مؤجر", maintenance: "صيانة" };
export const assetStatusColors = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rented: "bg-amber-50 text-amber-700 border-amber-200",
  maintenance: "bg-red-50 text-red-700 border-red-200",
};

export const bookings = [
  { id: 1, assetId: 1, assetTitle: "حفار صغير", assetImage: img("1581091226825-a6a2a5aee158", "حفار"), tenantId: 1, tenantName: "أحمد الحربي", startDate: "2026-05-20", endDate: "2026-05-25", totalPrice: 750, status: "pending", createdAt: "2026-05-14", paymentStatus: null },
  { id: 2, assetId: 2, assetTitle: "شاحنة نقل", assetImage: img("1558618666-fcd25c85f82e", "شاحنة"), tenantId: 1, tenantName: "أحمد الحربي", startDate: "2026-05-18", endDate: "2026-05-20", totalPrice: 500, status: "approved", createdAt: "2026-05-13", paymentStatus: "pending" },
  { id: 3, assetId: 3, assetTitle: "مولد كهربائي", assetImage: img("1504328345606-18bbc8c9d7d1", "مولد"), tenantId: 1, tenantName: "أحمد الحربي", startDate: "2026-05-10", endDate: "2026-05-15", totalPrice: 400, status: "completed", createdAt: "2026-05-08", paymentStatus: "paid" },
  { id: 4, assetId: 4, assetTitle: "خلاطة خرسانة", assetImage: img("1581092160607-ee22621dd758", "خلاطة"), tenantId: 1, tenantName: "أحمد الحربي", startDate: "2026-06-01", endDate: "2026-06-05", totalPrice: 600, status: "rejected", createdAt: "2026-05-12", paymentStatus: null },
  { id: 5, assetId: 6, assetTitle: "ضاغط هواء", assetImage: img("1581092795360-fd1ca04f0952", "ضاغط"), tenantId: 2, tenantName: "سارة القحطاني", startDate: "2026-05-22", endDate: "2026-05-28", totalPrice: 360, status: "pending", createdAt: "2026-05-14", paymentStatus: null },
  { id: 6, assetId: 1, assetTitle: "حفار صغير", assetImage: img("1581091226825-a6a2a5aee158", "حفار"), tenantId: 2, tenantName: "سارة القحطاني", startDate: "2026-06-10", endDate: "2026-06-15", totalPrice: 750, status: "active", createdAt: "2026-05-05", paymentStatus: "paid" },
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
  { id: 2, type: "booking_status", title: "طلب تأجير جديد", message: "قام أحمد الحربي بتقديم طلب تأجير لحفار صغير.", bookingId: 1, read: false, createdAt: "2026-05-14T09:15:00" },
  { id: 3, type: "payment", title: "تم استلام الدفع", message: "تم استلام دفعة تأجير مولد كهربائي بقيمة 400 ﷼.", bookingId: 3, read: true, createdAt: "2026-05-10T14:00:00" },
  { id: 4, type: "booking_status", title: "تم رفض الطلب", message: "عذراً، تم رفض طلب تأجير خلاطة خرسانة.", bookingId: 4, read: true, createdAt: "2026-05-12T16:45:00" },
  { id: 5, type: "system", title: "مرحباً بك في عتاد", message: "شكراً لانضمامك إلى منصة عتاد. يمكنك الآن تصفح الأصول المتاحة للتأجير.", bookingId: null, read: true, createdAt: "2026-05-01T08:00:00" },
  { id: 6, type: "booking_status", title: "طلب تأجير جديد", message: "قامت سارة القحطاني بتقديم طلب تأجير لضاغط هواء.", bookingId: 5, read: false, createdAt: "2026-05-14T11:00:00" },
];

export const payments = [
  { id: 1, bookingId: 3, amount: 400, method: "mock", status: "paid", paidAt: "2026-05-10", reference: "TXN-20260510-001" },
  { id: 2, bookingId: 6, amount: 750, method: "bank_transfer", status: "paid", paidAt: "2026-05-06", reference: "TXN-20260506-002" },
];

export const ratings = [
  { id: 1, bookingId: 3, assetId: 3, tenantId: 1, score: 4, comment: "مولد ممتاز، شكراً", createdAt: "2026-05-16" },
];

export const transactions = [
  { id: 1, bookingId: 6, assetTitle: "حفار صغير", tenantName: "أحمد الحربي", amount: 750, type: "incoming", status: "completed", date: "2026-05-06", days: 5 },
  { id: 2, bookingId: 3, assetTitle: "مولد كهربائي", tenantName: "أحمد الحربي", amount: 400, type: "incoming", status: "completed", date: "2026-05-10", days: 5 },
  { id: 3, bookingId: 1, assetTitle: "حفار صغير", tenantName: "فاطمة الزهراني", amount: 750, type: "incoming", status: "pending", date: "2026-05-20", days: 5 },
  { id: 4, bookingId: 2, assetTitle: "شاحنة نقل", tenantName: "أحمد الحربي", amount: 500, type: "incoming", status: "pending", date: "2026-05-18", days: 2 },
];
