import { z } from 'zod'

export const addChatMessageBodySchema = z.object({
  role: z.enum([
    'system',
    'user',
    'assistant',
  ]),

  content: z
    .string()
    .trim()
    .min(1, 'Message content must not be empty'),
})
