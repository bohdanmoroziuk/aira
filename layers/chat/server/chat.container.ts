import { createInMemoryChatRepository } from './repositories/in-memory-chat.repository'
import { createInMemoryProjectRepository } from './repositories/in-memory-project.repository'
import { makeGetChatsUseCase } from './use-cases/get-chats.use-case'
import { makeCreateChatUseCase } from './use-cases/create-chat.use.case'
import { makeCreateProjectUseCase } from './use-cases/create-project.use-case'
import { makeGetProjectsUseCase } from './use-cases/get-projects.use-case'

const chatRepository = createInMemoryChatRepository()
const projectRepository = createInMemoryProjectRepository()

export const getChats = makeGetChatsUseCase(chatRepository, projectRepository)
export const createChat = makeCreateChatUseCase(chatRepository, projectRepository)
export const createProject = makeCreateProjectUseCase(projectRepository)
export const getProjects = makeGetProjectsUseCase(projectRepository)
