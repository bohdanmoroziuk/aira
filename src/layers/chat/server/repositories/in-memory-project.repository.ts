import { generateUuid, isUndefined } from '#layers/base/shared/utils/common.utils'
import type { Nullable } from '#layers/base/shared/types/common.types'
import type { Project } from '../../shared/types/chat.types'
import type { ProjectRepository } from '../ports/project.repository.port'

export const createInMemoryProjectRepository = (): ProjectRepository => {
  const projects: Project[] = []

  const getProjects = () => {
    return Promise.resolve(
      projects
        .slice()
        .sort((a, b) => (a.name.localeCompare(b.name))),
    )
  }

  const findProjectById = (projectId?: string) => {
    if (isUndefined(projectId)) return Promise.resolve(null)

    const project = projects.find((project) => project.id === projectId)

    return Promise.resolve(project ?? null)
  }

  const createProject = (name: string) => {
    const project: Project = {
      id: generateUuid(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projects.push(project)

    return Promise.resolve(project)
  }

  const updateProject = (projectId: string, name: string): Promise<Nullable<Project>> => {
    const projectIndex = projects.findIndex((project) => project.id === projectId)

    if (projectIndex === -1) return Promise.resolve(null)

    const project = projects[projectIndex]

    if (isUndefined(project)) return Promise.resolve(null)

    projects[projectIndex] = {
      id: project.id,
      name,
      createdAt: project.createdAt,
      updatedAt: new Date(),
    }

    return Promise.resolve(projects[projectIndex])
  }

  const deleteProject = async (projectId: string) => {
    const projectIndex = projects.findIndex((project) => project.id === projectId)

    if (projectIndex === -1) return false

    projects.splice(projectIndex, 1)

    return true
  }

  return {
    getProjects,
    findProjectById,
    createProject,
    updateProject,
    deleteProject,
  }
}
