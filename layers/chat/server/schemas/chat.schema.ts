import { z } from 'zod'
import { entityIdSchema } from './id.schema'

export const chatParamsSchema = z.object({
  chatId: entityIdSchema,
})
