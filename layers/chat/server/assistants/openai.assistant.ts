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

    async generateTitle(message: string) {
      const response = await generateText({
        model,
        instructions: 'You are a helpful assistant that generates concise, descriptive titles for chat conversations. Generate a title that captures the essence of the first message in a few words.',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      })

      return response.text.trim()
    },
  }
}
