import { defineEventHandler, readBody } from '#imports'
import { createChat } from '../../chat.container'

export default defineEventHandler(async (event) => {
  const { title, projectId } = await readBody(event)

  const chat = await createChat({
    title,
    projectId,
  })

  return chat
})
