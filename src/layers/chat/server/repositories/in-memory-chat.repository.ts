import type { Chat } from '../../shared/types/chat.types'
import type { ChatRepositoryPort } from '../ports/chat.repository.port'

export const createInMemoryChatRepository = (): ChatRepositoryPort => {
  const chats: Chat[] = []

  return {
    getChats() {
      return Promise.resolve([...chats])
    },
  }
}
