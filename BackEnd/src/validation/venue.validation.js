import z from 'zod'

export const venueSchema = z.object({
    body:z.object({
        name: z.string().min(2,"venue name must be at least 2 letter"),
        // location: z.location
        capacity: z.number().int().gt(20,"venue capacity must be at least 20"),
        contactEmail: z.email('Invalid email address'),
    })
})


