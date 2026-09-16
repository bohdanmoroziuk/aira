import { createInMemoryChatRepository } from './repositories/in-memory-chat.repository'
import { makeGetChatsUseCase } from './use-cases/get-chats.use-case'
import type { ChatRepositoryPort } from './ports/chat.repository.port'

export const chatRepository: ChatRepositoryPort = createInMemoryChatRepository()

export const getChats = makeGetChatsUseCase(chatRepository)
