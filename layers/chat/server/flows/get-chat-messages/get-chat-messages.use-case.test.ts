import { describe, expect, it } from 'vitest'
import { makeGetChatMessagesUseCase } from './get-chat-messages.use-case'
import type { Chat, ChatMessage } from '../../../shared/types/chat.types'
import type { ChatRepository } from '../../ports/chat.repository.port'

const createChat = (overrides: Partial<Chat> = {}): Chat => ({
  id: 'chat-1',
  title: 'Untitled Chat',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 'message-1',
  role: 'user',
  content: 'Hello',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const createFakeChatRepository = (chats: Chat[]): ChatRepository => ({
  getChats: () => Promise.reject(new Error('not implemented')),
  addChatMessage: () => Promise.reject(new Error('not implemented')),
  getChatMessages: (chatId) => {
    return Promise.resolve(chats.find((chat) => chat.id === chatId)?.messages ?? [])
  },
  createChat: () => Promise.reject(new Error('not implemented')),
})

describe('makeGetChatMessagesUseCase', () => {
  it('returns all messages of the chat matching the given id, in order', async () => {
    const messages = [
      createMessage({
        id: 'message-1',
        role: 'user',
      }),
      createMessage({
        id: 'message-2',
        role: 'assistant',
      }),
    ]
    const getChatMessagesUseCase = makeGetChatMessagesUseCase(createFakeChatRepository([
      createChat({
        id: 'chat-1',
        messages,
      }),
      createChat({
        id: 'chat-2',
        messages: [createMessage({ id: 'message-3' })],
      }),
    ]))

    const result = await getChatMessagesUseCase('chat-1')

    expect(result).toEqual(messages)
  })

  it('returns an empty array when the chat has no messages', async () => {
    const getChatMessagesUseCase = makeGetChatMessagesUseCase(
      createFakeChatRepository([createChat({ id: 'chat-1' })]),
    )

    const result = await getChatMessagesUseCase('chat-1')

    expect(result).toEqual([])
  })

  it('returns an empty array when no chat matches the given id', async () => {
    const getChatMessagesUseCase = makeGetChatMessagesUseCase(createFakeChatRepository([]))

    const result = await getChatMessagesUseCase('missing')

    expect(result).toEqual([])
  })
})
