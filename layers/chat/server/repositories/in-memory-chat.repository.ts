import type { ChatRepository } from '../ports/chat.repository.port'

export const createInMemoryChatRepository = (): ChatRepository => {
  const chats: Chat[] = []

  return {
    getChats() {
      return Promise.resolve(
        chats
          .slice()
          .sort((a, b) => (b.updatedAt.getTime() - a.updatedAt.getTime())),
      )
    },

    getChatMessages(chatId) {
      const chat = chats.find((chat) => chat.id === chatId)

      return Promise.resolve(chat ? chat.messages.slice() : [])
    },

    createChat(data) {
      const chat = {
        id: generateUuid(),
        title: data.title ?? 'Untitled Chat',
        messages: [],
        projectId: data.projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      chats.push(chat)

      return Promise.resolve({ ...chat })
    },
  }
}
