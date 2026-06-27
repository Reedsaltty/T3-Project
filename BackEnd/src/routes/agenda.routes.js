import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAgendaSchema, updateAgendaSchema } from "../validation/agenda.validation.js";
import {
  createAgendaItem,
  getAgenda,
  updateAgendaItem,
  deleteAgendaItem,
} from "../controllers/agenda.controller.js";

// mergeParams: true allows access to :eventId from the parent events router
const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// POST   /api/events/:eventId/agenda
router.post("/", validate(createAgendaSchema), createAgendaItem);

// GET    /api/events/:eventId/agenda
router.get("/", getAgenda);

// PUT    /api/events/:eventId/agenda/:agendaId
router.put("/:agendaId", validate(updateAgendaSchema), updateAgendaItem);

// DELETE /api/events/:eventId/agenda/:agendaId
router.delete("/:agendaId", deleteAgendaItem);

export default router;
