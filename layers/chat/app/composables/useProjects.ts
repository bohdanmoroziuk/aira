import { requestCreateProject } from '../gateways/project.gateway'
import { useGetProjectsQuery } from '../queries/get-projects.query'

export const useProjects = () => {
  const projects = useState<Project[]>('projects', () => [])

  const { data, execute, status } = useGetProjectsQuery()

  const getProjects = async () => {
    if (isIdle(status)) {
      await execute()
      projects.value = data.value
    }
  }

  const createProject = async () => {
    const project = await requestCreateProject({ name: 'New Project' })

    projects.value.push(project)

    return project
  }

  const replaceProject = (newProject: Project) => {
    projects.value = projects.value.map((project) => {
      return project.id === newProject.id
        ? newProject
        : project
    })
  }

  return {
    projects,
    getProjects,
    createProject,
    replaceProject,
  }
}
