import { describe, expect, it } from 'vitest'
import { makeAddChatMessageUseCase } from './add-chat-message.use-case'
import type { ChatMessage } from '../../../shared/types/chat.types'
import type { ChatRepository } from '../../ports/chat.repository.port'

const createFakeChatRepository = (chatIds: string[]): ChatRepository => ({
  getChats: () => Promise.reject(new Error('not implemented')),
  getChatMessages: () => Promise.reject(new Error('not implemented')),
  addChatMessage: (chatId, data) => {
    if (!chatIds.includes(chatId)) return Promise.resolve(null)

    const message: ChatMessage = {
      id: 'message-1',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return Promise.resolve(message)
  },
  updateChat: () => Promise.reject(new Error('not implemented')),
  createChat: () => Promise.reject(new Error('not implemented')),
})

describe('makeAddChatMessageUseCase', () => {
  it('returns the message added to the chat with the given id', async () => {
    const addChatMessageUseCase = makeAddChatMessageUseCase(createFakeChatRepository(['chat-1']))

    const result = await addChatMessageUseCase('chat-1', {
      role: 'user',
      content: 'Hello',
    })

    expect(result).toMatchObject({
      id: 'message-1',
      role: 'user',
      content: 'Hello',
    })
  })

  it('returns null when no chat matches the given id', async () => {
    const addChatMessageUseCase = makeAddChatMessageUseCase(createFakeChatRepository([]))

    const result = await addChatMessageUseCase('missing', {
      role: 'user',
      content: 'Hello',
    })

    expect(result).toBeNull()
  })
})
