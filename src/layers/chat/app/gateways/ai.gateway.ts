import type { ChatMessage } from '../../shared/types/chat'
import { $fetch } from '#imports'

/**
 * Gateway to the AI backend.
 *
 * Wraps the `/api/ai` endpoint so callers depend on a typed function instead of
 * the transport details (URL, method, body shape). This is the single place to
 * add request/response normalisation, auth headers or cancellation later.
 */
export const requestAssistantReply = (messages: ChatMessage[]) =>
  $fetch<ChatMessage>('/api/ai', {
    method: 'post',
    body: { messages },
  })
