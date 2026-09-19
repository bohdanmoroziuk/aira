import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const e2eGlob = 'layers/**/server/api/**/*.test.ts'

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors Nuxt's `#layers/<name>` alias so unit-tested code can import
      // across layers without Nuxt auto-imports.
      '#layers': fileURLToPath(new URL('./layers', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['layers/**/*.test.ts'],
          exclude: [e2eGlob],
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: [e2eGlob],
        },
      },
    ],
  },
})
