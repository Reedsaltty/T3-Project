import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

// Note: Ensure this router is mounted with mergeParams: true in events.routes.js or app.js
const router = express.Router({ mergeParams: true });

// All activity routes are protected
router.use(authMiddleware);

// POST /api/events/:eventId/activities
router.post("/", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// GET /api/events/:eventId/activities
router.get("/", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// PUT /api/events/:eventId/activities/:activityId
router.put("/:activityId", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// DELETE /api/events/:eventId/activities/:activityId
router.delete("/:activityId", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

export default router;
