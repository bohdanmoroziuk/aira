import { z } from 'zod'

export const createChatBodySchema = z.object({
  title: z.string().optional(),
  projectId: z.string().optional(),
})
