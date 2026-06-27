import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { eventSchema, updateEventSchema } from "../validation/event.validation.js";
import { getEventById, createEvent, updateEvent, deleteEvent, getEvents } from "../controllers/event.controller.js";
import agendaRoutes from "./agenda.routes.js";
import checklistRoutes from "./checklist.routes.js";

const router = express.Router();

router.use(authMiddleware);

// GET    /api/events       — Get all events for the logged-in user
router.get("/", getEvents);

// POST   /api/events       — Create a new event
router.post("/", validate(eventSchema), createEvent);

// GET    /api/events/:id   — Get a single event by ID
router.get("/:id", getEventById);

// PUT    /api/events/:id   — Update an event
router.put("/:id", validate(updateEventSchema), updateEvent);

// DELETE /api/events/:id   — Delete an event
router.delete("/:id", deleteEvent);

// Nested: /api/events/:eventId/agenda
router.use("/:eventId/agenda", agendaRoutes);

// Nested: /api/events/:eventId/checklist
router.use("/:eventId/checklist", checklistRoutes);

export default router;