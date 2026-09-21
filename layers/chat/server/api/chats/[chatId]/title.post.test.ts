import { describe, expect, it } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('POST /api/chats/:chatId/title', () => {
  it.each([
    [
      'the text is missing',
      {},
    ],
    [
      'the text is empty once trimmed',
      { text: '   ' },
    ],
    [
      'the text is not a string',
      { text: 123 },
    ],
  ])('rejects the request with 400 when %s', async (_case, body) => {
    const chat = await $fetch<Chat>('/api/chats', {
      method: 'POST',
      body: {},
    })

    await expect(
      $fetch(`/api/chats/${chat.id}/title`, {
        method: 'POST',
        body,
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
