import { describe, expect, it, vi } from 'vitest'
import { makeDeleteProjectUseCase } from './delete-project.use-case'
import type { Project } from '../../shared/types/chat.types'
import type { ProjectRepository } from '../ports/project.repository.port'

const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'project-1',
  name: 'Work',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const createFakeProjectRepository = (projects: Project[]) => {
  const deleteProject = vi.fn<ProjectRepository['deleteProject']>(() => Promise.resolve(true))

  const repository: ProjectRepository = {
    getProjects: () => Promise.reject(new Error('not implemented')),
    findProjectById: (projectId) => {
      return Promise.resolve(projects.find((project) => project.id === projectId) ?? null)
    },
    createProject: () => Promise.reject(new Error('not implemented')),
    updateProject: () => Promise.reject(new Error('not implemented')),
    deleteProject,
  }

  return {
    repository,
    deleteProject,
  }
}

describe('makeDeleteProjectUseCase', () => {
  it('deletes the project and returns true when it exists', async () => {
    const { repository, deleteProject } = createFakeProjectRepository([createProject({ id: 'project-1' })])
    const deleteProjectUseCase = makeDeleteProjectUseCase(repository)

    const result = await deleteProjectUseCase('project-1')

    expect(result).toBe(true)
    expect(deleteProject).toHaveBeenCalledWith('project-1')
  })

  it('returns false without deleting when the project does not exist', async () => {
    const { repository, deleteProject } = createFakeProjectRepository([])
    const deleteProjectUseCase = makeDeleteProjectUseCase(repository)

    const result = await deleteProjectUseCase('missing')

    expect(result).toBe(false)
    expect(deleteProject).not.toHaveBeenCalled()
  })
})
