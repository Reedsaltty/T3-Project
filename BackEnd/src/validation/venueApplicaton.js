import z from 'zod';

// For: POST /api/venue-applications
// Spec 5.3: User submits a new application
const createVenueApplicationSchema = z.object({
  venueName: z.string().min(3).max(150),
  venueLocation: z.string().min(5).max(255),
  venueCapacity: z.number().int().positive().min(1),
  contactEmail: z.string().email(),
  description: z.string().max(1000).optional(),
});

// For: PATCH /api/venue-applications/:id/reject
// Spec 5.5: Admin rejects an application (requires a reason)
const rejectVenueApplicationSchema = z.object({
  rejectionReason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

export { createVenueApplicationSchema, rejectVenueApplicationSchema };