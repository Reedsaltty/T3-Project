import z from "zod";

export const createAgendaSchema = z.object({
  body: z.object({
    title:       z.string().min(1, "Agenda item title is required").max(150),
    description: z.string().max(1000).optional(),
    startTime:   z.string().min(1, "Start time is required"),
    endTime:     z.string().min(1, "End time is required"),
  }).superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end   = new Date(data.endTime);
    if (isNaN(start.getTime())) ctx.addIssue({ path: ["startTime"], message: "Invalid start time format" });
    if (isNaN(end.getTime()))   ctx.addIssue({ path: ["endTime"],   message: "Invalid end time format" });
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
      ctx.addIssue({ path: ["endTime"], message: "End time must be after start time" });
    }
  }),
});

export const updateAgendaSchema = z.object({
  body: z.object({
    title:       z.string().min(1).max(150).optional(),
    description: z.string().max(1000).optional(),
    startTime:   z.string().optional(),
    endTime:     z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end   = new Date(data.endTime);
      if (end <= start) {
        ctx.addIssue({ path: ["endTime"], message: "End time must be after start time" });
      }
    }
  }),
});
