import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";

// POST /api/events/:eventId/activities
export const createActivity = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { title, description, startTime, endTime } = req.body;

    // Verify the event belongs to the logged-in user
    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const activity = await prisma.activity.create({
      data: {
        eventId,
        title: String(title),
        description: description ? String(description) : null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    res.status(201).json(activity);
  } catch (err) {
    handleServerError(res, err, "Error creating activity");
  }
};

// GET /api/events/:eventId/activities
export const getActivities = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const activities = await prisma.activity.findMany({
      where: { eventId },
      orderBy: { startTime: "asc" },
    });
    res.status(200).json(activities);
  } catch (err) {
    handleServerError(res, err, "Error fetching activities");
  }
};

// PUT /api/events/:eventId/activities/:activityId
export const updateActivity = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const activityId = parseInt(req.params.activityId);
    const { title, description, startTime, endTime } = req.body;

    // Ownership check via event
    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updated = await prisma.activity.update({
      where: { activityId },
      data: {
        title: title ? String(title) : undefined,
        description: description !== undefined ? String(description) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error updating activity");
  }
};

// DELETE /api/events/:eventId/activities/:activityId
export const deleteActivity = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const activityId = parseInt(req.params.activityId);

    // Ownership check via event
    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await prisma.activity.delete({ where: { activityId } });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting activity");
  }
};
