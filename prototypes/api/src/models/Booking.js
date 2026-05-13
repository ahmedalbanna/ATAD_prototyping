import { randomUUID } from "node:crypto";
import { query } from "../config/database.js";

export const BOOKING_STATUSES = ["pending", "approved", "rejected", "active", "completed"];

export function findAll(filters = {}) {
  let sql = `
    SELECT b.*, a.title AS asset_title, a.image_url AS asset_image,
           u.name AS tenant_name
    FROM bookings b
    JOIN assets a ON b.asset_id = a.id
    JOIN users u ON b.tenant_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.status && filters.status !== "all") {
    sql += " AND b.status = ?";
    params.push(filters.status);
  }
  if (filters.tenant_id) {
    sql += " AND b.tenant_id = ?";
    params.push(filters.tenant_id);
  }
  if (filters.asset_id) {
    sql += " AND b.asset_id = ?";
    params.push(filters.asset_id);
  }
  if (filters.search) {
    sql += " AND (a.title LIKE ? OR u.name LIKE ?)";
    const p = `%${filters.search}%`;
    params.push(p, p);
  }

  sql += " ORDER BY b.created_at DESC";

  const limit = Math.min(parseInt(filters.limit) || 50, 100);
  const offset = ((parseInt(filters.page) || 1) - 1) * limit;
  sql += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const result = query(sql, params);
  return result.rows;
}

export function findById(id) {
  const sql = `
    SELECT b.*, a.title AS asset_title, a.image_url AS asset_image, a.description AS asset_description,
           u.name AS tenant_name
    FROM bookings b
    JOIN assets a ON b.asset_id = a.id
    JOIN users u ON b.tenant_id = u.id
    WHERE b.id = ?
  `;
  const result = query(sql, [id]);
  return result.rows[0] || null;
}

export function findByAssetAndPeriod(assetId, startDate, endDate, excludeBookingId) {
  let sql = `
    SELECT * FROM bookings
    WHERE asset_id = ? AND status IN ('pending', 'approved', 'active')
    AND start_date <= ? AND end_date >= ?
  `;
  const params = [assetId, endDate, startDate];

  if (excludeBookingId) {
    sql += " AND id != ?";
    params.push(excludeBookingId);
  }

  const result = query(sql, params);
  return result.rows;
}

export function create(data) {
  const id = randomUUID();
  query(
    `INSERT INTO bookings (id, asset_id, tenant_id, start_date, end_date, total_price, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [id, data.asset_id, data.tenant_id, data.start_date, data.end_date, data.total_price],
  );
  insertStatusHistory(id, null, "pending", data.tenant_id);
  return findById(id);
}

export function updateStatus(id, status) {
  query("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
}

export function findByAssetOwner(ownerId) {
  const sql = `
    SELECT b.*, a.title AS asset_title, a.image_url AS asset_image,
           u.name AS tenant_name
    FROM bookings b
    JOIN assets a ON b.asset_id = a.id
    JOIN users u ON b.tenant_id = u.id
    WHERE a.owner_id = ?
    ORDER BY b.created_at DESC
  `;
  const result = query(sql, [ownerId]);
  return result.rows;
}

export function insertStatusHistory(bookingId, fromStatus, toStatus, changedBy, reason) {
  query(
    "INSERT INTO booking_status_history (id, booking_id, from_status, to_status, changed_by, reason) VALUES (?, ?, ?, ?, ?, ?)",
    [randomUUID(), bookingId, fromStatus, toStatus, changedBy, reason || null],
  );
}

export function getStatusHistory(bookingId) {
  const result = query(
    "SELECT * FROM booking_status_history WHERE booking_id = ? ORDER BY created_at ASC",
    [bookingId],
  );
  return result.rows;
}
