import { byId } from '~~/src/shared/utils/common'

export const useProject = (projectId: MaybeRefOrGetter<string>) => {
  const { projects } = useProjects()

  const project = computed<Optional<Project>>(() => (
    projects.value.find(byId(toValue(projectId)))
  ))

  const updateProject = (changes: Partial<Project>) => {
    if (!project.value) return

    const projectIndex = projects.value.findIndex(byId(toValue(projectId)))

    if (projectIndex === -1) return

    projects.value[projectIndex] = {
      ...project.value,
      ...changes,
      id: toValue(projectId),
      updatedAt: new Date(),
    }
  }

  return {
    project,
    updateProject,
  }
}
