import { Router } from "express";
import * as AuthService from "../services/auth.js";

const router = Router();

router.post("/send-otp", async (req, res, next) => {
  try {
    const { phone, role, name } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "رقم الجوال مطلوب" } });
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 12) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "رقم الجوال يجب أن يكون 12 رقم (مفتاح الدولة + 9 أرقام)" } });
    if (!role) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "نوع المستخدم مطلوب" } });
    if (!["tenant", "lessor", "admin"].includes(role)) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "نوع المستخدم غير صالح" } });

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
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.post("/admin-login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "البريد الإلكتروني وكلمة المرور مطلوبان" } });

    const result = await AuthService.adminLogin(email, password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
