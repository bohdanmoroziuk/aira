import { defineEventHandler } from 'h3'
import { getChats } from '../../chat.container'

export default defineEventHandler(async () => {
  const chats = await getChats()

  return chats
})
