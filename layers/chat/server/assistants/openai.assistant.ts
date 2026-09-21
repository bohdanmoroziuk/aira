import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { Assistant } from '../ports/assistant.port'

export const createOpenAIAssistant = (apiKey: string, modelId = 'gpt-4o-mini'): Assistant => {
  const model = createOpenAI({ apiKey })(modelId)

  return {
    async generateReply(messages) {
      const response = await generateText({
        model,
        messages: messages.map(({ role, content }) => ({
          role,
          content,
        })),
      })

      return response.text.trim()
    },
  }
}
