import z from "zod";

export const eventSchema = z.object({
  body: z.object({
    eventTitle: z.string().min(1, "Event detail must not empty "),
    eventDate: z.string().min(1, "Event date is required"),
    eventTime: z.string().min(1, "Event start time is required"),
    eventEndTime: z.string().min(1, "Event end time is required"),
    budget: z.preprocess((val) => Number(val),z.number().nonnegative('Budget must be 0 or greater'))
  }).superRefine((data, ctx) => {
    // 1. Parse both as local Date objects
    const start = new Date(`${data.eventDate}T${data.eventTime}`);
    const end = new Date(`${data.eventDate}T${data.eventEndTime}`);
    const now = new Date();

    // 2. Combined past check (handles both past dates and past times today!)
    if (start <= now) {
      ctx.addIssue({
        message: 'Event start date/time cannot be in the past',
        path: ['eventTime']
      });
    }

    // 3. End time check
    if (end <= start) {
      ctx.addIssue({
        message: 'Event end time must be after the start time',
        path: ['eventEndTime']
      });
    }
  })

  });
