// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    './src/layers/base',
    './src/layers/chat',
  ],

  modules: [
    '@nuxt/eslint',
    '@scalar/nuxt',
  ],
  // Auto-import disabled everywhere except components; import explicitly
  // (or from '#imports') for composables, utils, gateways, Vue reactivity,
  // and Nuxt/module composables alike.
  imports: {
    autoImport: false,
  },

  devtools: {
    enabled: false,
  },

  dir: {
    public: 'src/public',
  },

  // All app/server code lives in the extended layers now — this folder no
  // longer exists, which is fine (Nuxt treats a missing srcDir as empty).
  // Must stay set explicitly though: leaving it unset lets a layer's own
  // `srcDir: 'app'` leak through and get re-resolved against this rootDir
  // (breaking `~`/`~~` for the whole project), and setting it to exactly
  // `.` (rootDir) trips an unrelated Nuxt/TS bug in module config typing
  // (e.g. `@nuxtjs/mdc`'s `mdc` key stops type-checking in layer configs).
  srcDir: 'src/app',

  compatibilityDate: '2025-07-15',

  nitro: {
    experimental: {
      // Serves the OpenAPI spec Scalar reads at /_openapi.json. @scalar/nuxt
      // sets nitro.openAPI.production to 'prerender' once this is on, so the
      // spec is baked into the production build rather than served live.
      openAPI: true,
    },
  },

  vite: {
    optimizeDeps: {
      // The Scalar API reference (@scalar/nuxt) lazily reaches a couple of
      // CJS-only transitive deps that Vite's dependency scan doesn't always
      // discover up front, so it falls back to serving the raw source file
      // instead of a pre-bundled one — and those files' browser builds have
      // no ESM default export, breaking with "does not provide an export
      // named 'default'/'getContext'". Neither is hoisted to the root
      // node_modules under pnpm (both have conflicting peer/version
      // variants elsewhere in the tree), so a bare 'debug' or '@vercel/oidc'
      // entry fails to resolve — the chained syntax below resolves each one
      // through its real dependency path instead:
      //  - debug: pulled in by micromark's tokenizer (used to render
      //    markdown in the reference), reached here via @nuxtjs/mdc's own
      //    remark-gfm dependency (same debug, same resolved path).
      //  - @vercel/oidc: pulled in by Scalar's agent-chat feature's `ai`
      //    dependency. @scalar/nuxt tries to add this one itself, but its
      //    existsSync(rootDir/node_modules/@vercel/oidc) check also assumes
      //    hoisting, so it silently no-ops under pnpm here too.
      include: [
        '@nuxtjs/mdc > remark-gfm > remark-parse > mdast-util-from-markdown > micromark > debug',
        '@scalar/nuxt > @scalar/api-reference > @scalar/agent-chat > ai > @ai-sdk/gateway > @vercel/oidc',
      ],
    },
  },

  typescript: {
    tsConfig: {
      include: ['../src/layers/*/app/**/*'],
    },
  },

  eslint: {
    config: {
      stylistic: {
        // Match the codebase's existing Prettier-formatted style:
        // always parenthesize single arrow params, cuddle `else`/`catch`.
        arrowParens: true,
        braceStyle: '1tbs',
      },
    },
  },

  scalar: {
    darkMode: true,
    showSidebar: true,
    pathRouting: {
      basePath: '/scalar',
    },
    metaData: {
      title: 'Aira API Reference',
    },
  },
})
