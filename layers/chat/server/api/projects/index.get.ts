import { defineRouteMeta } from 'nitropack/runtime'
import { getProjects } from '../../chat.container'

export default defineEventHandler(async () => {
  const projects = await getProjects()

  return projects
})

defineRouteMeta({
  openAPI: {
    tags: ['Projects'],
    summary: 'List projects',
    description: 'Returns every project, sorted alphabetically by name.',
    responses: {
      200: {
        description: 'Projects retrieved successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
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
      },
    },
  },
})
