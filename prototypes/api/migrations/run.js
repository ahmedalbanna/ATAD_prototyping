import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "../src/config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const files = fs.readdirSync(__dirname)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, file), "utf8");
    exec(sql);
    console.log(`Migration ${file} applied successfully`);
  }
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
}
