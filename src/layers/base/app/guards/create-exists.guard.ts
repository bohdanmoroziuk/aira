import { toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { navigateTo } from 'nuxt/app'
import { isUndefined } from '../../shared/utils/common.utils'
import type { Optional } from '../../shared/types/common.types'

export function createExistsGuard<T>(redirectTo: RouteLocationRaw) {
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
