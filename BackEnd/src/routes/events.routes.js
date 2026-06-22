import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { eventSchema } from "../validation/event.validation.js";
import { getEventById, createEvent, updateEvent, deleteEvent, getEvents  } from "../controllers/event.controller.js";

const router = express.Router();

// All event routes are protected — user must be logged in
router.use(authMiddleware);

// GET    /api/events          — Get all events for the logged-in user
router.get("/api/events",getEvents);

// POST   /api/events          — Create a new event
router.post("/api/events", validate(eventSchema), createEvent)

// GET    /api/events/:id      — Get a single event by ID
router.get("/api/events/:id ", getEventById);

// PUT    /api/events/:id      — Update an event by ID
router.put("/api/events/:id ", validate(eventSchema),updateEvent);

// DELETE /api/events/:id      — Delete an event by ID
router.delete("/api/events/:id", deleteEvent);

export default router;