import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";
import { reqParamId } from "../utils/reqBody.utils.js";

// GET all attendees for an event
export const getGuests = async (req, res) => {
  try {
    const guests = await prisma.attendee.findMany({
      where: { eventId: parseInt(reqParamId(req)) },
    });
    // Bug fix: 200 for GET (not 201), empty array is a valid response
    res.status(200).json(guests);
  } catch (err) {
    handleServerError(res, err, "Fetching guests incomplete");
  }
};

// POST — Add a new guest to an event
export const addGuest = async (req, res) => {
  try {
    // Bug fix: destructure eventId, use String() not global toString()
    const { name, email, eventId } = req.body;

    const guest = await prisma.attendee.create({
      data: {
        name: String(name),
        email: String(email),
        eventId: parseInt(eventId),  // Bug fix: was missing — required FK
      },
    });

    // Bug fix: was never sending a response — client hung forever
    res.status(201).json(guest);
  } catch (err) {
    handleServerError(res, err, "Internal server error");
  }
};

// GET a specific attendee by ID
export const getGuestById = async (req, res) => {
  try {
    const guest = await prisma.attendee.findUnique({
      where: { attendeeId: parseInt(reqParamId(req)) },
    });
    if (!guest) {
      return res.status(404).json({ message: "The guest is not in the list" });
    }
    // Bug fix: 200 for GET (not 201)
    res.status(200).json(guest);
  } catch (err) {
    handleServerError(res, err, "Fetching guest incomplete");
  }
};

// PUT — Update attendee details or RSVP status
export const updateGuestInfo = async (req, res) => {
  try {
    const { name, email, status } = req.body;
    const updateGuest = await prisma.attendee.update({
      where: { attendeeId: parseInt(reqParamId(req)) },
      data: {
        name: name ? String(name) : undefined,
        email: email ? String(email) : undefined,
        status: status || undefined,
        responseTime: status ? new Date() : undefined,
      },
    });
    // Bug fix: 200 for update response (not 201)
    res.status(200).json(updateGuest);
  } catch (err) {
    handleServerError(res, err, "Updating guest incomplete");
  }
};

// DELETE a guest from an event
export const deleteGuest = async (req, res) => {
  try {
    await prisma.attendee.delete({
      where: { attendeeId: parseInt(reqParamId(req)) },
    });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting guest");
  }
};
