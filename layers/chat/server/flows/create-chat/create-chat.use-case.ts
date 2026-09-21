import { toProjectChat } from '../../mappers/chat.mapper'
import type { ChatRepository } from '../../ports/chat.repository.port'
import type { ProjectRepository } from '../../ports/project.repository.port'

export type CreateChatInput = {
  title?: string
  projectId?: string
}

export const makeCreateChatUseCase = (
  chatRepository: ChatRepository,
  projectRepository: ProjectRepository,
) => {
  return async (input: CreateChatInput) => {
    const chat = await chatRepository.createChat(input)
    const project = await projectRepository.findProjectById(input.projectId)

    return toProjectChat(chat, project)
  }
}
