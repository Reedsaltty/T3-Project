import z from "zod";

// POST — only description needed
export const addChecklistItemSchema = z.object({
  body: z.object({
    description: z.string().min(1, "Description is required").max(1000),
  }),
});

// PUT — only description can be edited (isDone is changed via the /toggle endpoint)
export const updateChecklistItemSchema = z.object({
  body: z.object({
    description: z.string().min(1, "Description is required").max(1000),
  }),
});
