import { createInMemoryChatRepository } from './repositories/in-memory-chat.repository'
import { createInMemoryProjectRepository } from './repositories/in-memory-project.repository'
import { makeGetChatsUseCase } from './use-cases/get-chats.use-case'
import { makeCreateChatUseCase } from './flows/create-chat'
import { makeGetChatMessagesUseCase } from './flows/get-chat-messages'
import { createOpenAIAssistant } from './assistants/openai.assistant'
import { makeAddChatMessageUseCase } from './flows/add-chat-message'
import { makeGenerateAssistantReplyUseCase } from './flows/generate-assistant-reply'
import { makeCreateProjectUseCase } from './flows/create-project'
import { makeGetProjectsUseCase } from './flows/get-projects'
import { makeGetProjectUseCase } from './flows/get-project'
import { makeUpdateProjectUseCase } from './flows/update-project'
import { makeDeleteProjectUseCase } from './flows/delete-project'

const chatRepository = createInMemoryChatRepository()
const projectRepository = createInMemoryProjectRepository()
const assistant = createOpenAIAssistant(useRuntimeConfig().openaiApiKey)

export const getChats = makeGetChatsUseCase(chatRepository, projectRepository)
export const getChatMessages = makeGetChatMessagesUseCase(chatRepository)
export const addChatMessage = makeAddChatMessageUseCase(chatRepository)
export const generateAssistantReply = makeGenerateAssistantReplyUseCase(chatRepository, assistant)
export const createChat = makeCreateChatUseCase(chatRepository, projectRepository)
export const createProject = makeCreateProjectUseCase(projectRepository)
export const getProjects = makeGetProjectsUseCase(projectRepository)
export const getProject = makeGetProjectUseCase(projectRepository)
export const updateProject = makeUpdateProjectUseCase(projectRepository)
export const deleteProject = makeDeleteProjectUseCase(projectRepository)
