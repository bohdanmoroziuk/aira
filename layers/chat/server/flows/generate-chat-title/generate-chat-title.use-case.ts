import { isNullable } from '#layers/base/shared/utils/common.utils'
import { toProjectChat } from '../../mappers/chat.mapper'
import type { Assistant } from '../../ports/assistant.port'
import type { ChatRepository } from '../../ports/chat.repository.port'
import type { ProjectRepository } from '../../ports/project.repository.port'

export type GenerateChatTitleInput = {
  text: string
}

export const makeGenerateChatTitleUseCase = (
  chatRepository: ChatRepository,
  projectRepository: ProjectRepository,
  assistant: Assistant,
) => {
  return async (chatId: string, input: GenerateChatTitleInput) => {
    const title = await assistant.generateTitle(input.text)
    const chat = await chatRepository.updateChat(chatId, { title })

    if (isNullable(chat)) return null

    const project = await projectRepository.findProjectById(chat.projectId)

    return toProjectChat(chat, project)
  }
}
