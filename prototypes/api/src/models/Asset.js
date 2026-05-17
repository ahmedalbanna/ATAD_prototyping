import { randomUUID } from "node:crypto";
import { query } from "../config/database.js";

export const ASSET_STATUSES = ["available", "rented", "maintenance"];
export const CATEGORIES = [
  "الكل",
  "أجهزة تقنية",
  "أجهزة محمولة",
  "شاشات",
  "طابعات",
  "خوادم",
  "برمجيات",
];

export function findAll(filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.category && filters.category !== "الكل") {
    conditions.push("a.category = ?");
    params.push(filters.category);
  }
  if (filters.city) {
    conditions.push("a.city = ?");
    params.push(filters.city);
  }
  if (filters.status) {
    conditions.push("a.status = ?");
    params.push(filters.status);
  }
  if (filters.owner_id) {
    conditions.push("a.owner_id = ?");
    params.push(filters.owner_id);
  }
  if (filters.search) {
    conditions.push("(a.title LIKE ? OR a.description LIKE ? OR a.city LIKE ?)");
    const pattern = `%${filters.search}%`;
    params.push(pattern, pattern, pattern);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  let orderBy = "a.created_at DESC";
  if (filters.sort_by === "price_asc") orderBy = "a.price_per_day ASC";
  else if (filters.sort_by === "price_desc") orderBy = "a.price_per_day DESC";
  else if (filters.sort_by === "rating") orderBy = "a.rating DESC";

  const limit = Math.min(parseInt(filters.limit) || 20, 50);
  const offset = ((parseInt(filters.page) || 1) - 1) * limit;

  const countResult = query(`SELECT COUNT(*) AS count FROM assets a ${where}`, params);
  const total = countResult.rows[0].count;

  const sql = `
    SELECT a.*, u.name AS owner_name
    FROM assets a
    JOIN users u ON a.owner_id = u.id
    ${where}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;
  const result = query(sql, [...params, limit, offset]);
  return { rows: result.rows, total, page: parseInt(filters.page) || 1, limit };
}

export function findById(id) {
  const sql = `
    SELECT a.*, u.name AS owner_name, u.phone AS owner_phone
    FROM assets a
    JOIN users u ON a.owner_id = u.id
    WHERE a.id = ?
  `;
  const result = query(sql, [id]);
  return result.rows[0] || null;
}

export function create(data) {
  const sql = `
    INSERT INTO assets (id, owner_id, title, description, category, price_per_day, city, image_url, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const id = randomUUID();
  query(sql, [id, data.owner_id, data.title, data.description, data.category, data.price_per_day, data.city, data.image_url, data.status || "available"]);
  return findById(id);
}

export function update(id, data) {
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(data)) {
    if (["title", "description", "category", "price_per_day", "city", "image_url", "status"].includes(key)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
  }

  if (fields.length === 0) return null;

  const sql = `UPDATE assets SET ${fields.join(", ")}, updated_at = datetime('now') WHERE id = ?`;
  query(sql, [...params, id]);
  return findById(id);
}

export function updateStatus(id, status, ownerId) {
  const sql = `UPDATE assets SET status = ?, updated_at = datetime('now') WHERE id = ? AND owner_id = ?`;
  query(sql, [status, id, ownerId]);
  return findById(id);
}

export function remove(id, ownerId) {
  const bookingIds = query(`SELECT id FROM bookings WHERE asset_id = ?`, [id]).rows.map(r => r.id);
  for (const bid of bookingIds) {
    query(`DELETE FROM booking_status_history WHERE booking_id = ?`, [bid]);
    query(`DELETE FROM payments WHERE booking_id = ?`, [bid]);
    query(`DELETE FROM ratings WHERE booking_id = ?`, [bid]);
    query(`DELETE FROM notifications WHERE booking_id = ?`, [bid]);
    query(`DELETE FROM transactions WHERE booking_id = ?`, [bid]);
  }
  query(`DELETE FROM bookings WHERE asset_id = ?`, [id]);
  query(`DELETE FROM ratings WHERE asset_id = ?`, [id]);
  const sql = `DELETE FROM assets WHERE id = ? AND owner_id = ?`;
  const result = query(sql, [id, ownerId]);
  return result.rowCount > 0;
}
