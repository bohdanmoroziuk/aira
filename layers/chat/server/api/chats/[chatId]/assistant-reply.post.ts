import { defineRouteMeta } from 'nitropack/runtime'
import { generateAssistantReply } from '../../../chat.container'
import { chatParamsSchema } from '../../../schemas/chat.schema'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, chatParamsSchema.parse)

  const message = await generateAssistantReply(params.chatId)

  if (message) setResponseStatus(event, 201)

  return message
})

defineRouteMeta({
  openAPI: {
    tags: ['Chats'],
    summary: 'Generate an assistant reply',
    description: 'Generates an assistant reply to the chat\'s latest user message using the whole conversation as context, appends it to the chat, and returns it. Responds with 204 and no body, without calling the model, when `chatId` matches no chat, the chat has no messages, or its latest message is not from the user.',
    parameters: [
      {
        in: 'path',
        name: 'chatId',
        required: true,
        description: 'The id of the chat to reply in.',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    responses: {
      201: {
        description: 'Assistant reply generated and added to the chat.',
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
                  enum: ['assistant'],
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
        description: 'There is nothing to reply to: the chat does not exist, has no messages, or its latest message is not from the user; the response has no body.',
      },
      500: {
        description: 'The model request failed; nothing is added to the chat.',
      },
    },
  },
})
