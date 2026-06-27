import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { createVenueApplicationSchema, rejectVenueApplicationSchema } from "../validation/venueApplicaton.js";
import {
  submitApplication,
  getMyApplications,
  getAllPendingApplications,
  approveApplication,
  rejectApplication,
} from "../controllers/venueApplication.controller.js";

const router = express.Router();

router.use(authMiddleware);

// POST /api/venue-applications  — User submits a new venue application
router.post("/", validate(createVenueApplicationSchema), submitApplication);

// GET /api/venue-applications/mine  — User views their own application history
router.get("/mine", getMyApplications);

// GET /api/venue-applications  — Admin views all pending applications
router.get("/", authorizeRoles("admin"), getAllPendingApplications);

// PATCH /api/venue-applications/:id/approve  — Admin approves (no body needed)
router.patch("/:id/approve", authorizeRoles("admin"), approveApplication);

// PATCH /api/venue-applications/:id/reject  — Admin rejects (requires rejectionReason)
router.patch("/:id/reject", authorizeRoles("admin"), validate(rejectVenueApplicationSchema), rejectApplication);

export default router;
