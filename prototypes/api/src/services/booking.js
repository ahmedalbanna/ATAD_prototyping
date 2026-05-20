import * as BookingModel from "../models/Booking.js";
import * as AssetModel from "../models/Asset.js";
import * as UserModel from "../models/User.js";
import * as TransactionModel from "../models/Transaction.js";
import * as NotificationModel from "../models/Notification.js";
import { AppError } from "../middleware/errorHandler.js";

const VALID_TRANSITIONS = {
  pending: { tenant: ["rejected"], lessor: ["approved", "rejected"], admin: ["approved", "rejected"] },
  approved: { tenant: ["rejected"], lessor: [], admin: [] },
  active: { tenant: [], lessor: ["completed"], admin: ["completed"] },
  completed: { tenant: [], lessor: [], admin: [] },
  rejected: { tenant: [], lessor: [], admin: [] },
};

export function listBookings(filters) {
  return BookingModel.findAll(filters).map(formatBooking);
}

export function getBooking(id) {
  const booking = BookingModel.findById(id);
  if (!booking) throw new AppError(404, "NOT_FOUND", "الحجز غير موجود");
  const history = BookingModel.getStatusHistory(id);
  return { ...formatBooking(booking), status_history: history };
}

export function getLessorBookings(ownerId) {
  return BookingModel.findByAssetOwner(ownerId).map(formatBooking);
}

export async function createBooking(data) {
  const asset = AssetModel.findById(data.asset_id);
  if (!asset) throw new AppError(404, "NOT_FOUND", "الأصل غير موجود");
  if (asset.status !== "available") throw new AppError(400, "VALIDATION_ERROR", "الأصل غير متاح للتأجير");

  const tenant = UserModel.findById(data.tenant_id);
  if (!tenant) throw new AppError(404, "NOT_FOUND", "المستخدم غير موجود");
  if (tenant.verified !== "verified") throw new AppError(403, "VERIFICATION_REQUIRED", "يجب توثيق الحساب أولاً قبل التأجير");

  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  if (end <= start) throw new AppError(400, "VALIDATION_ERROR", "تاريخ النهاية يجب أن يكون بعد تاريخ البداية");

  const overlapping = BookingModel.findByAssetAndPeriod(data.asset_id, data.start_date, data.end_date);
  if (overlapping.length > 0) throw new AppError(409, "CONFLICT", "الأصل محجوز بالفعل لهذه الفترة");

  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = days * parseFloat(asset.price_per_day);

  const booking = BookingModel.create({
    asset_id: data.asset_id,
    tenant_id: data.tenant_id,
    start_date: data.start_date,
    end_date: data.end_date,
    total_price: totalPrice,
  });

  // Notify asset owner
  try {
    NotificationModel.create({
      user_id: asset.owner_id,
      type: "booking_status",
      title: "طلب تأجير جديد",
      message: `تم تقديم طلب تأجير ${asset.title}.`,
      booking_id: booking.id,
    });
  } catch {}

  return formatBooking(booking);
}

export function transitionStatus(bookingId, newStatus, actor) {
  const booking = BookingModel.findById(bookingId);
  if (!booking) throw new AppError(404, "NOT_FOUND", "الحجز غير موجود");

  const allowed = VALID_TRANSITIONS[booking.status]?.[actor.role];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new AppError(403, "FORBIDDEN", "لا يمكن تغيير حالة الحجز إلى " + newStatus);
  }

  if (["approved", "rejected"].includes(newStatus)) {
    const asset = AssetModel.findById(booking.asset_id);
    if (asset) {
      AssetModel.updateStatus(booking.asset_id, newStatus === "approved" ? "rented" : "available", asset.owner_id);
    }
  }

  BookingModel.updateStatus(bookingId, newStatus);
  BookingModel.insertStatusHistory(bookingId, booking.status, newStatus, actor.id);

  // Notify tenant on lessor decision
  if (actor.role === "lessor" || actor.role === "admin") {
    try {
      if (newStatus === "approved") {
        NotificationModel.create({
          user_id: booking.tenant_id,
          type: "booking_status",
          title: "تمت الموافقة على طلبك",
          message: `تمت الموافقة على طلب تأجير ${booking.asset_title}. يرجى إتمام الدفع لتأكيد الحجز.`,
          booking_id: bookingId,
        });
      } else if (newStatus === "rejected") {
        NotificationModel.create({
          user_id: booking.tenant_id,
          type: "booking_status",
          title: "تم رفض الطلب",
          message: `عذراً، تم رفض طلب تأجير ${booking.asset_title}.`,
          booking_id: bookingId,
        });
      }
    } catch {}
  }

  // Notify tenant on lessor completion
  if (newStatus === "completed") {
    const asset = AssetModel.findById(booking.asset_id);
    if (asset) {
      const days = Math.ceil(
        (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24),
      );
      TransactionModel.create({
        booking_id: bookingId,
        lessor_id: asset.owner_id,
        asset_title: asset.title,
        tenant_name: booking.tenant_name,
        amount: booking.total_price,
        days,
        status: "completed",
      });
      AssetModel.updateStatus(booking.asset_id, "available", asset.owner_id);
      try {
        NotificationModel.create({
          user_id: booking.tenant_id,
          type: "booking_status",
          title: "تم إنهاء التأجير",
          message: `تم إنهاء تأجير ${asset.title}. شكراً لتعاملك مع عتاد.`,
          booking_id: bookingId,
        });
      } catch {}
    }
  }

  return getBooking(bookingId);
}

export function cancelAsTenant(bookingId, tenantId) {
  const booking = BookingModel.findById(bookingId);
  if (!booking) throw new AppError(404, "NOT_FOUND", "الحجز غير موجود");
  if (booking.tenant_id !== tenantId) throw new AppError(403, "FORBIDDEN", "لا تملك صلاحية إلغاء هذا الحجز");
  if (!["pending", "approved"].includes(booking.status)) {
    throw new AppError(400, "VALIDATION_ERROR", "لا يمكن إلغاء الحجز في هذه الحالة");
  }

  BookingModel.updateStatus(bookingId, "rejected");
  BookingModel.insertStatusHistory(bookingId, booking.status, "rejected", tenantId, "إلغاء من المستأجر");

  const asset = AssetModel.findById(booking.asset_id);
  if (asset && booking.status === "approved") {
    AssetModel.updateStatus(booking.asset_id, "available", asset.owner_id);
  }

  // Notify lessor
  if (asset) {
    try {
      NotificationModel.create({
        user_id: asset.owner_id,
        type: "booking_status",
        title: "تم إلغاء الطلب",
        message: `تم إلغاء طلب تأجير ${asset.title} من قبل المستأجر.`,
        booking_id: bookingId,
      });
    } catch {}
  }

  return getBooking(bookingId);
}

function formatBooking(row) {
  return {
    id: row.id,
    asset: { id: row.asset_id, title: row.asset_title, image_url: row.asset_image, description: row.asset_description },
    tenant: { id: row.tenant_id, name: row.tenant_name },
    start_date: row.start_date,
    end_date: row.end_date,
    total_price: parseFloat(row.total_price),
    status: row.status,
    payment_status: row.payment_status,
    created_at: row.created_at,
  };
}
