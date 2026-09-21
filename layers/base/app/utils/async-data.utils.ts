import type { AsyncDataRequestStatus } from 'nuxt/app'
import type { MaybeRef } from 'vue'
import { toValue } from 'vue'

/**
 * Checks whether an async data status is 'idle', i.e. the request has not been started yet.
 *
 * @param status - Status of a `useAsyncData` request, either the value or its ref.
 * @returns True if the status is 'idle'.
 */
export const isIdle = (status: MaybeRef<AsyncDataRequestStatus>): boolean => toValue(status) === 'idle'

/**
 * Checks whether an async data status is anything other than 'idle', i.e. the request has been started.
 *
 * @param status - Status of a `useAsyncData` request, either the value or its ref.
 * @returns True if the status is 'pending', 'success' or 'error'.
 */
export const isNotIdle = (status: MaybeRef<AsyncDataRequestStatus>): boolean => !isIdle(status)
