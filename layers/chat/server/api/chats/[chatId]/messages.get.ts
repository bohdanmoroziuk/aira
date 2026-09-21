import { defineRouteMeta } from 'nitropack/runtime'
import { getChatMessages } from '../../../chat.container'
import { chatParamsSchema } from '../../../schemas/chat.schema'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, chatParamsSchema.parse)
  const messages = await getChatMessages(params.chatId)

  return messages
})

defineRouteMeta({
  openAPI: {
    tags: ['Chats'],
    summary: 'List chat messages',
    description: 'Returns every message of a chat in the order it was added. Responds with an empty array when no chat matches `chatId`.',
    parameters: [
      {
        in: 'path',
        name: 'chatId',
        required: true,
        description: 'The id of the chat whose messages to retrieve.',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    responses: {
      200: {
        description: 'Messages retrieved successfully. The array is empty when the chat has no messages or does not exist.',
        content: {
          'application/json': {
            schema: {
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
          },
        },
      },
    },
  },
})
