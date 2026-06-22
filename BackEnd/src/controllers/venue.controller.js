import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";
import { reqParamId } from "../utils/reqBody.utils.js";


/**
 * Fetches all venues from the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getVenue = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany();

    if (!venues) {
      res.status(204).json({ message: "No venues available right now" });
      return;
    }

    res.status(201).json(venues);
  } catch (err) {
    handleServerError(res, err, "Error fetching evenues");
  }
};


/**
 * Fetches a specific venue by its ID from request parameters.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getVenueById = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      where: {
        venueId: parseInt(reqParamId(req)),
      },
    });
    if (!venues) {
      res.status(204).json({ message: "No venues available right now" });
      return;
    }
    res.status(201).json(venues);
  } catch (err) {
    handleServerError(res, err, "Error fetching venues");
  }
};


/**
 * Fetches the venue booking record associated with an event ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBookingVenue = async (req, res) => {
  try {
    const bookVenue = await prisma.venueBooking.findUnique({
      where: {
        eventId: parseInt(reqParamId(req)),
      },
    });

    if (!bookVenue) {
      res.status(204).json({ message: "No venues available" });
      return;
    }
    res.status(201).json(bookVenue);
  } catch (err) {
    handleServerError(res, err, "Error fetching evenues");
  }
};


/**
 * Fetches all venues owned by a specific owner ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getVenueForOwner = async (req, res) => {
  try {
    const venue = await prisma.venue.findMany({
      where: {
        ownerId: parseInt(reqParamId(req)),
      },
    });
    if (!venue) {
      res.status(204).json({ message: "No venues available" });
      return;
    }
    res.status(201).json(venue);
  } catch (err) {
    handleServerError(res, err, "Error fetching data");
  }
};


/**
 * Creates a new venue in the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const setUpVenue = async (req, res) => {
  try {
    const { name, location, capacity, contactEmail } = req.body;
    const newVenue = await prisma.venue.create({
      data: {
        name: name.toString(),
        location: location.toString(),
        capacity: parseInt(capacity),
        contactEmail: contactEmail.toString(),
        ownerId: parseInt(reqParamId(req)), // Fixed from res to req
      },
    });
    if (!newVenue) {
      res.status(204).json({ message: "Error creating venue" });
      return;
    }
    res.status(201).json(newVenue);
  } catch (err) {
    handleServerError(res, err, "Internal server error ");
  }
};


/**
 * Updates an existing venue by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateVenue = async (req, res) => {
  try {
    const { name, location, capacity, contactEmail } = req.body;
    const updatedVenue = await prisma.venue.update({
      where: { venueId: parseInt(reqParamId(req)) }, // Fixed from res to req
      data: {
        name: name.toString(),
        location: location.toString(),
        capacity: parseInt(capacity),
        contactEmail: contactEmail.toString(),
      },
    });
    res.status(201).json(updatedVenue);
  } catch (err) {
    handleServerError(res, err, "Internal server error");
  }
};


/**
 * Deletes a venue from the database by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteVenue = async (req, res) => {
  try {
    await prisma.venue.delete({
      where: {
        venueId: parseInt(reqParamId(req)) // Fixed from res to req
      }
    })
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error delete venue");
  }
};
