import { z } from 'zod'

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Content must be at least 10 charecter" })
        .max(300, { message: "Conternt must no longer than 300 charecter" })
})