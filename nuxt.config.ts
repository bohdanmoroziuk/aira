// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@scalar/nuxt',
  ],

  devtools: {
    enabled: false,
  },

  routeRules: {
    // Scalar is a client-side application. Avoid rendering it twice and
    // triggering hydration mismatches in the production reference UI.
    '/scalar/**': { ssr: false },
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    experimental: {
      // Serves the OpenAPI spec Scalar reads at /_openapi.json. @scalar/nuxt
      // sets nitro.openAPI.production to 'prerender' once this is on, so the
      // spec is baked into the production build rather than served live.
      openAPI: true,
    },
    openAPI: {
      meta: {
        title: 'Aira API',
        description: 'API for Aira chats and AI-generated replies.',
        version: '1.0.0',
      },
      // @scalar/nuxt owns the public API reference at /scalar. Disable
      // Nitro's additional built-in reference UIs to avoid duplicate docs.
      ui: {
        scalar: false,
        swagger: false,
      },
    },
  },

  vite: {
    optimizeDeps: {
      // Scalar's agent chat lazily reaches @vercel/oidc. The package isn't
      // hoisted under pnpm, so resolve it through its actual dependency chain.
      include: ['@scalar/nuxt > @scalar/api-reference > @scalar/agent-chat > ai > @ai-sdk/gateway > @vercel/oidc'],
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
    pathRouting: {
      basePath: '/scalar',
    },
    metaData: {
      title: 'Aira API Reference',
    },
  },
})
