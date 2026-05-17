export const categories = [
  "الكل", "أجهزة تقنية", "أجهزة محمولة", "شاشات", "طابعات", "خوادم", "برمجيات"
];

export const assetStatusLabels = { available: "متاح", rented: "مؤجر", maintenance: "صيانة" };
export const assetStatusColors = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rented: "bg-amber-50 text-amber-700 border-amber-200",
  maintenance: "bg-red-50 text-red-700 border-red-200",
};

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
