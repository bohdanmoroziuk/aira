import { describe, expect, it } from 'vitest'
import { makeGetProjectsUseCase } from './get-projects.use-case'
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
  getProjects: () => Promise.resolve(projects),
  findProjectById: () => Promise.reject(new Error('not implemented')),
  createProject: () => Promise.reject(new Error('not implemented')),
  updateProject: () => Promise.reject(new Error('not implemented')),
  deleteProject: () => Promise.reject(new Error('not implemented')),
})

describe('makeGetProjectsUseCase', () => {
  it('returns the projects held by the repository', async () => {
    const projects = [
      createProject({
        id: 'project-1',
        name: 'Work',
      }),
      createProject({
        id: 'project-2',
        name: 'Home',
      }),
    ]

    const getProjectsUseCase = makeGetProjectsUseCase(createFakeProjectRepository(projects))

    expect(await getProjectsUseCase()).toEqual(projects)
  })

  it('returns an empty list when there are no projects', async () => {
    const getProjectsUseCase = makeGetProjectsUseCase(createFakeProjectRepository([]))

    expect(await getProjectsUseCase()).toEqual([])
  })
})
