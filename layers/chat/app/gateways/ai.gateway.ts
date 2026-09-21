/**
 * Gateway to the AI backend.
 *
 * Wraps the `/api/ai` endpoint so callers depend on a typed function instead of
 * the transport details (URL, method, body shape). This is the single place to
 * add request/response normalisation, auth headers or cancellation later.
 */
export const requestAssistantReply = (chatId: string) =>
  $fetch<Optional<ChatMessage>>(`/api/chats/${chatId}/assistant-reply`, {
    method: 'post',
  })
