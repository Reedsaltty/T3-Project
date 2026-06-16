import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All event routes are protected — user must be logged in
router.use(authMiddleware);

// GET    /api/events          — Get all events for the logged-in user
router.get("/", (req, res) => { res.sendStatus(501); });

// POST   /api/events          — Create a new event
router.post("/", (req, res) => { res.sendStatus(501); });

// GET    /api/events/:id      — Get a single event by ID
router.get("/:id", (req, res) => { res.sendStatus(501); });

// PUT    /api/events/:id      — Update an event by ID
router.put("/:id", (req, res) => { res.sendStatus(501); });

// DELETE /api/events/:id      — Delete an event by ID
router.delete("/:id", (req, res) => { res.sendStatus(501); });

export default router;