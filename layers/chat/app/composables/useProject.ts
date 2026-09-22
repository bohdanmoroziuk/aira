import { requestUpdateProject } from '../gateways/project.gateway'

type UpdateProjectInput = {
  name: string
}

export const useProject = (projectId: MaybeRefOrGetter<string>) => {
  const { projects, replaceProject } = useProjects()

  const project = computed<Optional<Project>>(() => (
    projects.value.find(byId(toValue(projectId)))
  ))

  const updateProject = async (input: UpdateProjectInput) => {
    if (isUndefined(project.value)) return

    const updatedProject = await requestUpdateProject(project.value.id, input)

    replaceProject(updatedProject)
  }

  return {
    project,
    updateProject,
  }
}
