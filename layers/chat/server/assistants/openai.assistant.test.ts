import { describe, expect, it, vi } from 'vitest'
import { generateText } from 'ai'
import type { ChatMessage } from '../../shared/types/chat.types'
import { createOpenAIAssistant } from './openai.assistant'

vi.mock('ai', () => ({
  generateText: vi.fn(),
}))

const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 'message-1',
  role: 'user',
  content: 'Hello',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

const mockModelReply = (text: string) => {
  vi.mocked(generateText).mockResolvedValueOnce({ text } as Awaited<ReturnType<typeof generateText>>)
}

describe('createOpenAIAssistant', () => {
  it('returns the trimmed model reply', async () => {
    mockModelReply('  Hi there!  ')
    const assistant = createOpenAIAssistant('test-key')

    const reply = await assistant.generateReply([createMessage()])

    expect(reply).toBe('Hi there!')
  })

  it('sends only the role and content of each message to the model', async () => {
    mockModelReply('Hi there!')
    const assistant = createOpenAIAssistant('test-key')

    await assistant.generateReply([
      createMessage({
        role: 'system',
        content: 'Be brief',
      }),
      createMessage({
        role: 'user',
        content: 'Hello',
      }),
    ])

    expect(generateText).toHaveBeenLastCalledWith(expect.objectContaining({
      messages: [
        {
          role: 'system',
          content: 'Be brief',
        },
        {
          role: 'user',
          content: 'Hello',
        },
      ],
    }))
  })

  it('returns the trimmed model title for the given message', async () => {
    mockModelReply('  Learning Vue  ')
    const assistant = createOpenAIAssistant('test-key')

    const title = await assistant.generateTitle('How do I learn Vue?')

    expect(title).toBe('Learning Vue')
    expect(generateText).toHaveBeenLastCalledWith(expect.objectContaining({
      messages: [
        {
          role: 'user',
          content: 'How do I learn Vue?',
        },
      ],
    }))
  })

  it('passes the title guidance as instructions, not as a system message', async () => {
    mockModelReply('Learning Vue')
    const assistant = createOpenAIAssistant('test-key')

    await assistant.generateTitle('How do I learn Vue?')

    const options = vi.mocked(generateText).mock.calls.at(-1)?.[0]

    expect(options).toHaveProperty('instructions', expect.any(String))
    expect(options?.messages).not.toContainEqual(expect.objectContaining({ role: 'system' }))
  })
})
