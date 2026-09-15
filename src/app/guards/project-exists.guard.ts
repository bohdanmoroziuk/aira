import type { Project } from '~~/src/shared/types/chat'
import { createExistsGuard } from './create-exists.guard'

export const ensureProjectExists = createExistsGuard<Project>({
  name: 'index',
  replace: true,
})
