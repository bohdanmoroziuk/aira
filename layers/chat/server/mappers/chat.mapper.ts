import { firstOrEmpty, orDefault } from '#layers/base/shared/utils/common.utils'

export const toProjectChat = (
  chat: Chat,
  project: Nullable<Project>,
): ProjectChat => {
  return {
    ...chat,
    messages: firstOrEmpty(chat.messages),
    project: orDefault(project, undefined),
  }
}
