import { describe, expect, it } from 'vitest'
import { makeCreateChatUseCase } from './create-chat.use-case'
import type { Chat, Project } from '../../shared/types/chat.types'
import type { ChatRepository } from '../ports/chat.repository.port'
import type { ProjectRepository } from '../ports/project.repository.port'

const createChat = (overrides: Partial<Chat> = {}): Chat => ({
  id: 'chat-1',
  title: 'Untitled Chat',
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

const createFakeChatRepository = (chat: Chat): ChatRepository => ({
  getChatMessages: () => Promise.reject(new Error('not implemented')),
  getChats: () => Promise.reject(new Error('not implemented')),
  createChat: () => Promise.resolve(chat),
})

const createFakeProjectRepository = (projects: Project[]): ProjectRepository => ({
  getProjects: () => Promise.resolve(projects),
  findProjectById: (projectId) => {
    return Promise.resolve(projects.find((project) => project.id === projectId) ?? null)
  },
  createProject: () => Promise.reject(new Error('not implemented')),
  updateProject: () => Promise.reject(new Error('not implemented')),
  deleteProject: () => Promise.reject(new Error('not implemented')),
})

describe('makeCreateChatUseCase', () => {
  it('attaches the matching project when the input has a known projectId', async () => {
    const project = createProject({
      id: 'project-1',
      name: 'Work',
    })
    const chat = createChat({
      id: 'chat-1',
      projectId: 'project-1',
    })

    const createChatUseCase = makeCreateChatUseCase(
      createFakeChatRepository(chat),
      createFakeProjectRepository([project]),
    )

    const result = await createChatUseCase({
      title: chat.title,
      projectId: chat.projectId,
    })

    expect(result).toEqual({
      ...chat,
      project,
    })
  })

  it('leaves the project undefined when no projectId is given', async () => {
    const chat = createChat({ id: 'chat-2' })

    const createChatUseCase = makeCreateChatUseCase(
      createFakeChatRepository(chat),
      createFakeProjectRepository([]),
    )

    const result = await createChatUseCase({ title: chat.title })

    expect(result).toEqual({
      ...chat,
      project: undefined,
    })
  })

  it('leaves the project undefined when the given projectId matches no project', async () => {
    const project = createProject({
      id: 'project-1',
      name: 'Work',
    })
    const chat = createChat({
      id: 'chat-3',
      projectId: 'missing-project',
    })

    const createChatUseCase = makeCreateChatUseCase(
      createFakeChatRepository(chat),
      createFakeProjectRepository([project]),
    )

    const result = await createChatUseCase({
      title: chat.title,
      projectId: chat.projectId,
    })

    expect(result).toEqual({
      ...chat,
      project: undefined,
    })
  })
})
