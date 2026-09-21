import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  byId,
  byProp,
  first,
  firstOrEmpty,
  generateUuid,
  isDefined,
  isEmpty,
  isNonEmpty,
  isNullable,
  isUndefined,
  orDefault,
  sleep,
} from './common.utils'

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays pending until the delay has elapsed', async () => {
    let resolved = false
    void sleep(1000).then(() => {
      resolved = true
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    expect(resolved).toBe(true)
  })
})

describe('generateUuid', () => {
  it('returns a UUID v4 string', () => {
    expect(generateUuid()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    )
  })

  it('returns a different value on each call', () => {
    expect(generateUuid()).not.toBe(generateUuid())
  })
})

describe('byProp', () => {
  const items = [
    {
      name: 'a',
      count: 0,
    },
    {
      name: 'b',
      count: 1,
    },
    {
      name: 'a',
      count: 2,
    },
  ]

  it('matches every item whose property equals the value', () => {
    expect(items.filter(byProp('name', 'a'))).toEqual([
      items[0],
      items[2],
    ])
  })

  it('matches nothing when no item has the value', () => {
    expect(items.filter(byProp('name', 'z'))).toEqual([])
  })

  it('compares strictly, without type coercion', () => {
    const mixed = [
      { value: 0 },
      { value: '0' },
      { value: false },
    ]

    expect(mixed.filter(byProp('value', 0))).toEqual([mixed[0]])
  })

  it('matches falsy values such as 0', () => {
    expect(items.find(byProp('count', 0))).toBe(items[0])
  })
})

describe('byId', () => {
  const chats = [
    { id: 'chat-1' },
    { id: 'chat-2' },
  ]

  it('finds the item with the given id', () => {
    expect(chats.find(byId('chat-2'))).toBe(chats[1])
  })

  it('returns undefined when no item has the id', () => {
    expect(chats.find(byId('missing'))).toBeUndefined()
  })
})

describe('isDefined / isUndefined', () => {
  it.each([
    [0],
    [''],
    [false],
    [null],
    [[]],
  ])(
    'treats %j as defined',
    (value) => {
      expect(isDefined(value)).toBe(true)
      expect(isUndefined(value)).toBe(false)
    },
  )

  it('treats undefined as not defined', () => {
    expect(isDefined(undefined)).toBe(false)
    expect(isUndefined(undefined)).toBe(true)
  })
})

describe('isNullable', () => {
  it('is true only for null', () => {
    expect(isNullable(null)).toBe(true)
  })

  it.each([
    [undefined],
    [0],
    [''],
    [false],
  ])('is false for %j', (value) => {
    expect(isNullable(value)).toBe(false)
  })
})

describe('isNonEmpty', () => {
  it('is false for an empty array', () => {
    expect(isNonEmpty([])).toBe(false)
  })

  it('is true for an array with elements, including falsy ones', () => {
    expect(isNonEmpty([1])).toBe(true)
    expect(isNonEmpty([undefined])).toBe(true)
  })
})

describe('isEmpty', () => {
  it('is true for an empty array', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('is false for an array with elements, including falsy ones', () => {
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty([undefined])).toBe(false)
  })
})

describe('first', () => {
  it('returns the first element of an array', () => {
    expect(first([
      1,
      2,
      3,
    ])).toBe(1)
  })

  it('returns the only element of a single-item array', () => {
    expect(first(['a'])).toBe('a')
  })

  it('returns undefined for an empty array', () => {
    expect(first([])).toBeUndefined()
  })

  it('returns falsy first elements as they are', () => {
    expect(first([
      0,
      1,
    ])).toBe(0)
    expect(first([
      null,
      1,
    ])).toBeNull()
  })

  it('does not modify the array', () => {
    const array = [
      1,
      2,
    ]

    first(array)

    expect(array).toEqual([
      1,
      2,
    ])
  })
})

describe('firstOrEmpty', () => {
  it('returns an array with only the first element', () => {
    expect(firstOrEmpty([
      1,
      2,
      3,
    ])).toEqual([1])
  })

  it('returns an array with the only element of a single-item array', () => {
    expect(firstOrEmpty(['a'])).toEqual(['a'])
  })

  it('returns an empty array for an empty array', () => {
    expect(firstOrEmpty([])).toEqual([])
  })

  it('keeps falsy first elements', () => {
    expect(firstOrEmpty([
      0,
      1,
    ])).toEqual([0])
    expect(firstOrEmpty([
      undefined,
      1,
    ])).toEqual([undefined])
  })

  it('returns a new array and does not modify the source', () => {
    const array = [1]

    const result = firstOrEmpty(array)

    expect(result).not.toBe(array)
    expect(array).toEqual([1])
  })
})

describe('orDefault', () => {
  it('returns the value when it is set', () => {
    expect(orDefault('a', 'fallback')).toBe('a')
  })

  it('returns the fallback for null', () => {
    expect(orDefault(null, 'fallback')).toBe('fallback')
  })

  it('returns the fallback for undefined', () => {
    expect(orDefault(undefined, 'fallback')).toBe('fallback')
  })

  it.each([
    [
      0,
      1,
    ],
    [
      '',
      'fallback',
    ],
    [
      false,
      true,
    ],
    [
      Number.NaN,
      1,
    ],
  ])('keeps the falsy value %j instead of the fallback', (value, fallback) => {
    expect(orDefault<unknown>(value, fallback)).toBe(value)
  })

  it('returns the same reference for object values', () => {
    const value = { id: 'a' }

    expect(orDefault(value, { id: 'b' })).toBe(value)
  })
})
