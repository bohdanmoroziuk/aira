import { z } from 'zod'
import { projectNameSchema } from '../../schemas/project.schema'

export const createProjectBodySchema = z.object({
  name: projectNameSchema,
})
