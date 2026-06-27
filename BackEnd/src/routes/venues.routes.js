import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { venueSchema } from "../validation/venue.validation.js";
import {
  getVenue,
  getVenueById,
  getBookingVenue,
  getMyVenues,
  createBooking,
  respondToBooking,
  updateVenue,
  deleteVenue,
} from "../controllers/venue.controller.js";

const router = express.Router();

router.use(authMiddleware);

// GET /api/venues  — All active venues (public listing)
router.get("/", getVenue);

// GET /api/venues/mine  — All venues owned by the logged-in user
router.get("/mine", authorizeRoles("venue_owner", "admin"), getMyVenues);

// GET /api/venues/booking/:eventId  — Booking info for an event
router.get("/booking/:eventId", getBookingVenue);

// GET /api/venues/:venueId  — Full venue detail
router.get("/:venueId", getVenueById);

// POST /api/venues/:venueId/book  — Create a booking request
router.post("/:venueId/book", createBooking);

// PATCH /api/venues/bookings/:bookingId/respond  — Venue owner responds to a booking
router.patch("/bookings/:bookingId/respond", authorizeRoles("venue_owner", "admin"), respondToBooking);

// PUT /api/venues/:venueId  — Update venue details (owner only)
router.put("/:venueId", authorizeRoles("venue_owner", "admin"), validate(venueSchema), updateVenue);

// DELETE /api/venues/:venueId  — Delete a venue (owner only)
router.delete("/:venueId", authorizeRoles("venue_owner", "admin"), deleteVenue);

export default router;
