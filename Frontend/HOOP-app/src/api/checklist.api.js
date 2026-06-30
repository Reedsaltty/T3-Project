import apiClient from "./axios";

// ==========================================
// Checklist Endpoints (/api/events/:eventId/checklist)
// ==========================================

// GET /api/events/:eventId/checklist — Get all checklist items for an event
export const getChecklist = async (eventId) => {
    try {
        const res = await apiClient.get(`/events/${eventId}/checklist`);
        return res.data;
    } catch (err) {
        console.error("Checklist API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// POST /api/events/:eventId/checklist — Add a new checklist item
export const addChecklistItem = async (eventId, itemData) => {
    try {
        const res = await apiClient.post(`/events/${eventId}/checklist`, itemData);
        return res.data;
    } catch (err) {
        console.error("Checklist API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PATCH /api/events/:eventId/checklist/:checklistId/toggle — Flip isDone status
export const toggleChecklistItem = async (eventId, checklistId) => {
    try {
        const res = await apiClient.patch(`/events/${eventId}/checklist/${checklistId}/toggle`);
        return res.data;
    } catch (err) {
        console.error("Checklist API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PUT /api/events/:eventId/checklist/:checklistId — Edit item description
export const updateChecklistItem = async (eventId, checklistId, itemData) => {
    try {
        const res = await apiClient.put(`/events/${eventId}/checklist/${checklistId}`, itemData);
        return res.data;
    } catch (err) {
        console.error("Checklist API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// DELETE /api/events/:eventId/checklist/:checklistId — Remove a checklist item
export const deleteChecklistItem = async (eventId, checklistId) => {
    try {
        const res = await apiClient.delete(`/events/${eventId}/checklist/${checklistId}`);
        return res.data;
    } catch (err) {
        console.error("Checklist API error", err.response?.data?.message || err.message);
        throw err;
    }
};
