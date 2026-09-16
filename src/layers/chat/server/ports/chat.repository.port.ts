import type { Chat } from '../../shared/types/chat.types'

export type ChatRepositoryPort = {
  getChats: () => Promise<Chat[]>
}
