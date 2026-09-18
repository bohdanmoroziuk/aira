import type { Nullable } from '#layers/base/shared/types/common.types'
import type { Chat, Project, ProjectChat } from '../../shared/types/chat.types'

export const toProjectChat = (
  chat: Chat,
  project: Nullable<Project>,
): ProjectChat => {
  return {
    ...chat,
    project: project ?? undefined,
  }
}
