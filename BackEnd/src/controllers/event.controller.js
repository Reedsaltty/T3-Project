import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";
import { reqParamId } from "../utils/reqBody.utils.js";

// GET all event types (for the frontend dropdown)
export const getEventTypes = async (req, res) => {
  try {
    const types = await prisma.eventType.findMany({ orderBy: { eventTypeId: "asc" } });
    res.status(200).json(types);
  } catch (err) {
    handleServerError(res, err, "Error fetching event types");
  }
};

// CREATE an event — handles small (map pin) and big (venue) event types
export const createEvent = async (req, res) => {
  try {
    const {
      eventTitle, eventTypeId, eventDate, eventTime, eventEndTime,
      budget, eventSize, description,
      locationLat, locationLng, locationAddress, locationLabel,
      expectedGuests, dressCode, specialNotes,
    } = req.body;

    // ── Small event rules (spec section 4.5) ──────────────────────────────
    if (eventSize === "small") {
      if (locationLat === undefined || locationLng === undefined) {
        return res.status(400).json({
          message: "Small events require a pinned location (latitude and longitude)",
        });
      }
      const lat = parseFloat(locationLat);
      const lng = parseFloat(locationLng);
      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Both latitude and longitude are required" });
      }
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }
    }

    // ── Big event: venue is booked separately — ignore any location fields ─
    const isSmall = eventSize === "small";

    const newEvent = await prisma.event.create({
      data: {
        eventTitle: String(eventTitle),
        eventTypeId: parseInt(eventTypeId),
        eventDate: new Date(eventDate),
        eventTime: new Date(`${eventDate}T${eventTime}`),
        eventEndTime: new Date(`${eventDate}T${eventEndTime}`),
        budget: budget !== undefined ? parseFloat(budget) : null,
        userId: req.user.userId,
        eventSize,
        description: description ? String(description) : null,
        // Location only stored for small events
        locationLat: isSmall ? parseFloat(locationLat) : null,
        locationLng: isSmall ? parseFloat(locationLng) : null,
        locationAddress: isSmall && locationAddress ? String(locationAddress) : null,
        locationLabel: isSmall && locationLabel ? String(locationLabel) : null,
        // Shared optional fields for both sizes
        expectedGuests: expectedGuests ? parseInt(expectedGuests) : null,
        dressCode: dressCode ? String(dressCode) : null,
        specialNotes: specialNotes ? String(specialNotes) : null,
      },
    });
    res.status(201).json(newEvent);
  } catch (err) {
    handleServerError(res, err, "Internal server error!");
  }
};


// READ — Get all events for the logged-in user
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: req.user.userId },
      include: {
        eventType: true,
        venueBookings: { include: { venue: true } },
      },
      orderBy: { eventDate: "asc" },
    });
    // Bug fix #2: was catching 'error' but referencing 'err' — now consistent
    res.status(200).json(events);
  } catch (err) {
    handleServerError(res, err, "Error fetching events");
  }
};

// READ — Get a specific event by ID (ownership-checked)
export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        eventId: parseInt(reqParamId(req)),
        userId: req.user.userId,
      },
      include: {
        eventType: true,
        attendees: true,
        expenses: true,
        venueBookings: { include: { venue: true } },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    handleServerError(res, err, "Error fetching event");
  }
};


// UPDATE an event (ownership-checked, eventSize locked)
export const updateEvent = async (req, res) => {
  try {
    const eventId = parseInt(reqParamId(req));

    // Security fix: verify ownership before updating
    const existing = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!existing) {
      return res.status(404).json({ message: "Event not found" });
    }

    const {
      eventTitle, eventTypeId, eventDate, eventTime, eventEndTime,
      budget, description, locationLat, locationLng,
      locationAddress, locationLabel, expectedGuests, dressCode, specialNotes,
      eventSize, // checked but rejected
    } = req.body;

    // Spec 4.5 edge case #6 — eventSize is locked after creation
    if (eventSize && eventSize !== existing.eventSize) {
      return res.status(400).json({
        message: "Event size cannot be changed after creation. Please cancel this event and create a new one.",
      });
    }

    const isSmall = existing.eventSize === "small";

    const updated = await prisma.event.update({
      where: { eventId },
      data: {
        eventTitle: eventTitle ? String(eventTitle) : undefined,
        eventTypeId: eventTypeId ? parseInt(eventTypeId) : undefined,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        eventTime: eventTime && eventDate ? new Date(`${eventDate}T${eventTime}`) : undefined,
        eventEndTime: eventEndTime && eventDate ? new Date(`${eventDate}T${eventEndTime}`) : undefined,
        budget: budget !== undefined ? parseFloat(budget) : undefined,
        description: description !== undefined ? String(description) : undefined,
        // Location can only be updated on small events
        locationLat: isSmall && locationLat !== undefined ? parseFloat(locationLat) : undefined,
        locationLng: isSmall && locationLng !== undefined ? parseFloat(locationLng) : undefined,
        locationAddress: isSmall && locationAddress !== undefined ? String(locationAddress) : undefined,
        locationLabel: isSmall && locationLabel !== undefined ? String(locationLabel) : undefined,
        expectedGuests: expectedGuests !== undefined ? parseInt(expectedGuests) : undefined,
        dressCode: dressCode !== undefined ? String(dressCode) : undefined,
        specialNotes: specialNotes !== undefined ? String(specialNotes) : undefined,
      },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error updating event");
  }
};

// DELETE an event (ownership-checked)
export const deleteEvent = async (req, res) => {
  try {
    const eventId = parseInt(reqParamId(req));

    // Security fix: only the owner can delete their event
    const existing = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!existing) {
      return res.status(404).json({ message: "Event not found" });
    }

    await prisma.event.delete({ where: { eventId } });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting event");
  }
};