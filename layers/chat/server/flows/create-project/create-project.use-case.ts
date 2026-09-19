import type { ProjectRepository } from '../../ports/project.repository.port'

export type CreateProjectInput = {
  name: string
}

export const makeCreateProjectUseCase = (projectRepository: ProjectRepository) => {
  return (input: CreateProjectInput) => projectRepository.createProject(input.name)
}
