import apiClient from "./axios.js";

// ==========================================
// Venue Endpoints (/api/venues)
// ==========================================

/**
 * Fetch all active venues (public listing)
 */
export const getVenues = async () => {
  try {
    const response = await apiClient.get("/venues");
    return response.data;
  } catch (err) {
    console.error("Get Venues API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Fetch all venues owned by the currently logged-in user
 */
export const getMyVenues = async () => {
  try {
    const response = await apiClient.get("/venues/mine");
    return response.data;
  } catch (err) {
    console.error("Get My Venues API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Fetch venue booking info for a specific event
 * @param {number|string} eventId 
 */
export const getBookingVenue = async (eventId) => {
  try {
    const response = await apiClient.get(`/venues/booking/${eventId}`);
    return response.data;
  } catch (err) {
    console.error("Get Booking Venue API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Fetch full details for a specific venue by ID
 * @param {number|string} venueId 
 */
export const getVenueById = async (venueId) => {
  try {
    const response = await apiClient.get(`/venues/${venueId}`);
    return response.data;
  } catch (err) {
    console.error("Get Venue By ID API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Create a booking request for a venue
 * @param {number|string} venueId 
 * @param {number|string} eventId 
 */
export const bookVenue = async (venueId, eventId) => {
  try {
    const response = await apiClient.post(`/venues/${venueId}/book`, {
      venueId: Number(venueId),
      eventId: Number(eventId),
    });
    return response.data;
  } catch (err) {
    console.error("Book Venue API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Venue owner responds to a booking request (approve/reject)
 * @param {number|string} bookingId 
 * @param {'approved'|'rejected'} status 
 * @param {string} [notes] 
 */
export const respondToBooking = async (bookingId, status, notes = "") => {
  try {
    const response = await apiClient.patch(`/venues/bookings/${bookingId}/respond`, {
      status,
      notes,
    });
    return response.data;
  } catch (err) {
    console.error("Respond to Booking API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Update venue details (owner only)
 * @param {number|string} venueId 
 * @param {Object} venueData 
 */
export const updateVenue = async (venueId, venueData) => {
  try {
    const response = await apiClient.put(`/venues/${venueId}`, venueData);
    return response.data;
  } catch (err) {
    console.error("Update Venue API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Delete a venue (owner only)
 * @param {number|string} venueId 
 */
export const deleteVenue = async (venueId) => {
  try {
    const response = await apiClient.delete(`/venues/${venueId}`);
    return response.data;
  } catch (err) {
    console.error("Delete Venue API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

// ==========================================
// Venue Applications Endpoints (/api/venue-applications)
// ==========================================

/**
 * User submits a new venue listing application
 * @param {Object} applicationData { venueName, venueLocation, venueCapacity, contactEmail, description }
 */
export const submitVenueApplication = async (applicationData) => {
  try {
    const response = await apiClient.post("/venue-applications", {
      ...applicationData,
      venueCapacity: Number(applicationData.venueCapacity),
    });
    return response.data;
  } catch (err) {
    console.error("Submit Venue Application API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * User views their own venue application history
 */
export const getMyVenueApplications = async () => {
  try {
    const response = await apiClient.get("/venue-applications/mine");
    return response.data;
  } catch (err) {
    console.error("Get My Applications API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Admin views all pending venue applications
 */
export const getAllPendingApplications = async () => {
  try {
    const response = await apiClient.get("/venue-applications");
    return response.data;
  } catch (err) {
    console.error("Get Pending Applications API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Admin approves a venue application
 * @param {number|string} applicationId 
 */
export const approveVenueApplication = async (applicationId) => {
  try {
    const response = await apiClient.patch(`/venue-applications/${applicationId}/approve`);
    return response.data;
  } catch (err) {
    console.error("Approve Application API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};

/**
 * Admin rejects a venue application
 * @param {number|string} applicationId 
 * @param {string} rejectionReason 
 */
export const rejectVenueApplication = async (applicationId, rejectionReason) => {
  try {
    const response = await apiClient.patch(`/venue-applications/${applicationId}/reject`, {
      rejectionReason,
    });
    return response.data;
  } catch (err) {
    console.error("Reject Application API Error:", err.response?.data?.message || err.message);
    throw err;
  }
};
