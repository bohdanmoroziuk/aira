import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('POST /api/chats', async () => {
  await setup({
    setupTimeout: 60000,
  })

  it('creates a chat with the given title and no project', async () => {
    const chat = await $fetch('/api/chats', {
      method: 'POST',
      body: {
        title: 'Roadmap planning',
      },
    })

    expect(chat).toMatchObject({
      title: 'Roadmap planning',
      messages: [],
    })
    expect(chat).not.toHaveProperty('project')
  })

  it('defaults the title to "Untitled Chat" when none is given', async () => {
    const chat = await $fetch('/api/chats', {
      method: 'POST',
      body: {},
    })

    expect(chat).toMatchObject({
      title: 'Untitled Chat',
    })
  })
})
