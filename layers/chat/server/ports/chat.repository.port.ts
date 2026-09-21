type CreateChatData = {
  title?: string
  projectId?: string
}

type UpdateChatData = Partial<Pick<Chat, 'title'>>

type AddChatMessageData = Pick<ChatMessage, 'role' | 'content'>

export type ChatRepository = {
  getChats: () => Promise<Chat[]>
  getChatMessages: (chatId: string) => Promise<ChatMessage[]>
  addChatMessage: (chatId: string, data: AddChatMessageData) => Promise<Nullable<ChatMessage>>
  updateChat: (chatId: string, data: UpdateChatData) => Promise<Nullable<Chat>>
  createChat: (data: CreateChatData) => Promise<Chat>
}
