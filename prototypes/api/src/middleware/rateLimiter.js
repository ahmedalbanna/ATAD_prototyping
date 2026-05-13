const requests = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const timestamps = requests.get(ip).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requests.set(ip, timestamps);

  if (timestamps.length > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: { code: "RATE_LIMITED", message: "طلبات كثيرة جداً. الرجاء المحاولة لاحقاً" },
    });
  }

  next();
}
