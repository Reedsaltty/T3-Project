import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createActivitySchema, updateActivitySchema } from "../validation/activity.validation.js";
import {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller.js";

// mergeParams: true allows access to :eventId from the parent events router
const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// POST   /api/events/:eventId/activities
router.post("/", validate(createActivitySchema), createActivity);

// GET    /api/events/:eventId/activities
router.get("/", getActivities);

// PUT    /api/events/:eventId/activities/:activityId
router.put("/:activityId", validate(updateActivitySchema), updateActivity);

// DELETE /api/events/:eventId/activities/:activityId
router.delete("/:activityId", deleteActivity);

export default router;
