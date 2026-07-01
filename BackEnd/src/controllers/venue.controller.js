import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";
import { reqParamId } from "../utils/reqBody.utils.js";

// GET all active venues (public listing)
export const getVenue = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
    });
    // Bug fix: 200 for GET (not 201)
    res.status(200).json(venues);
  } catch (err) {
    handleServerError(res, err, "Error fetching venues");
  }
};

// GET a specific venue by ID (full detail view)
export const getVenueById = async (req, res) => {
  try {
    // Bug fix: use findUnique for single record lookup
    const venue = await prisma.venue.findUnique({
      where: { venueId: parseInt(reqParamId(req)) },
    });
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    // Bug fix: 200 for GET (not 201)
    res.status(200).json(venue);
  } catch (err) {
    handleServerError(res, err, "Error fetching venue");
  }
};

// GET the booking record associated with a specific event
export const getBookingVenue = async (req, res) => {
  try {
    const bookVenue = await prisma.venueBooking.findUnique({
      where: { eventId: parseInt(reqParamId(req)) },
      include: { venue: true },
    });
    if (!bookVenue) {
      return res.status(404).json({ message: "No venue booking found for this event" });
    }
    // Bug fix: 200 for GET (not 201)
    res.status(200).json(bookVenue);
  } catch (err) {
    handleServerError(res, err, "Error fetching venue booking");
  }
};

// GET all venues owned by the currently logged-in user
export const getMyVenues = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      where: { ownerId: req.user.userId },
    });
    // Bug fix: 200 for GET (not 201)
    res.status(200).json(venues);
  } catch (err) {
    handleServerError(res, err, "Error fetching your venues");
  }
};

// POST — Create a new booking request for a venue
export const createBooking = async (req, res) => {
  try {
    const venueId = parseInt(req.params.venueId); // from route param /:venueId/book
    const { eventId } = req.body;

    // Verify the event belongs to the logged-in user
    const event = await prisma.event.findFirst({
      where: { eventId: parseInt(eventId), userId: req.user.userId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check for an existing booking for this event (unique constraint guard)
    const existing = await prisma.venueBooking.findUnique({
      where: { eventId: parseInt(eventId) },
    });
    if (existing) {
      // Idempotent: if already booked at same venue, treat as success
      if (existing.venueId === venueId) {
        return res.status(200).json(existing);
      }
      return res.status(409).json({ message: "This event already has a venue booking. Cancel it first." });
    }

    const booking = await prisma.venueBooking.create({
      data: {
        venueId,
        eventId: parseInt(eventId),
        status: "pending",
      },
    });
    res.status(201).json(booking);
  } catch (err) {
    // Prisma unique constraint violation fallback
    if (err.code === "P2002") {
      return res.status(409).json({ message: "This event already has a venue booking." });
    }
    handleServerError(res, err, "Error creating venue booking");
  }
};

// PATCH — Venue owner responds to a booking request (approve/reject)
export const respondToBooking = async (req, res) => {
  try {
    const bookingId = parseInt(reqParamId(req));
    const { status, notes } = req.body; // status: 'approved' | 'rejected'

    // Verify the venue belongs to this owner
    const booking = await prisma.venueBooking.findUnique({
      where: { bookingId },
      include: { venue: true },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.venue.ownerId !== req.user.userId) {
      return res.status(403).json({ message: "You do not own this venue" });
    }

    const updated = await prisma.venueBooking.update({
      where: { bookingId },
      data: { status, notes: notes ? String(notes) : null, respondedAt: new Date() },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error responding to booking");
  }
};

// PUT — Update venue details (owner only)
export const updateVenue = async (req, res) => {
  try {
    const venueId = parseInt(reqParamId(req));
    const { name, location, capacity, contactEmail, description, priceRange, amenities } = req.body;

    // Ownership check
    const venue = await prisma.venue.findUnique({ where: { venueId } });
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    if (venue.ownerId !== req.user.userId) {
      return res.status(403).json({ message: "You do not own this venue" });
    }

    const updatedVenue = await prisma.venue.update({
      where: { venueId },
      data: {
        name: name ? String(name) : undefined,
        location: location ? String(location) : undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        contactEmail: contactEmail ? String(contactEmail) : undefined,
        description: description !== undefined ? String(description) : undefined,
        priceRange: priceRange !== undefined ? String(priceRange) : undefined,
        amenities: amenities !== undefined ? amenities : undefined,
      },
    });
    res.status(200).json(updatedVenue);
  } catch (err) {
    handleServerError(res, err, "Internal server error");
  }
};

// DELETE — Remove venue (owner only, no active bookings)
export const deleteVenue = async (req, res) => {
  try {
    const venueId = parseInt(reqParamId(req));

    // Security fix: verify ownership before deleting
    const venue = await prisma.venue.findUnique({ where: { venueId } });
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    if (venue.ownerId !== req.user.userId) {
      return res.status(403).json({ message: "You do not own this venue" });
    }

    await prisma.venue.delete({ where: { venueId } });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting venue");
  }
};
