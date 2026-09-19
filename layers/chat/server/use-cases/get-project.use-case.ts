import type { ProjectRepository } from '../ports/project.repository.port'

export const makeGetProjectUseCase = (projectRepository: ProjectRepository) => {
  return (projectId: string) => projectRepository.findProjectById(projectId)
}
