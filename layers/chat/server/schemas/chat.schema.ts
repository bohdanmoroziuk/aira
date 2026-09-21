import { z } from 'zod'

export const chatParamsSchema = z.object({
  chatId: z.string().min(1),
})
