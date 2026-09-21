import { defineRouteMeta } from 'nitropack/runtime'
import { addChatMessage } from '../../../chat.container'
import { chatParamsSchema } from '../../../schemas/chat.schema'
import { addChatMessageBodySchema } from '../../../flows/add-chat-message'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, chatParamsSchema.parse)
  const body = await readValidatedBody(event, addChatMessageBodySchema.parse)

  const message = await addChatMessage(params.chatId, body)

  if (message) setResponseStatus(event, 201)

  return message
})

defineRouteMeta({
  openAPI: {
    tags: ['Chats'],
    summary: 'Add a message to a chat',
    description: 'Appends a message to the end of a chat and refreshes the chat\'s `updatedAt`. The content is trimmed before it is validated and stored. Responds with 204 and no body when no chat matches `chatId`.',
    parameters: [
      {
        in: 'path',
        name: 'chatId',
        required: true,
        description: 'The id of the chat to add the message to.',
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
            required: [
              'role',
              'content',
            ],
            properties: {
              role: {
                type: 'string',
                enum: [
                  'system',
                  'user',
                  'assistant',
                ],
              },
              content: {
                type: 'string',
                description: 'Must not be empty once surrounding whitespace is trimmed.',
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Message added successfully.',
        content: {
          'application/json': {
            schema: {
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
      204: {
        description: 'No chat exists with the given `chatId`; the response has no body.',
      },
      400: {
        description: 'The body is invalid: `role` is not one of the allowed values or `content` is missing, not a string, or empty once trimmed.',
      },
    },
  },
})
