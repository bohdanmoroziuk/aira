type CreateChatData = {
  title?: string
  projectId?: string
}

export type ChatRepository = {
  getChats: () => Promise<Chat[]>
  getChatMessages: (chatId: string) => Promise<ChatMessage[]>
  createChat: (data: CreateChatData) => Promise<Chat>
}
