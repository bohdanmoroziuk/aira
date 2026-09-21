type CreateChatData = {
  title?: string
  projectId?: string
}

type AddChatMessageData = Pick<ChatMessage, 'role' | 'content'>

export type ChatRepository = {
  getChats: () => Promise<Chat[]>
  getChatMessages: (chatId: string) => Promise<ChatMessage[]>
  addChatMessage: (chatId: string, data: AddChatMessageData) => Promise<Nullable<ChatMessage>>
  createChat: (data: CreateChatData) => Promise<Chat>
}
