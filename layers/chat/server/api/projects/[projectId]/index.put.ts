import { defineRouteMeta } from 'nitropack/runtime'
import { updateProject } from '../../../chat.container'
import { projectParamsSchema, updateProjectBodySchema } from '../../../schemas/project.schema'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, projectParamsSchema.parse)
  const body = await readValidatedBody(event, updateProjectBodySchema.parse)

  const project = await updateProject(params.projectId, body)

  return project
})

defineRouteMeta({
  openAPI: {
    tags: ['Projects'],
    summary: 'Update a project',
    description: 'Renames an existing project and refreshes its `updatedAt`. The name is trimmed before it is validated and stored. Responds with 204 and no body when no project matches `projectId`.',
    parameters: [
      {
        in: 'path',
        name: 'projectId',
        required: true,
        description: 'The id of the project to update.',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
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
      200: {
        description: 'Project updated successfully.',
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
      204: {
        description: 'No project exists with the given `projectId`; the response has no body.',
      },
    },
  },
})
