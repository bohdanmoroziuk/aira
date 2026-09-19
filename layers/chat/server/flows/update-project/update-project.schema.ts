import { z } from 'zod'
import { projectNameSchema } from '../../schemas/project.schema'

export const updateProjectBodySchema = z.object({
  name: projectNameSchema,
})
