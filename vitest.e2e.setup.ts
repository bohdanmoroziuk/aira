import { inject } from 'vitest'
import { setup } from '@nuxt/test-utils/e2e'

// Runs before every e2e test file: start a fresh server from the build made
// in vitest.e2e.global-setup.ts and stop it after the file finishes.
await setup({
  build: false,
  buildDir: inject('e2eBuildDir'),
})
