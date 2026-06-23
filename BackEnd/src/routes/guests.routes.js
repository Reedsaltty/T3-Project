import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { guestSchema } from "../validation/guest.validation.js";
import { getGuests, getGuestById, updateGuestInfo, deleteGuest, addGuest } from "../controllers/guest.Controller.js";

const router = express.Router();

// All guest/attendee routes are protected — user must be logged in
router.use(authMiddleware);

// GET    /api/guests               — Get all attendees for an event (?eventId=)
router.get("/", getGuests);

// POST   /api/guests               — Add a new guest/attendee to an event
router.post("/", validate(guestSchema), addGuest); // To be implemented

// GET    /api/guests/:attendeeId   — Get a specific attendee by ID
router.get("/:attendeeId", getGuestById);

// PUT    /api/guests/:attendeeId   — Update attendee details or RSVP status
router.put("/:attendeeId", validate(guestSchema), updateGuestInfo);

// DELETE /api/guests/:attendeeId   — Remove an attendee from an event
router.delete("/:attendeeId", deleteGuest);

export default router;
