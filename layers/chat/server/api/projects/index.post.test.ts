import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('POST /api/projects', async () => {
  await setup({
    setupTimeout: 180000,
  })

  it('creates a project with the given name', async () => {
    const project = await $fetch('/api/projects', {
      method: 'POST',
      body: { name: 'Roadmap' },
    })

    expect(project).toMatchObject({ name: 'Roadmap' })
    expect(project).toHaveProperty('id')
    expect(project).toHaveProperty('createdAt')
    expect(project).toHaveProperty('updatedAt')
  })

  it('stores the name trimmed', async () => {
    const project = await $fetch('/api/projects', {
      method: 'POST',
      body: { name: '  Roadmap  ' },
    })

    expect(project).toMatchObject({ name: 'Roadmap' })
  })

  it('accepts a name of exactly 3 characters', async () => {
    const project = await $fetch('/api/projects', {
      method: 'POST',
      body: { name: 'abc' },
    })

    expect(project).toMatchObject({ name: 'abc' })
  })

  it.each([
    [
      'is shorter than 3 characters',
      { name: 'ab' },
    ],
    [
      'is shorter than 3 characters once trimmed',
      { name: '  ab  ' },
    ],
    [
      'is missing',
      {},
    ],
    [
      'is not a string',
      { name: 123 },
    ],
  ])('rejects the request with 400 when the name %s', async (_case, body) => {
    await expect(
      $fetch('/api/projects', {
        method: 'POST',
        body,
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
