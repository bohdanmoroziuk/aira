/**
 * Gateway to the chat backend.
 *
 * Wraps the `/api/chats` endpoints so callers depend on typed functions instead
 * of the transport details (URL, method, body shape). This is the single place
 * to add request/response normalisation, auth headers or cancellation later.
 */

export type RequestCreateChatBody = {
  title?: string
  proejct?: string
}

export type RequestGenerateChatTitleBody = {
  text: string
}

export const requestChats = () =>
  $fetch<Chat[]>('/api/chats')

export const requestCreateChat = (body: RequestCreateChatBody = {}) =>
  $fetch<Chat>('/api/chats', {
    method: 'post',
    body,
  })

export const requestGenerateChatTitle = (chatId: string, body: RequestGenerateChatTitleBody) =>
  $fetch<Chat>(`/api/chats/${chatId}/title`, {
    method: 'post',
    body,
  })

export const requestChatMessages = (chatId: string) =>
  $fetch<ChatMessage[]>(`/api/chats/${chatId}/messages`)

export const requestAddChatMessage = (chatId: string, message: Pick<ChatMessage, 'role' | 'content'>) =>
  $fetch<Nullable<ChatMessage>>(`/api/chats/${chatId}/messages`, {
    method: 'post',
    body: message,
  })

export const requestAssistantReply = (chatId: string) =>
  $fetch<Optional<ChatMessage>>(`/api/chats/${chatId}/assistant-reply`, {
    method: 'post',
  })
