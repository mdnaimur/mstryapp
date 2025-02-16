import { boolean, z } from "zod"

export const acceptMessageSchema = z.object({
    acceptMessage: boolean()
})