import type { Nullable, Optional } from '../types/common.types'

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
export function byProp<T, K extends keyof T>(prop: K, value: T[K]) {
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

/**
 * Checks whether a value is not undefined.
 *
 * @param value - Value to check.
 * @returns True if the value is not undefined.
 */
export const isDefined = <T>(value: Optional<T>): value is T => value !== undefined

/**
 * Checks whether a value is undefined.
 *
 * @param value - Value to check.
 * @returns True if the value is undefined.
 */
export const isUndefined = <T>(value: Optional<T>): value is undefined => value === undefined

/**
 * Checks whether a value is null.
 *
 * @param value - Value to check.
 * @returns True if the value is null.
 */
export const isNullable = <T>(value: Nullable<T>): value is null => value === null

/**
 * Checks whether an array has at least one element.
 *
 * @param array - Array to check.
 * @returns True if the array has at least one element.
 */
export const isNonEmpty = <T>(array: T[]): boolean => array.length > 0
