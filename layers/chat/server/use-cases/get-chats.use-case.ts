import { toProjectChat } from '../mappers/chat.mapper'
import type { ChatRepository } from '../ports/chat.repository.port'
import type { ProjectRepository } from '../ports/project.repository.port'

export const makeGetChatsUseCase = (
  chatRepository: ChatRepository,
  projectRepository: ProjectRepository,
) => {
  return async () => {
    const chats = await chatRepository.getChats()

    const projects = await Promise.all(
      chats.map((chat) => projectRepository.findProjectById(chat.projectId)),
    )

    return chats.map((chat, chatIndex) => toProjectChat(chat, projects[chatIndex] ?? null))
  }
}
