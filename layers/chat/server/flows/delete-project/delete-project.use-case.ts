import { isNullable } from '#layers/base/shared/utils/common.utils'
import type { ProjectRepository } from '../../ports/project.repository.port'

export const makeDeleteProjectUseCase = (projectRepository: ProjectRepository) => {
  return async (projectId: string) => {
    const project = await projectRepository.findProjectById(projectId)

    if (isNullable(project)) return false

    await projectRepository.deleteProject(project.id)

    return true
  }
}
