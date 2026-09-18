import { defineConfig } from 'vitest/config'

const e2eGlob = 'layers/**/server/api/**/*.test.ts'

export default defineConfig({
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
