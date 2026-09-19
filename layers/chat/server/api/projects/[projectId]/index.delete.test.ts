import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('DELETE /api/projects/:projectId', async () => {
  await setup({
    setupTimeout: 180000,
  })

  const createProject = (name: string) => $fetch<Project>('/api/projects', {
    method: 'POST',
    body: { name },
  })

  it('deletes the project and responds with true', async () => {
    const project = await createProject('Roadmap')

    const result = await $fetch(`/api/projects/${project.id}`, { method: 'DELETE' })

    expect(result).toBe(true)
  })

  it('removes the project from subsequent reads', async () => {
    const kept = await createProject('Keep')
    const removed = await createProject('Remove')

    await $fetch(`/api/projects/${removed.id}`, { method: 'DELETE' })
    const projects = await $fetch<Project[]>('/api/projects')

    expect(projects).toContainEqual(kept)
    expect(projects).not.toContainEqual(removed)
  })

  it('responds with false when the project does not exist', async () => {
    const result = await $fetch('/api/projects/missing', { method: 'DELETE' })

    expect(result).toBe(false)
  })

  it('responds with false when the project was already deleted', async () => {
    const project = await createProject('Roadmap')

    await $fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
    const result = await $fetch(`/api/projects/${project.id}`, { method: 'DELETE' })

    expect(result).toBe(false)
  })
})
