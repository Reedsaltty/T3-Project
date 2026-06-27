import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";

// GET /api/admin/venues  — All venues (active + inactive)
export const getAdminVenues = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        owner: { select: { username: true, email: true } },
        bookingRequests: { select: { status: true } },
      },
      orderBy: { venueId: "asc" },
    });
    res.status(200).json(venues);
  } catch (err) {
    handleServerError(res, err, "Error fetching venues");
  }
};

// PATCH /api/admin/venues/:id  — Admin updates any venue's details
export const updateAnyVenue = async (req, res) => {
  try {
    const venueId = parseInt(req.params.id);
    const { name, location, capacity, contactEmail, description, priceRange, amenities } = req.body;

    const venue = await prisma.venue.findUnique({ where: { venueId } });
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    const updated = await prisma.venue.update({
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
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error updating venue");
  }
};

// PATCH /api/admin/venues/:id/toggle-active  — Soft-delete / re-activate
export const toggleVenueActive = async (req, res) => {
  try {
    const venueId = parseInt(req.params.id);

    const venue = await prisma.venue.findUnique({ where: { venueId } });
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    const updated = await prisma.venue.update({
      where: { venueId },
      data: { isActive: !venue.isActive },
    });
    res.status(200).json({
      message: `Venue ${updated.isActive ? "activated" : "deactivated"} successfully`,
      isActive: updated.isActive,
    });
  } catch (err) {
    handleServerError(res, err, "Error toggling venue status");
  }
};
