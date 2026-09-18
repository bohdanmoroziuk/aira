import { defineEventHandler, readBody } from 'h3'
import { createChat } from '../../chat.container'

export default defineEventHandler(async (event) => {
  const { title, projectId } = await readBody(event)

  const chat = await createChat({
    title,
    projectId,
  })

  return chat
})
