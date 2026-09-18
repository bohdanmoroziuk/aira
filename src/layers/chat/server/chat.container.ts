import { createInMemoryChatRepository } from './repositories/in-memory-chat.repository'
import { makeGetChatsUseCase } from './use-cases/get-chats.use-case'
import { makeCreateChatUseCase } from './use-cases/create-chat.use.case'
import { createInMemoryProjectRepository } from './repositories/in-memory-project.repository'

const chatRepository = createInMemoryChatRepository()
const projectRepository = createInMemoryProjectRepository()

export const getChats = makeGetChatsUseCase(chatRepository, projectRepository)
export const createChat = makeCreateChatUseCase(chatRepository, projectRepository)
