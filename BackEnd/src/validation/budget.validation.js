import z from "zod";

export const addExpenseSchema = z.object({
  body: z.object({
    eventId:       z.preprocess((v) => Number(v), z.number().int().positive("eventId is required")),
    name:          z.string().min(1, "Expense name is required").max(150),
    category:      z.string().min(1, "Category is required").max(100),
    estimatedCost: z.preprocess((v) => Number(v), z.number().nonnegative("Estimated cost must be 0 or greater")),
    actualCost:    z.preprocess((v) => (v !== undefined ? Number(v) : 0),
                     z.number().nonnegative("Actual cost must be 0 or greater").optional()),
  }),
});

// For PUT — all fields optional
export const updateExpenseSchema = z.object({
  body: z.object({
    name:          z.string().min(1).max(150).optional(),
    category:      z.string().min(1).max(100).optional(),
    estimatedCost: z.preprocess((v) => Number(v), z.number().nonnegative()).optional(),
    actualCost:    z.preprocess((v) => Number(v), z.number().nonnegative()).optional(),
  }),
});
