import { z } from 'zod'
import { entityIdSchema } from '../../schemas/id.schema'

export const createChatBodySchema = z.object({
  title: z.string().optional(),
  projectId: entityIdSchema.optional(),
})
