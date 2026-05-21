import { Router } from "express";
import * as UserModel from "../models/User.js";
import * as VerificationDocModel from "../models/VerificationDoc.js";
import { authenticate } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { query } from "../config/database.js";

const router = Router();

// Request verification (user sets their status to 'pending')
router.post("/me/verification", authenticate, async (req, res, next) => {
  try {
    const user = UserModel.findById(req.user.id);
    if (!user) throw new AppError(404, "NOT_FOUND", "المستخدم غير موجود");
    if (user.verified === "verified") {
      return res.json({ success: true, data: { verified: "verified" }, message: "حسابك موثّق بالفعل" });
    }
    if (user.verified === "pending") {
      return res.json({ success: true, data: { verified: "pending" }, message: "طلب التوثيق قيد المراجعة" });
    }

    const { documents } = req.body;
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      throw new AppError(400, "VALIDATION_ERROR", "يرجى رفع صورة الهوية الوطنية");
    }

    // Remove old docs and insert new ones
    VerificationDocModel.removeByUser(req.user.id);
    for (const doc of documents) {
      VerificationDocModel.create({
        user_id: req.user.id,
        doc_type: doc.doc_type || "other",
        image_url: doc.image_url,
      });
    }

    UserModel.updateUser(req.user.id, { verified: "pending" });
    res.json({ success: true, data: { verified: "pending" }, message: "تم تقديم طلب التوثيق" });
  } catch (err) {
    next(err);
  }
});

// Get current user profile (with verification status)
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = UserModel.findById(req.user.id);
    if (!user) throw new AppError(404, "NOT_FOUND", "المستخدم غير موجود");
    const { otp_code: _otp, otp_expires_at: _exp, password: _pw, ...safe } = user;
    res.json({ success: true, data: safe });
  } catch (err) {
    next(err);
  }
});

// Get user verification documents
router.get("/me/verification-docs", authenticate, async (req, res, next) => {
  try {
    const docs = VerificationDocModel.findByUser(req.user.id);
    res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
});

// Update current user profile (name, phone)
router.put("/me", authenticate, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name !== undefined) {
      if (!name.trim()) throw new AppError(400, "VALIDATION_ERROR", "الاسم لا يمكن أن يكون فارغاً");
      updates.name = name.trim();
    }
    if (phone !== undefined) {
      if (!phone.trim()) throw new AppError(400, "VALIDATION_ERROR", "رقم الجوال لا يمكن أن يكون فارغاً");
      const digits = phone.replace(/\D/g, "");
      if (digits.length !== 12) throw new AppError(400, "VALIDATION_ERROR", "رقم الجوال يجب أن يكون 12 رقم (مفتاح الدولة + 9 أرقام)");
      const existing = UserModel.findByPhone(phone);
      if (existing && existing.id !== req.user.id) throw new AppError(409, "CONFLICT", "رقم الجوال مستخدم بالفعل");
      updates.phone = phone.trim();
    }
    if (Object.keys(updates).length === 0) {
      const user = UserModel.findById(req.user.id);
      const { otp_code: _otp, otp_expires_at: _exp, password: _pw, ...safe } = user;
      return res.json({ success: true, data: safe });
    }
    const updated = UserModel.updateUser(req.user.id, updates);
    const { otp_code: _otp, otp_expires_at: _exp, password: _pw, ...safe } = updated;
    res.json({ success: true, data: safe });
  } catch (err) {
    next(err);
  }
});

// Get user stats (rating, transactions count)
router.get("/me/stats", authenticate, async (req, res, next) => {
  try {
    const rating = query(
      "SELECT COALESCE(AVG(r.score), 0) AS avg_score, COUNT(*) AS total_ratings FROM ratings r WHERE r.tenant_id = ?",
      [req.user.id],
    ).rows[0];

    const completedBookings = query(
      "SELECT COUNT(*) AS count FROM bookings WHERE tenant_id = ? AND status = 'completed'",
      [req.user.id],
    ).rows[0].count;

    const totalBookings = query(
      "SELECT COUNT(*) AS count FROM bookings WHERE tenant_id = ?",
      [req.user.id],
    ).rows[0].count;

    res.json({
      success: true,
      data: {
        rating: parseFloat(rating.avg_score),
        total_ratings: rating.total_ratings,
        completed_bookings: completedBookings,
        total_bookings: totalBookings,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
