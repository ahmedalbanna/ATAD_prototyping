import { randomUUID } from "node:crypto";
import { query } from "../config/database.js";

export function findByPhone(phone) {
  const result = query("SELECT * FROM users WHERE phone = ?", [phone]);
  return result.rows[0] || null;
}

export function findByEmail(email) {
  const result = query("SELECT * FROM users WHERE email = ?", [email]);
  return result.rows[0] || null;
}

export function findById(id) {
  const result = query("SELECT * FROM users WHERE id = ?", [id]);
  return result.rows[0] || null;
}

export function create(data) {
  const id = randomUUID();
  query(
    "INSERT INTO users (id, name, phone, role, email, password) VALUES (?, ?, ?, ?, ?, ?)",
    [id, data.name, data.phone, data.role, data.email || null, data.password || null],
  );
  return findById(id);
}

export function updateOtp(userId, otpCode, expiresAt) {
  query(
    "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
    [otpCode, expiresAt, userId],
  );
}

export function updateUser(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) { fields.push("name=?"); params.push(data.name); }
  if (data.phone !== undefined) { fields.push("phone=?"); params.push(data.phone); }
  if (data.role !== undefined) { fields.push("role=?"); params.push(data.role); }
  if (data.email !== undefined) { fields.push("email=?"); params.push(data.email); }
  if (data.password !== undefined) { fields.push("password=?"); params.push(data.password); }

  if (fields.length === 0) return findById(id);

  fields.push("updated_at=datetime('now')");
  params.push(id);

  query(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, params);
  return findById(id);
}

export function deleteUser(id) {
  query("DELETE FROM users WHERE id=?", [id]);
}

export function findByRole(role) {
  const result = query("SELECT * FROM users WHERE role = ? ORDER BY created_at DESC", [role]);
  return result.rows;
}

export function findAll(search, role) {
  let sql = "SELECT * FROM users WHERE 1=1";
  const params = [];

  if (role) {
    sql += " AND role = ?";
    params.push(role);
  }
  if (search) {
    sql += " AND (name LIKE ? OR phone LIKE ?)";
    const p = `%${search}%`;
    params.push(p, p);
  }
  sql += " ORDER BY created_at DESC";

  const result = query(sql, params);
  return result.rows;
}
