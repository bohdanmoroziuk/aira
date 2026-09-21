import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createTest } from '@nuxt/test-utils/e2e'
import type { TestProject } from 'vitest/node'

declare module 'vitest' {
  export interface ProvidedContext {
    e2eBuildDir: string
  }
}

// Builds the Nuxt app once for the whole e2e run. Each test file then only
// starts its own server from this build (see vitest.e2e.setup.ts), so files
// keep isolated in-memory state without paying for a build apiece.
export default async function setupE2eBuild(project: TestProject) {
  const buildDir = resolve(project.config.root, '.nuxt', 'test', 'e2e')

  await rm(buildDir, {
    recursive: true,
    force: true,
  })

  const { setup, ctx } = createTest({
    buildDir,
    server: false,
    setupTimeout: 180000,
    // The tests only call API routes, so skip build work they never use: the
    // OpenAPI spec prerender (a second Nitro build for /_openapi.json),
    // minification, and sourcemaps.
    nuxtConfig: {
      sourcemap: false,
      nitro: {
        minify: false,
        sourceMap: false,
        experimental: {
          openAPI: false,
        },
      },
    },
  })

  // The Nuxt build wraps the process's stdio in its logger and never unwraps
  // it, which would swallow Vitest's own reporter output afterwards.
  const { stdout, stderr } = process
  const { write: writeOut } = stdout
  const { write: writeErr } = stderr

  try {
    await setup()
  } finally {
    stdout.write = writeOut
    stderr.write = writeErr
  }
  project.provide('e2eBuildDir', ctx.options.buildDir)

  return () => rm(buildDir, {
    recursive: true,
    force: true,
  })
}
