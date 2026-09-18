import { defineEventHandler } from 'h3'
import { defineRouteMeta } from 'nitropack/runtime'
import { getChats } from '../../chat.container'

export default defineEventHandler(async () => {
  const chats = await getChats()

  return chats
})

defineRouteMeta({
  openAPI: {
    tags: ['Chats'],
    summary: 'List chats',
    description: 'Returns every chat, most recently updated first, each with its linked project (if any).',
    responses: {
      200: {
        description: 'Chats retrieved successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
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
                    items: {
                      type: 'object',
                      required: [
                        'id',
                        'role',
                        'content',
                        'createdAt',
                        'updatedAt',
                      ],
                      properties: {
                        id: {
                          type: 'string',
                          format: 'uuid',
                        },
                        role: {
                          type: 'string',
                          enum: [
                            'system',
                            'user',
                            'assistant',
                          ],
                        },
                        content: { type: 'string' },
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
                    description: 'Present only when the chat is linked to a project that still exists.',
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
  },
})
