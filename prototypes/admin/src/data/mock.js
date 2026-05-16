export const users = [
  { id: 1, name: "أحمد الحربي", phone: "555123456", role: "tenant", joinedAt: "2026-01-15", bookingsCount: 4 },
  { id: 2, name: "سارة القحطاني", phone: "555654321", role: "lessor", joinedAt: "2026-01-20", assetsCount: 6 },
  { id: 4, name: "فاطمة الزهراني", phone: "555111222", role: "tenant", joinedAt: "2026-02-10", bookingsCount: 2 },
  { id: 5, name: "عمر الشمري", phone: "555333444", role: "lessor", joinedAt: "2026-03-05", assetsCount: 3 },
];

export const assets = [
  { id: 1, ownerName: "سارة القحطاني", title: "حفار صغير", pricePerDay: 150, city: "الرياض", status: "available", bookingsCount: 5 },
  { id: 2, ownerName: "سارة القحطاني", title: "شاحنة نقل", pricePerDay: 250, city: "جدة", status: "available", bookingsCount: 3 },
  { id: 3, ownerName: "سارة القحطاني", title: "مولد كهربائي", pricePerDay: 80, city: "مكة", status: "rented", bookingsCount: 8 },
  { id: 4, ownerName: "سارة القحطاني", title: "خلاطة خرسانة", pricePerDay: 120, city: "الرياض", status: "available", bookingsCount: 2 },
  { id: 5, ownerName: "سارة القحطاني", title: "رافعة برجية", pricePerDay: 500, city: "الدمام", status: "maintenance", bookingsCount: 1 },
  { id: 6, ownerName: "عمر الشمري", title: "منشار كهربائي", pricePerDay: 40, city: "المدينة المنورة", status: "available", bookingsCount: 0 },
];

export const bookings = [
  { id: 1, assetTitle: "حفار صغير", assetId: 1, tenantName: "أحمد الحربي", startDate: "2026-05-20", endDate: "2026-05-25", totalPrice: 750, status: "pending" },
  { id: 2, assetTitle: "شاحنة نقل", assetId: 2, tenantName: "أحمد الحربي", startDate: "2026-05-18", endDate: "2026-05-20", totalPrice: 500, status: "approved" },
  { id: 3, assetTitle: "مولد كهربائي", assetId: 3, tenantName: "أحمد الحربي", startDate: "2026-05-10", endDate: "2026-05-15", totalPrice: 400, status: "completed" },
  { id: 4, assetTitle: "خلاطة خرسانة", assetId: 4, tenantName: "أحمد الحربي", startDate: "2026-06-01", endDate: "2026-06-05", totalPrice: 600, status: "rejected" },
  { id: 5, assetTitle: "مولد كهربائي", assetId: 3, tenantName: "فاطمة الزهراني", startDate: "2026-05-22", endDate: "2026-05-25", totalPrice: 240, status: "active" },
];

export const statusLabels = {
  pending: "قيد الانتظار", approved: "تمت الموافقة", rejected: "مرفوض",
  active: "نشط", completed: "مكتمل", expired: "منتهي",
};

export const statusColors = {
  pending: "bg-accent/10 text-accent ring-1 ring-accent/30",
  approved: "bg-primary/10 text-primary ring-1 ring-primary/30",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
  active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  completed: "bg-gray-brand/10 text-gray-brand ring-1 ring-gray-brand/30",
  expired: "bg-gray-50 text-gray-400 ring-1 ring-gray-200",
};

export const stats = {
  totalUsers: 4, totalAssets: 6, totalBookings: 5,
  activeRentals: 1, revenue: 2490,
  pendingBookings: 1,
};

export const revenueByMonth = [
  { month: "يناير", bookings: 0, revenue: 0 },
  { month: "فبراير", bookings: 0, revenue: 0 },
  { month: "مارس", bookings: 1, revenue: 750 },
  { month: "أبريل", bookings: 2, revenue: 1000 },
  { month: "مايو", bookings: 2, revenue: 740 },
  { month: "يونيو", bookings: 0, revenue: 0 },
];

export const assetDetails = {
  1: { ownerId: 2, description: "حفار صغير للإيجار بحالة ممتازة، مناسب لأعمال البناء والحفر", category: "معدات ثقيلة", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&auto=format" },
  2: { ownerId: 2, description: "شاحنة لنقل المواد والبضائع، حمولة تصل إلى 5 أطنان", category: "مركبات", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&auto=format" },
  3: { ownerId: 2, description: "مولد كهربائي 20 كيلوواط، مناسب للمنشآت والفعاليات", category: "معدات كهربائية", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop&auto=format" },
  4: { ownerId: 2, description: "خلاطة خرسانة بحالة جيدة، مناسبة لمشاريع البناء", category: "معدات بناء", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop&auto=format" },
  5: { ownerId: 2, description: "رافعة برجية للأعمال الشاهقة، بارتفاع 30 متراً", category: "معدات ثقيلة", image: "https://images.unsplash.com/photo-1541888946425-d81bb4b8e605?w=400&h=300&fit=crop&auto=format" },
  6: { ownerId: 5, description: "منشار كهربائي احترافي لقطع الأخشاب والمعادن", category: "أدوات يدوية", image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop&auto=format" },
};
