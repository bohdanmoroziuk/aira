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
