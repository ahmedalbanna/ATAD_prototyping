import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "../src/config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const sql = fs.readFileSync(path.join(__dirname, "001_demo_data.sql"), "utf8");
  exec(sql);
  console.log("Seed 001_demo_data.sql applied successfully");
} catch (err) {
  console.error("Seed failed:", err.message);
  process.exit(1);
}
