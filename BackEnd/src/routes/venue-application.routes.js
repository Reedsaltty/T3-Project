import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All venue application routes are protected
router.use(authMiddleware);

// POST /api/venue-applications
router.post("/", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// GET /api/venue-applications/mine
router.get("/mine", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// GET /api/venue-applications
router.get("/", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// PATCH /api/venue-applications/:id/approve
router.patch("/:id/approve", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// PATCH /api/venue-applications/:id/reject
router.patch("/:id/reject", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

export default router;
