import { defineEventHandler, readBody } from 'h3'
import { createError, useRuntimeConfig } from '#imports'
import { generateUuid } from '../../../base/shared/utils/common.utils'
import { createOpenAIModel, generateChatResponse } from '../services/ai.service'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return String(error)
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { messages } = body

    const openaiApiKey = useRuntimeConfig().openaiApiKey
    const openaiModel = createOpenAIModel(openaiApiKey)

    const response = await generateChatResponse(openaiModel, messages)

    return {
      id: generateUuid(),
      role: 'assistant',
      content: response,
    }
  } catch (error) {
    // FIXME: exposes the raw error message to the client with no server-side
    // logging; log `error` and return a generic message once this route
    // needs to be production-ready.
    throw createError({
      statusCode: 500,
      statusMessage: getErrorMessage(error),
    })
  }
})
