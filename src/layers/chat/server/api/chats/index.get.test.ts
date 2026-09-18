import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('GET /api/chats', async () => {
  await setup({
    setupTimeout: 60000,
  })

  it('returns chats created via POST /api/chats', async () => {
    const created = await $fetch('/api/chats', {
      method: 'POST',
      body: { title: 'Integration test chat' },
    })

    const chats = await $fetch('/api/chats')

    expect(chats).toEqual([created])
  })
})
