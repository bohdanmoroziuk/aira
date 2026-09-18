import { defineRouteMeta } from 'nitropack/runtime'
import { createChat } from '../../chat.container'

export default defineEventHandler(async (event) => {
  const { title, projectId } = await readBody(event)

  const chat = await createChat({
    title,
    projectId,
  })

  return chat
})

defineRouteMeta({
  openAPI: {
    tags: ['Chats'],
    summary: 'Create a chat',
    description: 'Creates a new chat, optionally titled and linked to a project. Falls back to "Untitled Chat" when no title is given, and to no project when `projectId` doesn\'t match an existing project. A request body is required — omitting it entirely fails with a 500.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Defaults to "Untitled Chat" when omitted.',
              },
              projectId: {
                type: 'string',
                description: 'Must match an existing project\'s id; otherwise the chat is created without a project.',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Chat created successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'id',
                'title',
                'messages',
                'createdAt',
                'updatedAt',
              ],
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                title: { type: 'string' },
                messages: {
                  type: 'array',
                  items: { type: 'object' },
                  description: 'Always empty for a newly created chat.',
                },
                projectId: { type: 'string' },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                },
                project: {
                  type: 'object',
                  description: 'Present only when `projectId` matched an existing project.',
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
  },
})
