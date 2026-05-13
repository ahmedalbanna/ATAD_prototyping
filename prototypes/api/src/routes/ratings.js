import { Router } from "express";
import * as RatingService from "../services/rating.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, requireRole("tenant"), async (req, res, next) => {
  try {
    const { booking_id, score, comment } = req.body;
    if (!booking_id || !score || score < 1 || score > 5) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "بيانات التقييم غير صالحة" } });
    }
    const rating = await RatingService.createRating({ booking_id, score, comment }, req.user.id);
    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    next(err);
  }
});

export default router;
