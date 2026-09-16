import { generateUuid } from '#layers/base/shared/utils/common.utils'
import type { Chat } from '../../shared/types/chat.types'
import type { ChatRepositoryPort } from '../ports/chat.repository.port'

export type CreateChatInput = {
  title?: string
  projectId?: string
}

export const makeCreateChatUseCase = (chatRepository: ChatRepositoryPort) => {
  return async (input: CreateChatInput) => {
    const chatDraft: Chat = {
      id: generateUuid(),
      title: input.title ?? 'Untitled Chat',
      messages: [],
      projectId: input.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const chat = await chatRepository.createChat(chatDraft)

    return chat
  }
}
