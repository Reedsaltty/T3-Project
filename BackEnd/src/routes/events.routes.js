import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { eventSchema } from "../validation/event.validation.js";
import { getEventById, createEvent, updateEvent, deleteEvent, getEvents  } from "../controllers/event.controller.js";
import activityRoutes from "./activity.routes.js";

const router = express.Router();

// All event routes are protected — user must be logged in
router.use(authMiddleware);

// GET    /api/events          — Get all events for the logged-in user
router.get("/", getEvents);

// POST   /api/events          — Create a new event
router.post("/", validate(eventSchema), createEvent)

// GET    /api/events/:id      — Get a single event by ID
router.get("/:id", getEventById);

// PUT    /api/events/:id      — Update an event by ID
router.put("/:id", validate(eventSchema), updateEvent);

// DELETE /api/events/:id      — Delete an event by ID
router.delete("/:id", deleteEvent);

// Attach activity routes for a specific event
router.use("/:eventId/activities", activityRoutes);

export default router;