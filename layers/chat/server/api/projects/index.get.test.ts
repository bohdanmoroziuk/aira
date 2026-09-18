import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('GET /api/projects', async () => {
  await setup({
    setupTimeout: 60000,
  })

  it('returns an empty list when no projects exist', async () => {
    const projects = await $fetch('/api/projects')

    expect(projects).toEqual([])
  })

  it('returns projects created via POST /api/projects, sorted by name', async () => {
    const beta = await $fetch('/api/projects', {
      method: 'POST',
      body: { name: 'Beta' },
    })
    const alpha = await $fetch('/api/projects', {
      method: 'POST',
      body: { name: 'Alpha' },
    })

    const projects = await $fetch('/api/projects')

    expect(projects).toEqual([
      alpha,
      beta,
    ])
  })
})
