import { z } from 'zod'

export const projectNameSchema = z
  .string()
  .trim()
  .min(3, 'Project name must be at least 3 characters long')

export const projectParamsSchema = z.object({
  projectId: z.string().min(1),
})
