import type { MaybeRefOrGetter } from 'vue'
import type { TypedRouteLocationRaw } from '@typed-router'
import type { Optional } from '~~/src/shared/types/common'
import { toValue, watch } from 'vue'
import { isUndefined, navigateTo } from '#imports'

export function createExistsGuard<T>(redirectTo: TypedRouteLocationRaw) {
  return async function ensureExists(value: MaybeRefOrGetter<Optional<T>>) {
    if (isUndefined(toValue(value))) {
      await navigateTo(redirectTo)
      return
    }

    watch(() => toValue(value), (current) => {
      if (isUndefined(current)) {
        navigateTo(redirectTo)
      }
    })
  }
}
