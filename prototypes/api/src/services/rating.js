import { randomUUID } from "node:crypto";
import { query } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.js";
import * as BookingModel from "../models/Booking.js";

export function createRating(data, tenantId) {
  const booking = BookingModel.findById(data.booking_id);
  if (!booking) throw new AppError(404, "NOT_FOUND", "الحجز غير موجود");
  if (booking.status !== "completed") throw new AppError(400, "VALIDATION_ERROR", "لا يمكن تقييم حجز غير مكتمل");
  if (booking.tenant_id !== tenantId) throw new AppError(403, "FORBIDDEN", "لا تملك صلاحية تقييم هذا الحجز");

  const existing = query("SELECT id FROM ratings WHERE booking_id = ?", [data.booking_id]).rows[0];
  if (existing) throw new AppError(409, "CONFLICT", "تم تقييم هذا الحجز مسبقاً");

  const id = randomUUID();
  query(
    "INSERT INTO ratings (id, booking_id, asset_id, tenant_id, score, comment) VALUES (?, ?, ?, ?, ?, ?)",
    [id, data.booking_id, booking.asset_id, tenantId, data.score, data.comment || null],
  );

  const avg = query(
    "SELECT COALESCE(AVG(CAST(score AS REAL)), 0) AS avg_rating FROM ratings WHERE asset_id = ?",
    [booking.asset_id],
  ).rows[0].avg_rating;

  query("UPDATE assets SET rating = ? WHERE id = ?", [Math.round(avg * 2) / 2, booking.asset_id]);

  return { id, booking_id: data.booking_id, score: data.score, comment: data.comment };
}
