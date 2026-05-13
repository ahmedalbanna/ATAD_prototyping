import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { query } from "../config/database.js";
import * as BookingModel from "../models/Booking.js";
import * as UserModel from "../models/User.js";
import * as PaymentService from "../services/payment.js";

const router = Router();

// All admin routes require admin role
router.use(authenticate, requireRole("admin"));

router.get("/stats", (req, res) => {
  const totalUsers = query("SELECT COUNT(*) AS c FROM users").rows[0].c;
  const totalAssets = query("SELECT COUNT(*) AS c FROM assets").rows[0].c;
  const totalBookings = query("SELECT COUNT(*) AS c FROM bookings").rows[0].c;
  const activeRentals = query("SELECT COUNT(*) AS c FROM bookings WHERE status = 'active'").rows[0].c;
  const pendingBookings = query("SELECT COUNT(*) AS c FROM bookings WHERE status = 'pending'").rows[0].c;
  const revenue = query("SELECT COALESCE(SUM(amount),0) AS t FROM payments WHERE status='paid'").rows[0].t;

  res.json({
    success: true,
    data: {
      total_users: totalUsers,
      total_assets: totalAssets,
      total_bookings: totalBookings,
      active_rentals: activeRentals,
      revenue: parseFloat(revenue),
      pending_bookings: pendingBookings,
    },
  });
});

router.get("/users", (req, res) => {
  const users = UserModel.findAll(req.query.search, req.query.role);
  res.json({ success: true, data: users });
});

router.get("/users/:id", (req, res) => {
  const user = UserModel.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "المستخدم غير موجود" } });

  const bookings = query("SELECT b.*, a.title AS asset_title FROM bookings b JOIN assets a ON b.asset_id=a.id WHERE b.tenant_id=? ORDER BY b.created_at DESC", [req.params.id]).rows;
  const assets = query("SELECT * FROM assets WHERE owner_id=? ORDER BY created_at DESC", [req.params.id]).rows;

  res.json({ success: true, data: { user, bookings, assets } });
});

router.get("/assets", (req, res) => {
  let sql = "SELECT a.*, u.name AS owner_name FROM assets a JOIN users u ON a.owner_id=u.id";
  const params = [];

  if (req.query.status && req.query.status !== "all") {
    sql += " WHERE a.status=?";
    params.push(req.query.status);
  }
  if (req.query.search) {
    sql += params.length ? " AND" : " WHERE";
    sql += " (a.title LIKE ? OR a.city LIKE ? OR u.name LIKE ?)";
    const p = `%${req.query.search}%`;
    params.push(p, p, p);
  }
  sql += " ORDER BY a.created_at DESC";

  res.json({ success: true, data: query(sql, params).rows });
});

router.get("/assets/:id", (req, res) => {
  const asset = query("SELECT a.*, u.name AS owner_name FROM assets a JOIN users u ON a.owner_id=u.id WHERE a.id=?", [req.params.id]).rows[0];
  if (!asset) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "الأصل غير موجود" } });

  const bookings = query("SELECT b.*, u.name AS tenant_name FROM bookings b JOIN users u ON b.tenant_id=u.id WHERE b.asset_id=? ORDER BY b.created_at DESC", [req.params.id]).rows;
  res.json({ success: true, data: { ...asset, bookings } });
});

router.get("/bookings", (req, res) => {
  const filters = { ...req.query };
  const bookings = BookingModel.findAll(filters);
  res.json({ success: true, data: bookings });
});

router.get("/bookings/:id", (req, res) => {
  const booking = BookingModel.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "الحجز غير موجود" } });

  const history = BookingModel.getStatusHistory(req.params.id);
  res.json({ success: true, data: { ...booking, status_history: history } });
});

router.patch("/bookings/:id/status", (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = BookingModel.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "الحجز غير موجود" } });

    BookingModel.updateStatus(req.params.id, status);
    BookingModel.insertStatusHistory(req.params.id, booking.status, status, req.user.id);

    if (status === "completed") {
      const asset = query("SELECT * FROM assets WHERE id=?", [booking.asset_id]).rows[0];
      if (asset) query("UPDATE assets SET status='available' WHERE id=?", [booking.asset_id]);
    }

    res.json({ success: true, data: { id: req.params.id, status } });
  } catch (err) {
    next(err);
  }
});

router.get("/revenue", (req, res) => {
  const stats = PaymentService.getRevenueStats();
  const monthly = PaymentService.getRevenueByMonth();
  res.json({ success: true, data: { ...stats, monthly } });
});

// Notification endpoints
router.get("/notifications", (req, res) => {
  const { user_id, unread_only } = req.query;
  if (!user_id) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "معرف المستخدم مطلوب" } });

  let sql = "SELECT * FROM notifications WHERE user_id=?";
  const params = [user_id];
  if (unread_only === "true") { sql += " AND is_read=0"; }
  sql += " ORDER BY created_at DESC";

  res.json({ success: true, data: query(sql, params).rows });
});

router.patch("/notifications/:id/read", (req, res) => {
  query("UPDATE notifications SET is_read=1 WHERE id=?", [req.params.id]);
  res.json({ success: true });
});

router.patch("/notifications/read-all", (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "معرف المستخدم مطلوب" } });
  query("UPDATE notifications SET is_read=1 WHERE user_id=?", [user_id]);
  res.json({ success: true });
});

export default router;
