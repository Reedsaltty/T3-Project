import apiClient from "./axios";

export const getGuests = async (eventId) => {
  try {
    const response = await apiClient.get("/guests", {
      params: { eventId }
    });
    return response.data;
  } catch (err) {
    console.error(
      "Guests API Error",
      err.response?.data?.message || err.message,
    );
    throw err;
  }
};

export const addGuest = async (eventId, guestData) => {
  try {
    const res = await apiClient.post("/guests", {
      eventId,
      ...guestData
    });
    return res.data;
  } catch (err) {
    console.error(
      "Guests API error ",
      err.response?.data?.message || err.message,
    );
    throw err;
  }
};

export const getGuestById = async (guestId) => {
  try {
    const res = await apiClient.get(`/guests/${guestId}`);
    return res.data;
  } catch (err) {
    console.error(
      "Guests API error ",
      err.response?.data?.message || err.message,
    );
    throw err;
  }
};

export const updateGuest = async (guestId, updateData) => {
  try {
    const res = await apiClient.put(`/guests/${guestId}`, updateData);
    return res.data;
  } catch (err) {
    console.error(
      "Guests API error ",
      err.response?.data?.message || err.message,
    );
    throw err;
  }
};

export const deleteGuest = async (guestId) => {
  try {
    const res = await apiClient.delete(`/guests/${guestId}`);
    return res.data;
  } catch (err) {
    console.error(
      "Guests API error ",
      err.response?.data?.message || err.message,
    );
    throw err;
  }
};
