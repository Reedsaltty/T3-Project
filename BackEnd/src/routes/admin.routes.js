import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All admin routes are protected
router.use(authMiddleware);

// GET /api/admin/venues
router.get("/venues", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// PATCH /api/admin/venues/:id
router.patch("/venues/:id", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

// PATCH /api/admin/venues/:id/toggle-active
router.patch("/venues/:id/toggle-active", (req, res) => { res.status(501).json({ message: "Not Implemented" }); });

export default router;
