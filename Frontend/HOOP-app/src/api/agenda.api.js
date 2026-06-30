import apiClient from "./axios";

// ==========================================
// Agenda Endpoints (/api/events/:eventId/agenda)
// ==========================================

// GET /api/events/:eventId/agenda — Get the full agenda for an event
export const getAgenda = async (eventId) => {
    try {
        const res = await apiClient.get(`/events/${eventId}/agenda`);
        return res.data;
    } catch (err) {
        console.error("Agenda API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// POST /api/events/:eventId/agenda — Add a new agenda item
export const createAgendaItem = async (eventId, agendaData) => {
    try {
        const res = await apiClient.post(`/events/${eventId}/agenda`, agendaData);
        return res.data;
    } catch (err) {
        console.error("Agenda API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PUT /api/events/:eventId/agenda/:agendaId — Update an agenda item
export const updateAgendaItem = async (eventId, agendaId, agendaData) => {
    try {
        const res = await apiClient.put(`/events/${eventId}/agenda/${agendaId}`, agendaData);
        return res.data;
    } catch (err) {
        console.error("Agenda API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// DELETE /api/events/:eventId/agenda/:agendaId — Delete an agenda item
export const deleteAgendaItem = async (eventId, agendaId) => {
    try {
        const res = await apiClient.delete(`/events/${eventId}/agenda/${agendaId}`);
        return res.data;
    } catch (err) {
        console.error("Agenda API error", err.response?.data?.message || err.message);
        throw err;
    }
};
