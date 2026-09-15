import type { Chat } from '~~/src/shared/types/chat'
import { createExistsGuard } from './create-exists.guard'

export const ensureChatExists = createExistsGuard<Chat>({
  name: 'index',
  replace: true,
})
