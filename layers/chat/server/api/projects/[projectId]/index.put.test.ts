import { describe, expect, it } from 'vitest'
import { $fetch, fetch, setup } from '@nuxt/test-utils/e2e'

describe('PUT /api/projects/:projectId', async () => {
  await setup({
    setupTimeout: 180000,
  })

  const createProject = (name: string) => $fetch<Project>('/api/projects', {
    method: 'POST',
    body: { name },
  })

  it('renames the project and keeps its id and createdAt', async () => {
    const project = await createProject('Roadmap')

    const updated = await $fetch<Project>(`/api/projects/${project.id}`, {
      method: 'PUT',
      body: { name: 'Backlog' },
    })

    expect(updated).toMatchObject({
      id: project.id,
      name: 'Backlog',
      createdAt: project.createdAt,
    })
  })

  it('persists the new name for subsequent reads', async () => {
    const project = await createProject('Roadmap')

    const updated = await $fetch<Project>(`/api/projects/${project.id}`, {
      method: 'PUT',
      body: { name: 'Backlog' },
    })
    const projects = await $fetch<Project[]>('/api/projects')

    expect(projects).toContainEqual(updated)
  })

  it('stores the name trimmed', async () => {
    const project = await createProject('Roadmap')

    const updated = await $fetch<Project>(`/api/projects/${project.id}`, {
      method: 'PUT',
      body: { name: '  Backlog  ' },
    })

    expect(updated).toMatchObject({ name: 'Backlog' })
  })

  it('responds with 204 and no body when the project does not exist', async () => {
    const response = await fetch('/api/projects/missing', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Backlog' }),
    })

    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
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
    const project = await createProject('Roadmap')

    await expect(
      $fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        body,
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('leaves the project unchanged when validation fails', async () => {
    const project = await createProject('Roadmap')

    await $fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      body: { name: 'ab' },
    }).catch(() => undefined)
    const projects = await $fetch<Project[]>('/api/projects')

    expect(projects).toContainEqual(project)
  })
})
