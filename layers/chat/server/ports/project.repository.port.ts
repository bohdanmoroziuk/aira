export type ProjectRepository = {
  getProjects: () => Promise<Project[]>
  findProjectById: (projectId?: string) => Promise<Nullable<Project>>
  createProject: (name: string) => Promise<Project>
  updateProject: (projectId: string, name: string) => Promise<Nullable<Project>>
  deleteProject: (projectId: string) => Promise<boolean>
}
