import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as UserModel from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const DEV_OTP = process.env.DEV_OTP || "000000";

export async function sendOtp(phone, role, name) {
  let user = UserModel.findByPhone(phone);

  if (!user) {
    if (!name) throw new AppError(400, "VALIDATION_ERROR", "الاسم مطلوب للتسجيل");
    user = UserModel.create({ name, phone, role });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  UserModel.updateOtp(user.id, code, expiresAt);
  console.log(`[OTP] User ${user.phone}: code=${code}`);

  return { success: true, message: "تم إرسال رمز التحقق", expires_in: 300 };
}

export async function verifyOtp(phone, otp) {
  const user = UserModel.findByPhone(phone);
  if (!user) throw new AppError(401, "UNAUTHORIZED", "رقم الجوال غير مسجل");

  // Allow development OTP for testing
  if (otp !== DEV_OTP && user.otp_code !== otp) throw new AppError(400, "VALIDATION_ERROR", "رمز التحقق غير صحيح");
  if (user.otp_expires_at && new Date(user.otp_expires_at) < new Date()) {
    throw new AppError(400, "VALIDATION_ERROR", "انتهت صلاحية رمز التحقق");
  }

  UserModel.updateOtp(user.id, null, null);

  const token = jwt.sign(
    { id: user.id, phone: user.phone, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return {
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
  };
}

export async function adminLogin(email, password) {
  const user = UserModel.findByEmail(email);
  if (!user) throw new AppError(401, "UNAUTHORIZED", "البريد الإلكتروني غير مسجل");

  if (user.role !== "admin") throw new AppError(403, "FORBIDDEN", "ليس لديك صلاحية الدخول");

  const valid = await bcrypt.compare(password, user.password || "");
  if (!valid) throw new AppError(400, "VALIDATION_ERROR", "كلمة المرور غير صحيحة");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
