export const toProjectChat = (
  chat: Chat,
  project: Nullable<Project>,
): ProjectChat => {
  return {
    ...chat,
    project: project ?? undefined,
  }
}
