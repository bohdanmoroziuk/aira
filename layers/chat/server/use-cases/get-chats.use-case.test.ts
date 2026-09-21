import { describe, expect, it } from 'vitest'
import { makeGetChatsUseCase } from './get-chats.use-case'
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

const createFakeChatRepository = (chats: Chat[]): ChatRepository => ({
  addChatMessage: () => Promise.reject(new Error('not implemented')),
  getChatMessages: () => Promise.reject(new Error('not implemented')),
  getChats: () => Promise.resolve(chats),
  updateChat: () => Promise.reject(new Error('not implemented')),
  createChat: () => Promise.reject(new Error('not implemented')),
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

describe('makeGetChatsUseCase', () => {
  it('attaches the matching project to each chat', async () => {
    const project = createProject({
      id: 'project-1',
      name: 'Work',
    })
    const chat = createChat({
      id: 'chat-1',
      projectId: 'project-1',
    })

    const getChats = makeGetChatsUseCase(
      createFakeChatRepository([chat]),
      createFakeProjectRepository([project]),
    )

    const result = await getChats()

    expect(result).toEqual([
      {
        ...chat,
        project,
      },
    ])
  })

  it('leaves the project undefined when the chat has no projectId', async () => {
    const chat = createChat({ id: 'chat-2' })

    const getChats = makeGetChatsUseCase(
      createFakeChatRepository([chat]),
      createFakeProjectRepository([]),
    )

    const result = await getChats()

    expect(result).toEqual([
      {
        ...chat,
        project: undefined,
      },
    ])
  })
})
