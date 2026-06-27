import z from "zod";

// ── Shared base fields for both event sizes ──────────────────────────────────
const baseEventFields = z.object({
  eventTitle:   z.string().min(3, "Event title must be at least 3 characters").max(200),
  eventTypeId:  z.preprocess((v) => Number(v), z.number().int().positive("Invalid event type")),
  eventDate:    z.string().min(1, "Event date is required"),
  eventTime:    z.string().min(1, "Event start time is required"),
  eventEndTime: z.string().min(1, "Event end time is required"),
  budget:       z.preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)),
                  z.number().nonnegative("Budget must be 0 or greater").optional()),
  description:  z.string().max(1000).optional(),
  expectedGuests: z.preprocess((v) => (v !== undefined ? Number(v) : undefined),
                    z.number().int().min(1, "Expected guests must be at least 1").optional()),
  dressCode:    z.enum(["Casual", "Semi-formal", "Formal", "Themed"]).optional(),
  specialNotes: z.string().max(500).optional(),
});

// ── Small-event extra fields ──────────────────────────────────────────────────
const smallEventFields = baseEventFields.extend({
  eventSize:       z.literal("small"),
  locationLat:     z.preprocess((v) => Number(v), z.number().min(-90).max(90, "Invalid latitude")),
  locationLng:     z.preprocess((v) => Number(v), z.number().min(-180).max(180, "Invalid longitude")),
  locationAddress: z.string().max(500).optional(),
  locationLabel:   z.string().max(200).optional(),
});

// ── Big-event extra fields ────────────────────────────────────────────────────
const bigEventFields = baseEventFields.extend({
  eventSize: z.literal("big"),
  // Location fields are irrelevant for big events — strip them if present
  locationLat:     z.any().optional().transform(() => undefined),
  locationLng:     z.any().optional().transform(() => undefined),
  locationAddress: z.any().optional().transform(() => undefined),
  locationLabel:   z.any().optional().transform(() => undefined),
});

// ── Discriminated union on eventSize ─────────────────────────────────────────
const eventBody = z.discriminatedUnion("eventSize", [smallEventFields, bigEventFields])
  .superRefine((data, ctx) => {
    const start = new Date(`${data.eventDate}T${data.eventTime}`);
    const end   = new Date(`${data.eventDate}T${data.eventEndTime}`);
    const now   = new Date();

    if (start <= now) {
      ctx.addIssue({ path: ["eventTime"], message: "Event start date/time cannot be in the past" });
    }
    if (end <= start) {
      ctx.addIssue({ path: ["eventEndTime"], message: "Event end time must be after the start time" });
    }
    if (data.budget !== undefined && data.budget < 0) {
      ctx.addIssue({ path: ["budget"], message: "Budget must be a positive number" });
    }
    if (data.expectedGuests !== undefined && data.expectedGuests < 1) {
      ctx.addIssue({ path: ["expectedGuests"], message: "Expected guests must be at least 1" });
    }
  });

// Wrapped in { body: ... } to match the validate() middleware convention
export const eventSchema = z.object({ body: eventBody });

// For PUT — eventSize is not re-validated (it's locked), all fields optional
export const updateEventSchema = z.object({
  body: z.object({
    eventTitle:    z.string().min(3).max(200).optional(),
    eventTypeId:   z.preprocess((v) => Number(v), z.number().int().positive()).optional(),
    eventDate:     z.string().optional(),
    eventTime:     z.string().optional(),
    eventEndTime:  z.string().optional(),
    budget:        z.preprocess((v) => Number(v), z.number().nonnegative()).optional(),
    description:   z.string().max(1000).optional(),
    locationLat:   z.preprocess((v) => Number(v), z.number().min(-90).max(90)).optional(),
    locationLng:   z.preprocess((v) => Number(v), z.number().min(-180).max(180)).optional(),
    locationAddress: z.string().max(500).optional(),
    locationLabel:   z.string().max(200).optional(),
    expectedGuests:  z.preprocess((v) => Number(v), z.number().int().min(1)).optional(),
    dressCode:     z.enum(["Casual", "Semi-formal", "Formal", "Themed"]).optional(),
    specialNotes:  z.string().max(500).optional(),
  }).superRefine((data, ctx) => {
    if (data.eventDate && data.eventTime && data.eventEndTime) {
      const start = new Date(`${data.eventDate}T${data.eventTime}`);
      const end   = new Date(`${data.eventDate}T${data.eventEndTime}`);
      if (end <= start) {
        ctx.addIssue({ path: ["eventEndTime"], message: "Event end time must be after the start time" });
      }
    }
  }),
});
