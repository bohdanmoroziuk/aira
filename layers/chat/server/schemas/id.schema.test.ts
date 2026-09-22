import { describe, expect, it } from 'vitest'
import { entityIdSchema } from './id.schema'

describe('entityIdSchema', () => {
  it('accepts a UUID', () => {
    expect(
      entityIdSchema.safeParse(
        '550e8400-e29b-41d4-a716-446655440000',
      ).success,
    ).toBe(true)
  })

  it.each([
    '',
    'chat-1',
    'missing-project',
    '550e8400-e29b-41d4-a716',
  ])('rejects invalid ID %s', (id) => {
    expect(entityIdSchema.safeParse(id).success).toBe(false)
  })
})
