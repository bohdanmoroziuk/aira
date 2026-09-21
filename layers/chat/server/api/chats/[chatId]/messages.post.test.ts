import { describe, expect, it } from 'vitest'
import { $fetch, fetch } from '@nuxt/test-utils/e2e'

describe('POST /api/chats/:chatId/messages', () => {
  const createChat = () => $fetch<Chat>('/api/chats', {
    method: 'POST',
    body: {},
  })

  const addMessage = (chatId: string, body: Record<string, unknown>) => $fetch<ChatMessage>(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    body,
  })

  it('adds a message with the given role and content', async () => {
    const chat = await createChat()

    const message = await addMessage(chat.id, {
      role: 'user',
      content: 'Hello',
    })

    expect(message).toMatchObject({
      role: 'user',
      content: 'Hello',
    })
    expect(message).toHaveProperty('id')
    expect(message).toHaveProperty('createdAt')
    expect(message).toHaveProperty('updatedAt')
  })

  it('stores the content trimmed', async () => {
    const chat = await createChat()

    const message = await addMessage(chat.id, {
      role: 'user',
      content: '  Hello  ',
    })

    expect(message).toMatchObject({ content: 'Hello' })
  })

  it('appends messages in the order they were added', async () => {
    const chat = await createChat()
    const question = await addMessage(chat.id, {
      role: 'user',
      content: 'Hi',
    })
    const answer = await addMessage(chat.id, {
      role: 'assistant',
      content: 'Hello!',
    })

    const messages = await $fetch<ChatMessage[]>(`/api/chats/${chat.id}/messages`)

    expect(messages).toEqual([
      question,
      answer,
    ])
  })

  it('does not add the message to other chats', async () => {
    const chat = await createChat()
    const otherChat = await createChat()
    await addMessage(chat.id, {
      role: 'user',
      content: 'Hi',
    })

    const messages = await $fetch<ChatMessage[]>(`/api/chats/${otherChat.id}/messages`)

    expect(messages).toEqual([])
  })

  it('responds with 204 and no body when the chat does not exist', async () => {
    const response = await fetch('/api/chats/missing/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        role: 'user',
        content: 'Hello',
      }),
    })

    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
  })

  it.each([
    [
      'the role is not allowed',
      {
        role: 'admin',
        content: 'Hello',
      },
    ],
    [
      'the role is missing',
      { content: 'Hello' },
    ],
    [
      'the content is empty once trimmed',
      {
        role: 'user',
        content: '   ',
      },
    ],
    [
      'the content is missing',
      { role: 'user' },
    ],
    [
      'the content is not a string',
      {
        role: 'user',
        content: 123,
      },
    ],
  ])('rejects the request with 400 when %s', async (_case, body) => {
    const chat = await createChat()

    await expect(addMessage(chat.id, body)).rejects.toMatchObject({ statusCode: 400 })
  })
})
