import { describe, expect, it } from 'vitest'
import { $fetch, fetch } from '@nuxt/test-utils/e2e'

describe('GET /api/projects/:projectId', () => {
  const createProject = (name: string) => $fetch<Project>('/api/projects', {
    method: 'POST',
    body: { name },
  })

  it('returns the project with the given id', async () => {
    const project = await createProject('Roadmap')

    const result = await $fetch<Project>(`/api/projects/${project.id}`)

    expect(result).toEqual(project)
  })

  it('returns only the requested project', async () => {
    await createProject('Alpha')
    const beta = await createProject('Beta')

    const result = await $fetch<Project>(`/api/projects/${beta.id}`)

    expect(result).toEqual(beta)
  })

  it('reflects a rename made through PUT /api/projects/:projectId', async () => {
    const project = await createProject('Roadmap')
    const updated = await $fetch<Project>(`/api/projects/${project.id}`, {
      method: 'PUT',
      body: { name: 'Backlog' },
    })

    const result = await $fetch<Project>(`/api/projects/${project.id}`)

    expect(result).toEqual(updated)
  })

  it('responds with 204 and no body when the project does not exist', async () => {
    const response = await fetch('/api/projects/missing')

    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
  })
})
