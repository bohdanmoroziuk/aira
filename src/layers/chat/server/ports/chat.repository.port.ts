import type { Chat } from '../../shared/types/chat.types'

type CreateChatData = {
  title?: string
  projectId?: string
}

export type ChatRepository = {
  getChats: () => Promise<Chat[]>
  createChat: (data: CreateChatData) => Promise<Chat>
}
