import { z } from 'zod'
import { entityIdSchema } from './id.schema'

export const projectNameSchema = z
  .string()
  .trim()
  .min(3, 'Project name must be at least 3 characters long')

export const projectParamsSchema = z.object({
  projectId: entityIdSchema,
})
