import type { ChatRepository } from '../../ports/chat.repository.port'

export const makeGetChatMessagesUseCase = (chatRepository: ChatRepository) => {
  return (chatId: string) => chatRepository.getChatMessages(chatId)
}
