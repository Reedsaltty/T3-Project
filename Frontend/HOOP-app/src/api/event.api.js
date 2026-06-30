import apiClient from "./axios";

// GET /api/events — Get all events for the logged-in user
export const getEvents = async () => {
    try {
        const res = await apiClient.get("/events");
        return res.data;
    } catch (err) {
        console.error("Events API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// GET /api/event-types — Get all event type categories (Birthday, Wedding, etc.)
export const getEventTypes = async () => {
    try {
        const res = await apiClient.get("/events/types");
        return res.data;
    } catch (err) {
        console.error("Event Types API error", err.response?.data?.message || err.message);
        throw err;
    }
};


// GET /api/events/:id — Get a single event by ID
export const getEventById = async (eventId) => {
    try {
        const res = await apiClient.get(`/events/${eventId}`);
        return res.data;
    } catch (err) {
        console.error("Events API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// POST /api/events — Create a new event
export const createEvent = async (eventData) => {
    try {
        const res = await apiClient.post("/events", eventData);
        return res.data;
    } catch (err) {
        console.error("Events API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PUT /api/events/:id — Update an event
export const updateEvent = async (eventId, eventData) => {
    try {
        const res = await apiClient.put(`/events/${eventId}`, eventData);
        return res.data;
    } catch (err) {
        console.error("Events API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// DELETE /api/events/:id — Delete an event
export const deleteEvent = async (eventId) => {
    try {
        const res = await apiClient.delete(`/events/${eventId}`);
        return res.data;
    } catch (err) {
        console.error("Events API error", err.response?.data?.message || err.message);
        throw err;
    }
};