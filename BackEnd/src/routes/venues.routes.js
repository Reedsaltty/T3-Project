import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { deleteVenue, getBookingVenue, getVenue, getVenueById, updateVenue, setUpVenue } from "../controllers/venue.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { venueSchema } from "../validation/venue.validation.js";
import { updateEvent } from "../controllers/event.controller.js";

const router = express.Router();

// All venue routes are protected — user must be logged in
router.use(authMiddleware);

/**
 * @route   GET /api/venues
 * @desc    Get all available venues
 * @access  Private
 */
router.get("/api/venues", getVenue);

/**
 * @route   GET /api/venues/:venueId
 * @desc    Get a specific venue by its ID
 * @access  Private
 */
router.get("/api/venues/:venueId", getVenueById);

/**
 * @route   GET /api/venues/booking
 * @desc    Get venue booking information for a specific event
 * @access  Private
 */
router.get("/api/venues/booking", getBookingVenue);

/**
 * @route   POST /api/venues
 * @desc    Create and set up a new venue
 * @access  Private
 */
router.post("/api/venues", validate(venueSchema), setUpVenue);

/**
 * @route   PUT /api/venues/:venueId
 * @desc    Update an existing venue's details
 * @access  Private
 */
router.put("/api/venues/:venueId", validate(venueSchema), updateVenue);

/**
 * @route   DELETE /api/venues/:venueId
 * @desc    Delete a venue from the platform
 * @access  Private
 */
router.delete("/api/venues/:venueId", deleteVenue);

export default router;
