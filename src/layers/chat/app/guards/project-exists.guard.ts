import type { Project } from '../../shared/types/chat.types'
import { createExistsGuard } from '../../../base/app/guards/create-exists.guard'

export const ensureProjectExists = createExistsGuard<Project>({
  name: 'index',
  replace: true,
})
