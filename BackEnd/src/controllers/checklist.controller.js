import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";

// GET /api/events/:eventId/checklist
// Auto-closes all items if the event has already ended
export const getChecklist = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // ── Auto-close: if the event has ended, mark all pending items as done ──
    const now = new Date();
    // eventDate is @db.Date (date-only) and eventEndTime is @db.Time (time-only)
    // Combine them into a proper full datetime for comparison
    let eventEnded = false;
    if (event.eventDate && event.eventEndTime) {
      const dateStr = new Date(event.eventDate).toISOString().split('T')[0]; // "YYYY-MM-DD"
      const timeStr = new Date(event.eventEndTime).toISOString().split('T')[1]; // "HH:MM:SS.sssZ"
      const fullEndDatetime = new Date(`${dateStr}T${timeStr}`);
      eventEnded = fullEndDatetime < now;
    }

    if (eventEnded) {
      await prisma.checklist.updateMany({
        where: { eventId, isDone: false },
        data: { isDone: true },
      });
    }

    const items = await prisma.checklist.findMany({
      where: { eventId },
      orderBy: { checklistId: "asc" },
    });

    res.status(200).json({
      items,
      meta: {
        total: items.length,
        done: items.filter((i) => i.isDone).length,
        pending: items.filter((i) => !i.isDone).length,
        eventEnded,
      },
    });
  } catch (err) {
    handleServerError(res, err, "Error fetching checklist");
  }
};

// POST /api/events/:eventId/checklist
export const addChecklistItem = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { description } = req.body;

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Block adding items to a finished event
    // Combine eventDate (@db.Date) + eventEndTime (@db.Time) for a proper full datetime comparison
    const now = new Date();
    if (event.eventDate && event.eventEndTime) {
      const dateStr = new Date(event.eventDate).toISOString().split('T')[0];
      const timeStr = new Date(event.eventEndTime).toISOString().split('T')[1];
      const fullEndDatetime = new Date(`${dateStr}T${timeStr}`);
      if (fullEndDatetime < now) {
        return res.status(409).json({ message: "Cannot add items to an event that has already ended" });
      }
    }

    const item = await prisma.checklist.create({
      data: {
        eventId,
        description: String(description),
        isDone: false,
      },
    });
    res.status(201).json(item);
  } catch (err) {
    handleServerError(res, err, "Error creating checklist item");
  }
};

// PATCH /api/events/:eventId/checklist/:checklistId/toggle  — Toggle isDone
export const toggleChecklistItem = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const checklistId = parseInt(req.params.checklistId);

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Fetch current state then flip it
    const item = await prisma.checklist.findUnique({ where: { checklistId } });
    if (!item || item.eventId !== eventId) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    const updated = await prisma.checklist.update({
      where: { checklistId },
      data: { isDone: !item.isDone },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error toggling checklist item");
  }
};

// PUT /api/events/:eventId/checklist/:checklistId  — Edit description only
export const updateChecklistItem = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const checklistId = parseInt(req.params.checklistId);
    const { description } = req.body;

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const updated = await prisma.checklist.update({
      where: { checklistId },
      data: { description: String(description) },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error updating checklist item");
  }
};

// DELETE /api/events/:eventId/checklist/:checklistId
export const deleteChecklistItem = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const checklistId = parseInt(req.params.checklistId);

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    await prisma.checklist.delete({ where: { checklistId } });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting checklist item");
  }
};
