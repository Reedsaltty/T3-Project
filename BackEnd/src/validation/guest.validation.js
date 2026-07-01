import z from 'zod'


export const guestSchema = z.object({
    body: z.object({
        eventId: z.preprocess((v) => Number(v), z.number().int().positive("A valid event ID is required")),
        name: z.string().min(2, "The name of the guest must be at least 2 characters"),
        email: z.string().email('Invalid email address'),
    })
})