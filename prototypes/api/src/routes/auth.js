import { Router } from "express";
import * as AuthService from "../services/auth.js";

const router = Router();

router.post("/send-otp", async (req, res, next) => {
  try {
    const { phone, role, name } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "رقم الجوال مطلوب" } });
    if (!role) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "نوع المستخدم مطلوب" } });
    if (!["tenant", "lessor"].includes(role)) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "نوع المستخدم غير صالح" } });

    const result = await AuthService.sendOtp(phone, role, name);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "رقم الجوال ورمز التحقق مطلوبان" } });

    const result = await AuthService.verifyOtp(phone, otp);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
