import type { ChatRepository } from '../../ports/chat.repository.port'

export type AddChatMessageInput = {
  role: ChatRole
  content: string
}

export const makeAddChatMessageUseCase = (chatRepository: ChatRepository) => {
  return (chatId: string, input: AddChatMessageInput) => chatRepository.addChatMessage(chatId, input)
}
