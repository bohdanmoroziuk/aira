import type { MaybeRefOrGetter } from 'vue'
import type { Optional } from '~~/src/shared/types/common'
import { toValue, watch } from 'vue'
import { createError, isUndefined, showError } from '#imports'

export function createNotFoundGuard<T>(message: string) {
  return function ensureExists(value: MaybeRefOrGetter<Optional<T>>) {
    if (isUndefined(toValue(value))) {
      throw createError({
        statusCode: 404,
        statusMessage: message,
      })
    }

    watch(() => toValue(value), (current) => {
      if (isUndefined(current)) {
        showError(createError({
          statusCode: 404,
          statusMessage: message,
        }))
      }
    })
  }
}
