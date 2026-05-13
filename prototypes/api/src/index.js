import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import assetRoutes from "./routes/assets.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import ratingRoutes from "./routes/ratings.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || "").split(",") }));
app.use(requestLogger);
app.use(rateLimiter);
app.use(express.json());

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/assets", assetRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/ratings", ratingRoutes);
app.use("/api/v1/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "المسار غير موجود" } });
});

// Error handler (must be last)
app.use(errorHandler);

const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`ATAD API running on http://${HOST}:${PORT}`);
});

export default app;
