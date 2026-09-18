import { z } from 'zod'

export const createProjectBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Project name must be at least 3 characters long'),
})
