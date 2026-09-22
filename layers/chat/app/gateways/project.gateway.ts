export type RequestCreateProjectBody = {
  name?: string
}

export type RequestUpdateProjectBody = {
  name: string
}

export const requestProjects = () =>
  $fetch<Project[]>('/api/projects')

export const requestCreateProject = (body: RequestCreateProjectBody = {}) =>
  $fetch<Project>('/api/projects', {
    method: 'post',
    body,
  })

export const requestUpdateProject = (projectId: string, body: RequestUpdateProjectBody) =>
  $fetch<Project>(`/api/projects/${projectId}`, {
    method: 'put',
    body,
  })
