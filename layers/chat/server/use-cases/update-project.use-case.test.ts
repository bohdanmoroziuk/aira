import { describe, expect, it, vi } from 'vitest'
import { makeUpdateProjectUseCase } from './update-project.use-case'
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
  const updateProject = vi.fn<ProjectRepository['updateProject']>((projectId, name) => {
    const project = projects.find((project) => project.id === projectId)

    return Promise.resolve(project
      ? {
          ...project,
          name,
        }
      : null)
  })

  const repository: ProjectRepository = {
    getProjects: () => Promise.reject(new Error('not implemented')),
    findProjectById: (projectId) => {
      return Promise.resolve(projects.find((project) => project.id === projectId) ?? null)
    },
    createProject: () => Promise.reject(new Error('not implemented')),
    updateProject,
    deleteProject: () => Promise.reject(new Error('not implemented')),
  }

  return {
    repository,
    updateProject,
  }
}

describe('makeUpdateProjectUseCase', () => {
  it('updates the project when it exists and returns the result', async () => {
    const { repository, updateProject } = createFakeProjectRepository([createProject({ id: 'project-1' })])
    const updateProjectUseCase = makeUpdateProjectUseCase(repository)

    const result = await updateProjectUseCase('project-1', { name: 'Personal' })

    expect(updateProject).toHaveBeenCalledWith('project-1', 'Personal')
    expect(result).toMatchObject({
      id: 'project-1',
      name: 'Personal',
    })
  })

  it('returns null without updating when the project does not exist', async () => {
    const { repository, updateProject } = createFakeProjectRepository([])
    const updateProjectUseCase = makeUpdateProjectUseCase(repository)

    const result = await updateProjectUseCase('missing', { name: 'Personal' })

    expect(result).toBeNull()
    expect(updateProject).not.toHaveBeenCalled()
  })
})
