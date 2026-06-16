import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All guest/attendee routes are protected — user must be logged in
router.use(authMiddleware);

// GET    /api/guests               — Get all attendees for an event (?eventId=)
router.get("/", (req, res) => { res.sendStatus(501); });

// POST   /api/guests               — Add a new guest/attendee to an event
router.post("/", (req, res) => { res.sendStatus(501); });

// GET    /api/guests/:attendeeId   — Get a specific attendee by ID
router.get("/:attendeeId", (req, res) => { res.sendStatus(501); });

// PUT    /api/guests/:attendeeId   — Update attendee details or RSVP status
router.put("/:attendeeId", (req, res) => { res.sendStatus(501); });

// DELETE /api/guests/:attendeeId   — Remove an attendee from an event
router.delete("/:attendeeId", (req, res) => { res.sendStatus(501); });

export default router;
