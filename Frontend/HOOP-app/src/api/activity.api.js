import apiClient from "./axios";

export const getAllActivity = async (eventId) => {
    try {
        const res = await apiClient.get(`/events/${eventId}/activities`);
        return res.data;
    } catch (err) {
        console.error("Activity API error ", err.response?.data?.message || err.message);
        throw err;
    }
};

export const createActivity = async (eventId, activityData) => {
    try {
        const res = await apiClient.post(`/events/${eventId}/activities`, activityData);
        return res.data;
    } catch (err) {
        console.error("Activity API error", err.response?.data?.message || err.message);
        throw err;
    }
};

export const updateActivity = async (eventId, activityId, activityData) => {
    try {
        const res = await apiClient.put(`/events/${eventId}/activities/${activityId}`, activityData);
        return res.data;
    } catch (err) {
        console.error("Activity API error", err.response?.data?.message || err.message);
        throw err;
    }
};

export const deleteActivity = async (eventId, activityId) => {
    try {
        const res = await apiClient.delete(`/events/${eventId}/activities/${activityId}`);
        return res.data;
    } catch (err) {
        console.error("Activity API error", err.response?.data?.message || err.message);
        throw err;
    }
};
