import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addChecklistItemSchema, updateChecklistItemSchema } from "../validation/checklist.validation.js";
import {
  getChecklist,
  addChecklistItem,
  toggleChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../controllers/checklist.controller.js";

// mergeParams: true allows access to :eventId from the parent events router
const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// GET    /api/events/:eventId/checklist            — Get all items (auto-closes if event ended)
router.get("/", getChecklist);

// POST   /api/events/:eventId/checklist            — Add a new item
router.post("/", validate(addChecklistItemSchema), addChecklistItem);

// PATCH  /api/events/:eventId/checklist/:checklistId/toggle  — Flip isDone
router.patch("/:checklistId/toggle", toggleChecklistItem);

// PUT    /api/events/:eventId/checklist/:checklistId          — Edit description
router.put("/:checklistId", validate(updateChecklistItemSchema), updateChecklistItem);

// DELETE /api/events/:eventId/checklist/:checklistId
router.delete("/:checklistId", deleteChecklistItem);

export default router;
