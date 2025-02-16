import { z } from 'zod'

export const usernameValidaton = z
    .string()
    .min(3, "Username must be atleast 3 charecter")
    .max(20, "Username must be nor more than 20 charecter")
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special character');


export const signUpSchema = z.object({
    username: usernameValidaton,
    email: z.string().email({ message: "Invalid email Address" }),
    password: z.string().min(6, { message: "password must be at least 6 charecter" })
})