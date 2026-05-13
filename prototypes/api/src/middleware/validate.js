import { AppError } from "./errorHandler.js";

export function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    const data = { ...req.body, ...req.query, ...req.params };

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      for (const rule of rules) {
        const error = rule(value, field);
        if (error) {
          errors.push({ field, message: error });
          break;
        }
      }
    }

    if (errors.length > 0) {
      throw new AppError(400, "VALIDATION_ERROR", "يرجى التحقق من البيانات المدخلة", errors);
    }

    next();
  };
}

export const rules = {
  required: (msg) => (v, f) => (!v || (typeof v === "string" && !v.trim())) ? (msg || `${f} مطلوب`) : null,
  min: (min, msg) => (v, f) => (v && v.length < min) ? (msg || `${f} يجب أن يكون ${min} أحرف على الأقل`) : null,
  max: (max, msg) => (v, f) => (v && v.length > max) ? (msg || `${f} يجب أن يكون ${max} أحرف كحد أقصى`) : null,
  isNumber: (msg) => (v, f) => (v && isNaN(Number(v))) ? (msg || `${f} يجب أن يكون رقماً`) : null,
  isDate: (msg) => (v, f) => (v && isNaN(Date.parse(v))) ? (msg || `${f} يجب أن يكون تاريخاً صحيحاً`) : null,
  oneOf: (options, msg) => (v, f) => (v && !options.includes(v)) ? (msg || `${f} غير صالح`) : null,
  pattern: (regex, msg) => (v, f) => (v && !regex.test(v)) ? (msg || `${f} غير صحيح`) : null,
};
