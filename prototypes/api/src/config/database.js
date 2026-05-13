import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH || path.resolve("data/atad.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function query(sql, params = []) {
  const trimmed = sql.trim().toUpperCase();
  const isSelect = trimmed.startsWith("SELECT") || trimmed.startsWith("WITH") || trimmed.startsWith("PRAGMA");

  const stmt = db.prepare(sql);
  if (isSelect) {
    const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
    return { rows, rowCount: rows.length };
  } else {
    const info = params.length > 0 ? stmt.run(...params) : stmt.run();
    return { rows: [], rowCount: info.changes, lastInsertRowid: info.lastInsertRowid };
  }
}

// For multi-statement execution (migrations, seeds)
export function exec(sql) {
  return db.exec(sql);
}

export default db;
