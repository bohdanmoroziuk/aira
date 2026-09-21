import { describe, expect, it, vi } from 'vitest'
import { makeGenerateChatTitleUseCase } from './generate-chat-title.use-case'
import type { Chat, Project } from '../../../shared/types/chat.types'
import type { Assistant } from '../../ports/assistant.port'
import type { ChatRepository } from '../../ports/chat.repository.port'
import type { ProjectRepository } from '../../ports/project.repository.port'

const createChat = (overrides: Partial<Chat> = {}): Chat => ({
  id: 'chat-1',
  title: 'New chat',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'project-1',
  name: 'My Project',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const createFakeChatRepository = (chat: Nullable<Chat> = createChat()) => {
  const updateChat = vi.fn<ChatRepository['updateChat']>((_chatId, data) => {
    return Promise.resolve(chat && {
      ...chat,
      ...data,
    })
  })
  const repository: ChatRepository = {
    getChats: () => Promise.reject(new Error('not implemented')),
    getChatMessages: () => Promise.reject(new Error('not implemented')),
    addChatMessage: () => Promise.reject(new Error('not implemented')),
    updateChat,
    createChat: () => Promise.reject(new Error('not implemented')),
  }

  return {
    repository,
    updateChat,
  }
}

const createFakeProjectRepository = (projects: Project[] = []): ProjectRepository => ({
  getProjects: () => Promise.reject(new Error('not implemented')),
  findProjectById: (projectId) => {
    return Promise.resolve(projects.find((project) => project.id === projectId) ?? null)
  },
  createProject: () => Promise.reject(new Error('not implemented')),
  updateProject: () => Promise.reject(new Error('not implemented')),
  deleteProject: () => Promise.reject(new Error('not implemented')),
})

const createFakeAssistant = (title = 'Greeting') => {
  const generateTitle = vi.fn<Assistant['generateTitle']>(() => Promise.resolve(title))

  return {
    assistant: {
      generateReply: () => Promise.reject(new Error('not implemented')),
      generateTitle,
    } satisfies Assistant,
    generateTitle,
  }
}

describe('makeGenerateChatTitleUseCase', () => {
  it('generates the title from the given message text', async () => {
    const { repository } = createFakeChatRepository()
    const { assistant, generateTitle } = createFakeAssistant()

    await makeGenerateChatTitleUseCase(repository, createFakeProjectRepository(), assistant)('chat-1', { text: 'How do I learn Vue?' })

    expect(generateTitle).toHaveBeenCalledWith('How do I learn Vue?')
  })

  it('saves the generated title on the chat and returns the updated chat', async () => {
    const { repository, updateChat } = createFakeChatRepository()
    const { assistant } = createFakeAssistant('Learning Vue')

    const result = await makeGenerateChatTitleUseCase(repository, createFakeProjectRepository(), assistant)('chat-1', { text: 'How do I learn Vue?' })

    expect(updateChat).toHaveBeenCalledWith('chat-1', { title: 'Learning Vue' })
    expect(result).toMatchObject({
      id: 'chat-1',
      title: 'Learning Vue',
    })
  })

  it('attaches the chat\'s project to the returned chat', async () => {
    const project = createProject({ id: 'project-1' })
    const { repository } = createFakeChatRepository(createChat({ projectId: 'project-1' }))
    const { assistant } = createFakeAssistant()

    const result = await makeGenerateChatTitleUseCase(repository, createFakeProjectRepository([project]), assistant)('chat-1', { text: 'Hello' })

    expect(result).toMatchObject({ project })
  })

  it('returns null when no chat matches the given id', async () => {
    const { repository } = createFakeChatRepository(null)
    const { assistant } = createFakeAssistant()

    const result = await makeGenerateChatTitleUseCase(repository, createFakeProjectRepository(), assistant)('missing', { text: 'Hello' })

    expect(result).toBeNull()
  })

  it('does not change the chat when the assistant fails', async () => {
    const { repository, updateChat } = createFakeChatRepository()
    const assistant: Assistant = {
      generateReply: () => Promise.reject(new Error('not implemented')),
      generateTitle: () => Promise.reject(new Error('model down')),
    }

    await expect(
      makeGenerateChatTitleUseCase(repository, createFakeProjectRepository(), assistant)('chat-1', { text: 'Hello' }),
    ).rejects.toThrow('model down')
    expect(updateChat).not.toHaveBeenCalled()
  })
})
