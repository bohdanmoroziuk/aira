import { defineRouteMeta } from 'nitropack/runtime'
import { createProject } from '../../chat.container'
import { createProjectBodySchema } from '../../schemas/project.schema'

export default defineEventHandler(async (event) => {
  const input = await readValidatedBody(event, createProjectBodySchema.parse)

  const project = await createProject(input)

  setResponseStatus(event, 201)

  return project
})

defineRouteMeta({
  openAPI: {
    tags: ['Projects'],
    summary: 'Create a project',
    description: 'Creates a new project. The name is trimmed before it is validated and stored.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                type: 'string',
                description: 'Must be at least 3 characters long after surrounding whitespace is trimmed.',
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Project created successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'id',
                'name',
                'createdAt',
                'updatedAt',
              ],
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                name: {
                  type: 'string',
                  description: 'The trimmed name.',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Validation error: the body is missing, `name` is missing or not a string, or `name` is shorter than 3 characters after trimming.',
      },
    },
  },
})
