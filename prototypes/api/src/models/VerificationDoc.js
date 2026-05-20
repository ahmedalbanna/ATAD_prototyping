import { randomUUID } from "node:crypto";
import { query } from "../config/database.js";

export function findByUser(userId) {
  const result = query(
    "SELECT * FROM verification_documents WHERE user_id = ? ORDER BY created_at ASC",
    [userId],
  );
  return result.rows;
}

export function create(data) {
  const id = randomUUID();
  query(
    "INSERT INTO verification_documents (id, user_id, doc_type, image_url) VALUES (?, ?, ?, ?)",
    [id, data.user_id, data.doc_type, data.image_url],
  );
  return { id, ...data };
}

export function removeByUser(userId) {
  query("DELETE FROM verification_documents WHERE user_id = ?", [userId]);
}
