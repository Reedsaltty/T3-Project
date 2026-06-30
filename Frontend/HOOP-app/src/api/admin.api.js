import apiClient from "./axios";

// ==========================================
// Admin Endpoints (/api/admin)
// Note: All functions require admin role. The backend enforces this via
// authorizeRoles("admin") middleware — unauthenticated/unauthorized calls
// will receive 401/403 responses.
// ==========================================

// GET /api/admin/venues — View all venues (including inactive)
export const getAdminVenues = async () => {
    try {
        const res = await apiClient.get("/admin/venues");
        return res.data;
    } catch (err) {
        console.error("Admin API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PATCH /api/admin/venues/:id — Edit any venue's details
export const updateAnyVenue = async (venueId, venueData) => {
    try {
        const res = await apiClient.patch(`/admin/venues/${venueId}`, venueData);
        return res.data;
    } catch (err) {
        console.error("Admin API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PATCH /api/admin/venues/:id/toggle-active — Soft-delete or re-activate a venue
export const toggleVenueActive = async (venueId) => {
    try {
        const res = await apiClient.patch(`/admin/venues/${venueId}/toggle-active`);
        return res.data;
    } catch (err) {
        console.error("Admin API error", err.response?.data?.message || err.message);
        throw err;
    }
};
