import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getAdminVenues,
  updateAnyVenue,
  toggleVenueActive,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(authorizeRoles("admin"));

// GET /api/admin/venues  — View all venues (including inactive)
router.get("/venues", getAdminVenues);

// PATCH /api/admin/venues/:id  — Edit any venue's details
router.patch("/venues/:id", updateAnyVenue);

// PATCH /api/admin/venues/:id/toggle-active  — Soft-delete / re-activate
router.patch("/venues/:id/toggle-active", toggleVenueActive);

export default router;
