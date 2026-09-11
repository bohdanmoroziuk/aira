/**
 * Resolves after the specified delay.
 *
 * @param timeout - Delay in milliseconds.
 * @returns A promise that resolves when the delay has elapsed.
 */
export const sleep = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

/**
 * Generates a cryptographically secure random UUID v4.
 *
 * @returns A UUID string.
 */
export const generateUuid = () => crypto.randomUUID()

/**
 * Creates a predicate that matches objects by a property value.
 *
 * @param prop - Property to compare.
 * @param value - Expected property value.
 * @returns A predicate that performs a strict equality comparison.
 */
export const byProp = <T, K extends keyof T>(prop: K, value: T[K]) => {
  return (item: T) => {
    return item[prop] === value
  }
}

/**
 * Creates a predicate that matches objects by their string ID.
 *
 * @param id - Expected object ID.
 * @returns A predicate that performs a strict equality comparison.
 */
export const byId = <T extends { id: string }>(id: T['id']) => {
  return byProp<T, 'id'>('id', id)
}
