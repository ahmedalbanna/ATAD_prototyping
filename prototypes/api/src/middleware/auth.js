import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "يرجى تسجيل الدخول أولاً");
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "الجلسة غير صالحة أو منتهية");
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, "FORBIDDEN", "لا تملك الصلاحية للقيام بهذه العملية");
    }
    next();
  };
}

export function requireVerified(req, res, next) {
  if (!req.user || req.user.verified !== "verified") {
    throw new AppError(403, "VERIFICATION_REQUIRED", "يجب توثيق الحساب أولاً قبل التأجير");
  }
  next();
}
