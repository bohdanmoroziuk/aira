import type { Assistant } from '../../ports/assistant.port'
import type { ChatRepository } from '../../ports/chat.repository.port'

export const makeGenerateAssistantReplyUseCase = (
  chatRepository: ChatRepository,
  assistant: Assistant,
) => {
  return async (chatId: string) => {
    const messages = await chatRepository.getChatMessages(chatId)

    if (messages.at(-1)?.role !== 'user') return null

    const content = await assistant.generateReply(messages)

    return chatRepository.addChatMessage(chatId, {
      role: 'assistant',
      content,
    })
  }
}
