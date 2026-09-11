import { generateText, type ModelMessage, type LanguageModel } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export const createOpenAIModel = (apiKey: string, modelId = 'gpt-4o-mini') => {
  const openai = createOpenAI({ apiKey })
  const openaiModel = openai(modelId)

  return openaiModel
}

// TODO: validate message shape (role/content), not just array length.
export const generateChatResponse = async (model: LanguageModel, messages: ModelMessage[]) => {
  if (messages.length === 0) {
    throw new Error('Invalid messages format')
  }

  const response = await generateText({
    model,
    messages,
  })

  return response.text.trim()
}
