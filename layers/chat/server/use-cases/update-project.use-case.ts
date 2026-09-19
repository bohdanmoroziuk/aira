import { isNullable } from '#layers/base/shared/utils/common.utils'
import type { ProjectRepository } from '../ports/project.repository.port'

export type UpdateProjectInput = {
  name: string
}

export const makeUpdateProjectUseCase = (projectRepository: ProjectRepository) => {
  return async (projectId: string, input: UpdateProjectInput) => {
    const project = await projectRepository.findProjectById(projectId)

    if (isNullable(project)) return null

    const updatedProject = projectRepository.updateProject(project.id, input.name)

    return updatedProject
  }
}
