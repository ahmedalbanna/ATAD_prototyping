import { randomUUID } from "node:crypto";
import { query, exec } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.js";
import * as BookingModel from "../models/Booking.js";

export function processPayment(bookingId, method, userId) {
  const booking = BookingModel.findById(bookingId);
  if (!booking) throw new AppError(404, "NOT_FOUND", "الحجز غير موجود");
  if (booking.status !== "approved") throw new AppError(400, "VALIDATION_ERROR", "الحجز غير جاهز للدفع");
  if (booking.tenant_id !== userId) throw new AppError(403, "FORBIDDEN", "لا تملك صلاحية الدفع لهذا الحجز");

  const paymentId = randomUUID();
  const reference = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;

  query(
    `INSERT INTO payments (id, booking_id, amount, method, status, reference, paid_at)
     VALUES (?, ?, ?, ?, 'paid', ?, datetime('now'))`,
    [paymentId, bookingId, booking.total_price, method, reference],
  );

  BookingModel.updateStatus(bookingId, "active");
  BookingModel.insertStatusHistory(bookingId, booking.status, "active", userId, "تم الدفع");

  return {
    id: paymentId,
    booking_id: bookingId,
    amount: booking.total_price,
    method,
    status: "paid",
    reference,
    paid_at: new Date().toISOString(),
  };
}

export function getRevenueByMonth() {
  const rows = query(`
    SELECT
      strftime('%m', paid_at) AS month_num,
      strftime('%Y', paid_at) AS year,
      COUNT(*) AS bookings,
      COALESCE(SUM(amount), 0) AS revenue
    FROM payments
    WHERE status = 'paid'
    GROUP BY year, month_num
    ORDER BY year DESC, month_num DESC
    LIMIT 6
  `).rows;

  const monthNames = {
    "01": "يناير", "02": "فبراير", "03": "مارس", "04": "أبريل",
    "05": "مايو", "06": "يونيو", "07": "يوليو", "08": "أغسطس",
    "09": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر",
  };

  return rows.map(r => ({
    month: monthNames[r.month_num] || r.month_num,
    bookings: r.bookings,
    revenue: parseFloat(r.revenue),
  }));
}

export function getRevenueStats() {
  const result = query(`
    SELECT
      COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS total_revenue,
      COUNT(*) AS total_payments
    FROM payments WHERE status = 'paid'
  `).rows[0];

  const bookingCount = query("SELECT COUNT(*) AS count FROM bookings").rows[0].count;
  const avgValue = result.total_payments > 0 ? parseFloat(result.total_revenue) / result.total_payments : 0;

  return {
    total_revenue: parseFloat(result.total_revenue),
    total_bookings: bookingCount,
  };
}
