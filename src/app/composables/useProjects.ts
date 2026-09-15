import type { Project } from '~~/src/shared/types/chat'
import { useState } from '#imports'
import { generateUuid } from '~~/src/shared/utils/common.utils'

export const useProjects = () => {
  const projects = useState<Project[]>('projects', () => [])

  const createProject = () => {
    const project = {
      id: generateUuid(),
      name: 'New project',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projects.value.push(project)

    return project
  }

  return {
    projects,
    createProject,
  }
}
