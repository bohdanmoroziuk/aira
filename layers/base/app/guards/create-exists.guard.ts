import type { TypedRouteLocationRaw } from '@typed-router'

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
