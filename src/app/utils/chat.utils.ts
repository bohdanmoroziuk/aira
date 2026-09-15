import { isUndefined } from '#imports'
import type { Chat } from '~~/src/shared/types/chat'

export const isWithinDays = (date: Date, days: number) => {
  const now = new Date()
  const timeAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  return date >= timeAgo
}

export const filterByDateRange = (
  chats: Chat[],
  startDays: number,
  endDays?: number,
) => {
  return chats
    .filter((chat) => {
      const date = new Date(chat.updatedAt)

      if (isUndefined(endDays)) {
        return !isWithinDays(date, startDays)
      }

      return !isWithinDays(date, startDays) && isWithinDays(date, endDays)
    })
    .sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
}
