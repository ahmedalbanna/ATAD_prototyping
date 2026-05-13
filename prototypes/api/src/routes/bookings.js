import { Router } from "express";
import * as BookingService from "../services/booking.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// List bookings (for current user or by filters)
router.get("/", authenticate, async (req, res, next) => {
  try {
    const filters = { ...req.query };
    if (req.user.role === "tenant") filters.tenant_id = req.user.id;
    if (req.user.role === "lessor") {
      const bookings = await BookingService.getLessorBookings(req.user.id);
      return res.json({ success: true, data: bookings });
    }
    const bookings = await BookingService.listBookings(filters);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

// Get single booking
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const booking = await BookingService.getBooking(req.params.id);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// Create booking (tenant only)
router.post("/", authenticate, requireRole("tenant"), async (req, res, next) => {
  try {
    const booking = await BookingService.createBooking({
      ...req.body,
      tenant_id: req.user.id,
    });
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// Transition booking status (lessor/admin)
router.patch("/:id/status", authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) throw new AppError(400, "VALIDATION_ERROR", "الحالة الجديدة مطلوبة");
    const booking = await BookingService.transitionStatus(req.params.id, status, req.user);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// Cancel booking (tenant only)
router.post("/:id/cancel", authenticate, requireRole("tenant"), async (req, res, next) => {
  try {
    const booking = await BookingService.cancelAsTenant(req.params.id, req.user.id);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

export default router;
