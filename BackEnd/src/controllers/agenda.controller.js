import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";

// GET /api/events/:eventId/agenda
// Computes isCurrent and isUpcoming for each item based on the real current time
export const getAgenda = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const now = new Date();

    const rawAgenda = await prisma.agenda.findMany({
      where: { eventId },
      orderBy: { startTime: "asc" },
    });

    // ── Enrich each item with live time status ────────────────────────────
    const agenda = rawAgenda.map((item) => {
      const start = new Date(item.startTime);
      const end   = new Date(item.endTime);
      return {
        ...item,
        isCurrent:  now >= start && now < end,
        isUpcoming: now < start,
        isDone:     now >= end,
      };
    });

    const current = agenda.find((i) => i.isCurrent) ?? null;

    res.status(200).json({
      agenda,
      current,                     // The item happening right now (or null)
      serverTime: now.toISOString(), // Client can use this for clock sync
    });
  } catch (err) {
    handleServerError(res, err, "Error fetching agenda");
  }
};

// POST /api/events/:eventId/agenda
export const createAgendaItem = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { title, description, startTime, endTime } = req.body;

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const item = await prisma.agenda.create({
      data: {
        eventId,
        title: String(title),
        description: description ? String(description) : null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    res.status(201).json(item);
  } catch (err) {
    handleServerError(res, err, "Error creating agenda item");
  }
};

// PUT /api/events/:eventId/agenda/:agendaId
export const updateAgendaItem = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const agendaId = parseInt(req.params.agendaId);
    const { title, description, startTime, endTime } = req.body;

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const updated = await prisma.agenda.update({
      where: { agendaId },
      data: {
        title: title ? String(title) : undefined,
        description: description !== undefined ? String(description) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
    });

    // Re-compute live status for the updated item
    const now = new Date();
    const start = new Date(updated.startTime);
    const end   = new Date(updated.endTime);

    res.status(200).json({
      ...updated,
      isCurrent:  now >= start && now < end,
      isUpcoming: now < start,
      isDone:     now >= end,
    });
  } catch (err) {
    handleServerError(res, err, "Error updating agenda item");
  }
};

// DELETE /api/events/:eventId/agenda/:agendaId
export const deleteAgendaItem = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const agendaId = parseInt(req.params.agendaId);

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    await prisma.agenda.delete({ where: { agendaId } });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting agenda item");
  }
};
