import { toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { createError, showError } from 'nuxt/app'
import { isUndefined } from '../../shared/utils/common.utils'
import type { Optional } from '../../shared/types/common.types'

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
