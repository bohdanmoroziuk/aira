import type { ChatRepositoryPort } from '../ports/chat.repository.port'

export const makeGetChatsUseCase = (chatRepository: ChatRepositoryPort) => {
  return () => {
    return chatRepository.getChats()
  }
}
