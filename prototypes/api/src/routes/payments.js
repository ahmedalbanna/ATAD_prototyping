import { Router } from "express";
import * as PaymentService from "../services/payment.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, requireRole("tenant"), async (req, res, next) => {
  try {
    const { booking_id, method } = req.body;
    if (!booking_id || !method) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "معرف الحجز وطريقة الدفع مطلوبان" } });

    const result = await PaymentService.processPayment(booking_id, method, req.user.id);
    res.json({ success: true, data: result, booking_status: "active" });
  } catch (err) {
    next(err);
  }
});

export default router;
