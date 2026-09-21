import { z } from 'zod'

export const generateChatTitleBodySchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Message text must not be empty'),
})
