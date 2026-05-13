import { randomUUID } from "node:crypto";
import { query } from "../config/database.js";

export function create(data) {
  const id = randomUUID();
  query(
    `INSERT INTO transactions (id, booking_id, lessor_id, asset_title, tenant_name, amount, status, days)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.booking_id, data.lessor_id, data.asset_title, data.tenant_name, data.amount, data.status, data.days],
  );
  return findById(id);
}

export function findById(id) {
  const result = query("SELECT * FROM transactions WHERE id = ?", [id]);
  return result.rows[0] || null;
}

export function findByLessor(lessorId) {
  const result = query(
    "SELECT * FROM transactions WHERE lessor_id = ? ORDER BY created_at DESC",
    [lessorId],
  );
  return result.rows;
}

export function findAll() {
  const result = query("SELECT * FROM transactions ORDER BY created_at DESC");
  return result.rows;
}

export function getStats() {
  const result = query(`
    SELECT
      COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS collected,
      COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS pending_amount
    FROM transactions
  `);
  return result.rows[0];
}
