import { defineRouteMeta } from 'nitropack/runtime'
import { deleteProject } from '../../../chat.container'
import { projectParamsSchema } from '../../../schemas/project.schema'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, projectParamsSchema.parse)

  const isDeleted = await deleteProject(params.projectId)

  return isDeleted
})

defineRouteMeta({
  openAPI: {
    tags: ['Projects'],
    summary: 'Delete a project',
    description: 'Deletes an existing project. Responds with `true` when the project was deleted and `false` when no project matches `projectId`.',
    parameters: [
      {
        in: 'path',
        name: 'projectId',
        required: true,
        description: 'The id of the project to delete.',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    responses: {
      200: {
        description: '`true` if the project was deleted, `false` if it did not exist.',
        content: {
          'application/json': {
            schema: { type: 'boolean' },
          },
        },
      },
    },
  },
})
