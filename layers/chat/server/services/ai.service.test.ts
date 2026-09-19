import { describe, expect, it, vi } from 'vitest'
import { generateText } from 'ai'
import type { ModelMessage } from 'ai'
import { generateChatResponse } from './ai.service'

vi.mock('ai', () => ({
  generateText: vi.fn(),
}))

const model = 'test-model'

describe('generateChatResponse', () => {
  it('rejects an empty messages array without calling the model', async () => {
    await expect(generateChatResponse(model, [])).rejects.toThrow('Invalid messages format')
    expect(generateText).not.toHaveBeenCalled()
  })

  it('returns the model response text, trimmed', async () => {
    vi.mocked(generateText).mockResolvedValueOnce({
      text: '  Hello there!  ',
    } as Awaited<ReturnType<typeof generateText>>)

    const messages: ModelMessage[] = [
      {
        role: 'user',
        content: 'Hi',
      },
    ]

    const result = await generateChatResponse(model, messages)

    expect(result).toBe('Hello there!')
  })
})
