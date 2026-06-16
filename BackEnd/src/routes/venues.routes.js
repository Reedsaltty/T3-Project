import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All venue routes are protected — user must be logged in
router.use(authMiddleware);

// GET    /api/venues          — Get all venues for a given event (?eventId=)
router.get("/", (req, res) => { res.sendStatus(501); });

// POST   /api/venues          — Add a venue to an event
router.post("/", (req, res) => { res.sendStatus(501); });

// GET    /api/venues/:venueId — Get a specific venue by ID
router.get("/:venueId", (req, res) => { res.sendStatus(501); });

// PUT    /api/venues/:venueId — Update a venue by ID
router.put("/:venueId", (req, res) => { res.sendStatus(501); });

// DELETE /api/venues/:venueId — Remove a venue from an event
router.delete("/:venueId", (req, res) => { res.sendStatus(501); });

export default router;
