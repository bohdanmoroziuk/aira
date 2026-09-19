import type { ProjectRepository } from '../../ports/project.repository.port'

export const makeGetProjectsUseCase = (projectRepository: ProjectRepository) => {
  return () => projectRepository.getProjects()
}
