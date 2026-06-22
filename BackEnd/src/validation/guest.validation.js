import z from 'zod'


export const guestSchema = z.object({
    body:z.object({
        name: z.string().min(2,"The name of the guest must be atleast 2 character"),
        email: z.email('Invalid email address')
    })

})