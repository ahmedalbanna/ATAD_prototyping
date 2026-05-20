import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
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

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

const router = Router();

router.post("/", authenticate, async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: { code: "UPLOAD_ERROR", message: err.message } });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: { code: "NO_FILE", message: "يرجى اختيار صورة" } });
    }

    try {
      const { probe } = await import("probe-image-size");
      const filePath = req.file.path;
      const input = fs.createReadStream(filePath);
      const dimensions = await probe(input);
      input.destroy();

      if (dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT) {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          success: false,
          error: {
            code: "IMAGE_TOO_SMALL",
            message: `الصورة صغيرة جداً. الحد الأدنى ${MIN_WIDTH}×${MIN_HEIGHT} بكسل`,
            details: { width: dimensions.width, height: dimensions.height, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT },
          },
        });
      }

      const url = `/uploads/${req.file.filename}`;
      res.json({ success: true, data: { url } });
    } catch (checkErr) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: { code: "IMAGE_CHECK_FAILED", message: "تعذر التحقق من أبعاد الصورة" } });
    }
  });
});

export default router;
