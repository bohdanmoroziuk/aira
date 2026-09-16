import type { Chat } from '../../shared/types/chat'
import { createExistsGuard } from '../../../base/app/guards/create-exists.guard'

export const ensureChatExists = createExistsGuard<Chat>({
  name: 'index',
  replace: true,
})
