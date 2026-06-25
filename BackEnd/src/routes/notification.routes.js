import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All notification routes are protected
router.use(authMiddleware);

// GET /api/notifications
router.get("/", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// GET /api/notifications/unread-count
router.get("/unread-count", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// PATCH /api/notifications/:id/read
router.patch("/:id/read", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// PATCH /api/notifications/read-all
router.patch("/read-all", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// DELETE /api/notifications/:id
router.delete("/:id", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

export default router;
