import apiClient from "./axios";

// ==========================================
// Notification Endpoints (/api/notifications)
// ==========================================

// GET /api/notifications?page=&limit= — Get paginated notifications
export const getNotifications = async (page = 1, limit = 10) => {
    try {
        const res = await apiClient.get("/notifications", { params: { page, limit } });
        return res.data;
    } catch (err) {
        console.error("Notifications API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// GET /api/notifications/unread-count — Get count of unread notifications
export const getUnreadCount = async () => {
    try {
        const res = await apiClient.get("/notifications/unread-count");
        return res.data;
    } catch (err) {
        console.error("Notifications API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PATCH /api/notifications/:id/read — Mark a single notification as read
export const markAsRead = async (notificationId) => {
    try {
        const res = await apiClient.patch(`/notifications/${notificationId}/read`);
        return res.data;
    } catch (err) {
        console.error("Notifications API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PATCH /api/notifications/read-all — Mark all notifications as read
export const markAllAsRead = async () => {
    try {
        const res = await apiClient.patch("/notifications/read-all");
        return res.data;
    } catch (err) {
        console.error("Notifications API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// DELETE /api/notifications/:id — Delete a notification
export const deleteNotification = async (notificationId) => {
    try {
        const res = await apiClient.delete(`/notifications/${notificationId}`);
        return res.data;
    } catch (err) {
        console.error("Notifications API error", err.response?.data?.message || err.message);
        throw err;
    }
};
