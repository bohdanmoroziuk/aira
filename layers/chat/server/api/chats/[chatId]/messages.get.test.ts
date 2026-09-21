import { describe, expect, it } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('GET /api/chats/:chatId/messages', () => {
  it('returns an empty array for a chat without messages', async () => {
    const chat = await $fetch<Chat>('/api/chats', {
      method: 'POST',
      body: { title: 'Fresh chat' },
    })

    const result = await $fetch<ChatMessage[]>(`/api/chats/${chat.id}/messages`)

    expect(result).toEqual([])
  })

  it('returns an empty array when the chat does not exist', async () => {
    const result = await $fetch<ChatMessage[]>('/api/chats/missing/messages')

    expect(result).toEqual([])
  })
})
