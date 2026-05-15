import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { authenticate } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

const router = Router();

router.post("/", authenticate, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: { code: "UPLOAD_ERROR", message: err.message } });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: { code: "NO_FILE", message: "يرجى اختيار صورة" } });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url } });
  });
});

export default router;
