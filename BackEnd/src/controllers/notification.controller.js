import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";

const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 50;

// GET /api/notifications?page=1&limit=20
export const getNotifications = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(MAX_PAGE_LIMIT, parseInt(req.query.limit) || DEFAULT_PAGE_LIMIT);
    const skip = (page - 1) * limit;

    const [notifications, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId: req.user.userId } }),
    ]);

    res.status(200).json({
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    handleServerError(res, err, "Error fetching notifications");
  }
};

// GET /api/notifications/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user.userId, isRead: false },
    });
    res.status(200).json({ unreadCount: count });
  } catch (err) {
    handleServerError(res, err, "Error fetching unread count");
  }
};

// PATCH /api/notifications/:id/read  — Mark one as read
export const markAsRead = async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);

    const notification = await prisma.notification.findUnique({ where: { notificationId } });
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    // Security: can only mark your own notifications as read
    if (notification.userId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.notification.update({
      where: { notificationId },
      data: { isRead: true },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error marking notification as read");
  }
};

// PATCH /api/notifications/read-all  — Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const { count } = await prisma.notification.updateMany({
      where: { userId: req.user.userId, isRead: false },
      data: { isRead: true },
    });
    res.status(200).json({ message: `${count} notification(s) marked as read` });
  } catch (err) {
    handleServerError(res, err, "Error marking all notifications as read");
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);

    const notification = await prisma.notification.findUnique({ where: { notificationId } });
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.userId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.notification.delete({ where: { notificationId } });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting notification");
  }
};
