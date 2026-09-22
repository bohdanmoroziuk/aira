import { describe, expect, it } from 'vitest'
import { $fetch, fetch } from '@nuxt/test-utils/e2e'

const missingChatId = '00000000-0000-4000-8000-000000000000'

describe('POST /api/chats/:chatId/assistant-reply', () => {
  const createChat = () => $fetch<Chat>('/api/chats', {
    method: 'POST',
    body: {},
  })

  const requestReply = (chatId: string) => fetch(`/api/chats/${chatId}/assistant-reply`, { method: 'POST' })

  it('responds with 204 and no body when the chat does not exist', async () => {
    const response = await requestReply(missingChatId)

    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
  })

  it('responds with 204 and no body when the chat has no messages', async () => {
    const chat = await createChat()

    const response = await requestReply(chat.id)

    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
  })

  it('responds with 204 and adds nothing when the latest message is from the assistant', async () => {
    const chat = await createChat()
    await $fetch(`/api/chats/${chat.id}/messages`, {
      method: 'POST',
      body: {
        role: 'assistant',
        content: 'Hello!',
      },
    })

    const response = await requestReply(chat.id)
    const messages = await $fetch<ChatMessage[]>(`/api/chats/${chat.id}/messages`)

    expect(response.status).toBe(204)
    expect(messages).toHaveLength(1)
  })
})
