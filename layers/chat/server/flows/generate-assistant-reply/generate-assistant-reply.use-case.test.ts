import { describe, expect, it, vi } from 'vitest'
import { makeGenerateAssistantReplyUseCase } from './generate-assistant-reply.use-case'
import type { ChatMessage } from '../../../shared/types/chat.types'
import type { Assistant } from '../../ports/assistant.port'
import type { ChatRepository } from '../../ports/chat.repository.port'

const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 'message-1',
  role: 'user',
  content: 'Hello',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const createFakeChatRepository = (messages: ChatMessage[]) => {
  const addChatMessage = vi.fn<ChatRepository['addChatMessage']>((_chatId, data) => {
    return Promise.resolve(createMessage({
      ...data,
      id: 'reply-1',
    }))
  })
  const repository: ChatRepository = {
    getChats: () => Promise.reject(new Error('not implemented')),
    getChatMessages: () => Promise.resolve(messages),
    addChatMessage,
    createChat: () => Promise.reject(new Error('not implemented')),
  }

  return {
    repository,
    addChatMessage,
  }
}

const createFakeAssistant = (reply = 'Hi there!') => {
  const generateReply = vi.fn<Assistant['generateReply']>(() => Promise.resolve(reply))

  return {
    assistant: { generateReply } satisfies Assistant,
    generateReply,
  }
}

describe('makeGenerateAssistantReplyUseCase', () => {
  it('asks the assistant to reply to the whole conversation', async () => {
    const messages = [
      createMessage({
        id: 'message-1',
        role: 'user',
      }),
      createMessage({
        id: 'message-2',
        role: 'assistant',
      }),
      createMessage({
        id: 'message-3',
        role: 'user',
      }),
    ]
    const { repository } = createFakeChatRepository(messages)
    const { assistant, generateReply } = createFakeAssistant()

    await makeGenerateAssistantReplyUseCase(repository, assistant)('chat-1')

    expect(generateReply).toHaveBeenCalledWith(messages)
  })

  it('stores the generated reply in the chat as an assistant message and returns it', async () => {
    const { repository, addChatMessage } = createFakeChatRepository([createMessage()])
    const { assistant } = createFakeAssistant('Hi there!')

    const result = await makeGenerateAssistantReplyUseCase(repository, assistant)('chat-1')

    expect(addChatMessage).toHaveBeenCalledWith('chat-1', {
      role: 'assistant',
      content: 'Hi there!',
    })
    expect(result).toMatchObject({
      id: 'reply-1',
      role: 'assistant',
      content: 'Hi there!',
    })
  })

  it.each([
    [
      'the chat has no messages or does not exist',
      [],
    ],
    [
      'the last message is from the assistant',
      [
        createMessage({ role: 'user' }),
        createMessage({ role: 'assistant' }),
      ],
    ],
  ])('returns null without calling the assistant when %s', async (_case, messages) => {
    const { repository, addChatMessage } = createFakeChatRepository(messages)
    const { assistant, generateReply } = createFakeAssistant()

    const result = await makeGenerateAssistantReplyUseCase(repository, assistant)('chat-1')

    expect(result).toBeNull()
    expect(generateReply).not.toHaveBeenCalled()
    expect(addChatMessage).not.toHaveBeenCalled()
  })

  it('does not store anything when the assistant fails', async () => {
    const { repository, addChatMessage } = createFakeChatRepository([createMessage()])
    const assistant: Assistant = { generateReply: () => Promise.reject(new Error('model down')) }

    await expect(
      makeGenerateAssistantReplyUseCase(repository, assistant)('chat-1'),
    ).rejects.toThrow('model down')
    expect(addChatMessage).not.toHaveBeenCalled()
  })
})
