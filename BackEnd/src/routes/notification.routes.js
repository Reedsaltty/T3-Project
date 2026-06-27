import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

// GET    /api/notifications               — Get paginated notifications (?page=&limit=)
router.get("/", getNotifications);

// GET    /api/notifications/unread-count  — Get count of unread notifications
// NOTE: This must be registered BEFORE /:id to avoid Express matching "unread-count" as an :id param
router.get("/unread-count", getUnreadCount);

// PATCH  /api/notifications/read-all     — Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// PATCH  /api/notifications/:id/read     — Mark a single notification as read
router.patch("/:id/read", markAsRead);

// DELETE /api/notifications/:id          — Delete a notification
router.delete("/:id", deleteNotification);

export default router;
