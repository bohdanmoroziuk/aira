import type { MaybeRefOrGetter } from 'vue'
import type { Project } from '../../shared/types/chat'
import type { Optional } from '../../../base/shared/types/common'
import { computed, toValue } from 'vue'
import { byId } from '#imports'
import { useProjects } from './useProjects'

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
