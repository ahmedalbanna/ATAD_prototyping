import { randomUUID } from "node:crypto";
import { query } from "../config/database.js";

export function findByUser(userId, unreadOnly = false) {
  let sql = "SELECT * FROM notifications WHERE user_id = ?";
  const params = [userId];
  if (unreadOnly) { sql += " AND is_read = 0"; }
  sql += " ORDER BY created_at DESC";
  const result = query(sql, params);
  return result.rows;
}

export function create(data) {
  const id = randomUUID();
  query(
    "INSERT INTO notifications (id, user_id, type, title, message, booking_id) VALUES (?, ?, ?, ?, ?, ?)",
    [id, data.user_id, data.type, data.title, data.message, data.booking_id || null],
  );
  return findById(id);
}

export function findById(id) {
  const result = query("SELECT * FROM notifications WHERE id = ?", [id]);
  return result.rows[0] || null;
}

export function markRead(id) {
  query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
}

export function markAllRead(userId) {
  query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [userId]);
}

export function getUnreadCount(userId) {
  const result = query("SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0", [userId]);
  return result.rows[0].count;
}
