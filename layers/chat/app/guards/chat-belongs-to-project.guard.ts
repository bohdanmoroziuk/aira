import { ensureChatExists } from './chat-exists.guard'

export function ensureChatBelongsToProject(
  chat: MaybeRefOrGetter<Chat | undefined>,
  projectId: MaybeRefOrGetter<string>,
) {
  return ensureChatExists(computed(() => {
    const currentChat = toValue(chat)

    return currentChat?.projectId === toValue(projectId) ? currentChat : undefined
  }))
}
