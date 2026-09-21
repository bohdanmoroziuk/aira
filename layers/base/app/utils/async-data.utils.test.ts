import type { AsyncDataRequestStatus } from 'nuxt/app'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { isIdle, isNotIdle } from './async-data.utils'

const startedStatuses: AsyncDataRequestStatus[] = [
  'pending',
  'success',
  'error',
]

describe('isIdle', () => {
  it('is true for the idle status', () => {
    expect(isIdle('idle')).toBe(true)
  })

  it.each(startedStatuses)('is false for the %j status', (status) => {
    expect(isIdle(status)).toBe(false)
  })

  it('reads the current value of a ref', () => {
    const status = ref<AsyncDataRequestStatus>('idle')
    expect(isIdle(status)).toBe(true)

    status.value = 'pending'
    expect(isIdle(status)).toBe(false)
  })
})

describe('isNotIdle', () => {
  it('is false for the idle status', () => {
    expect(isNotIdle('idle')).toBe(false)
  })

  it.each(startedStatuses)('is true for the %j status', (status) => {
    expect(isNotIdle(status)).toBe(true)
  })

  it('reads the current value of a ref', () => {
    const status = ref<AsyncDataRequestStatus>('idle')
    expect(isNotIdle(status)).toBe(false)

    status.value = 'success'
    expect(isNotIdle(status)).toBe(true)
  })
})
