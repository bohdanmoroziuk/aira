import type { Nullable } from '#layers/base/shared/types/common.types'
import type { Project } from '../../shared/types/chat.types'

export type ProjectRepository = {
  getProjects: () => Promise<Project[]>
  findProjectById: (projectId?: string) => Promise<Nullable<Project>>
  createProject: (name: string) => Promise<Project>
  updateProject: (projectId: string, name: string) => Promise<Nullable<Project>>
  deleteProject: (projectId: string) => Promise<boolean>
}
