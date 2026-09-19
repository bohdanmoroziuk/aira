import { z } from 'zod'

export const projectNameSchema = z
  .string()
  .trim()
  .min(3, 'Project name must be at least 3 characters long')

export const createProjectBodySchema = z.object({
  name: projectNameSchema,
})

export const projectParamsSchema = z.object({
  projectId: z.string().min(1),
})

export const updateProjectBodySchema = z.object({
  name: projectNameSchema,
})
