import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as NotificationModel from "../models/Notification.js";

const router = Router();
router.use(authenticate);

router.get("/", (req, res) => {
  const { unread_only } = req.query;
  const notifications = NotificationModel.findByUser(req.user.id, unread_only === "true");
  res.json({ success: true, data: notifications });
});

router.get("/unread-count", (req, res) => {
  const count = NotificationModel.getUnreadCount(req.user.id);
  res.json({ success: true, data: { count } });
});

router.patch("/read-all", (req, res) => {
  NotificationModel.markAllRead(req.user.id);
  res.json({ success: true });
});

router.patch("/:id/read", (req, res) => {
  NotificationModel.markRead(req.params.id);
  res.json({ success: true });
});

export default router;
