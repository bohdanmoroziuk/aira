import { defineRouteMeta } from 'nitropack/runtime'
import { generateChatTitle } from '../../../chat.container'
import { chatParamsSchema } from '../../../schemas/chat.schema'
import { generateChatTitleBodySchema } from '../../../flows/generate-chat-title'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, chatParamsSchema.parse)
  const body = await readValidatedBody(event, generateChatTitleBodySchema.parse)
  const chat = await generateChatTitle(params.chatId, body)

  return chat
})

defineRouteMeta({
  openAPI: {
    tags: ['Chats'],
    summary: 'Generate a chat title',
    description: 'Generates a short title from the given user message text, saves it as the chat\'s `title` (refreshing `updatedAt`, and replacing any previous title), and returns the updated chat. Responds with 204 and no body when no chat matches `chatId`.',
    parameters: [
      {
        in: 'path',
        name: 'chatId',
        required: true,
        description: 'The id of the chat to title.',
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
            required: ['text'],
            properties: {
              text: {
                type: 'string',
                description: 'The user message to title the chat after. Must not be empty once surrounding whitespace is trimmed.',
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Title generated and saved.',
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
                  description: 'Only the first message, as a preview; use `GET /api/chats/{chatId}/messages` for the full history.',
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
      204: {
        description: 'No chat exists with the given `chatId`; the response has no body.',
      },
      400: {
        description: 'The body is invalid: `text` is missing, not a string, or empty once trimmed.',
      },
      500: {
        description: 'The model request failed; the chat is left unchanged.',
      },
    },
  },
})
