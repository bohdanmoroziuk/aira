import { describe, expect, it } from 'vitest'
import { makeGetProjectUseCase } from './get-project.use-case'
import type { Project } from '../../../shared/types/chat.types'
import type { ProjectRepository } from '../../ports/project.repository.port'

const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'project-1',
  name: 'My Project',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const createFakeProjectRepository = (projects: Project[]): ProjectRepository => ({
  getProjects: () => Promise.reject(new Error('not implemented')),
  findProjectById: (projectId) => {
    return Promise.resolve(projects.find((project) => project.id === projectId) ?? null)
  },
  createProject: () => Promise.reject(new Error('not implemented')),
  updateProject: () => Promise.reject(new Error('not implemented')),
  deleteProject: () => Promise.reject(new Error('not implemented')),
})

describe('makeGetProjectUseCase', () => {
  it('returns the project matching the given id', async () => {
    const project = createProject({
      id: 'project-1',
      name: 'Work',
    })
    const getProjectUseCase = makeGetProjectUseCase(createFakeProjectRepository([
      project,
      createProject({ id: 'project-2' }),
    ]))

    const result = await getProjectUseCase('project-1')

    expect(result).toEqual(project)
  })

  it('returns null when no project matches the given id', async () => {
    const getProjectUseCase = makeGetProjectUseCase(createFakeProjectRepository([]))

    const result = await getProjectUseCase('missing')

    expect(result).toBeNull()
  })
})
