import { describe, expect, it } from 'vitest'
import { makeCreateProjectUseCase } from './create-project.use-case'
import type { Project } from '../../../shared/types/chat.types'
import type { ProjectRepository } from '../../ports/project.repository.port'

const createFakeProjectRepository = (): ProjectRepository => ({
  getProjects: () => Promise.reject(new Error('not implemented')),
  findProjectById: () => Promise.reject(new Error('not implemented')),
  createProject: (name) => {
    const project: Project = {
      id: 'project-1',
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return Promise.resolve(project)
  },
  updateProject: () => Promise.reject(new Error('not implemented')),
  deleteProject: () => Promise.reject(new Error('not implemented')),
})

describe('makeCreateProjectUseCase', () => {
  it('returns the project created with the given name', async () => {
    const createProjectUseCase = makeCreateProjectUseCase(createFakeProjectRepository())

    const result = await createProjectUseCase({ name: 'Work' })

    expect(result).toMatchObject({
      id: 'project-1',
      name: 'Work',
    })
  })
})
