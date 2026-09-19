import { defineRouteMeta } from 'nitropack/runtime'
import { getProject } from '../../../chat.container'
import { projectParamsSchema } from '../../../schemas/project.schema'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, projectParamsSchema.parse)

  const project = await getProject(params.projectId)

  return project
})

defineRouteMeta({
  openAPI: {
    tags: ['Projects'],
    summary: 'Get a project',
    description: 'Returns a single project by id. Responds with 204 and no body when no project matches `projectId`.',
    parameters: [
      {
        in: 'path',
        name: 'projectId',
        required: true,
        description: 'The id of the project to retrieve.',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    responses: {
      200: {
        description: 'Project retrieved successfully.',
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
                name: { type: 'string' },
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
      204: {
        description: 'No project exists with the given `projectId`; the response has no body.',
      },
    },
  },
})
