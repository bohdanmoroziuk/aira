// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-typed-router',
    '@nuxtjs/mdc',
  ],

  // Auto-import gateway modules (app/gateways/*) alongside composables & utils.
  imports: {
    dirs: ['gateways'],
  },

  devtools: {
    enabled: false,
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    highlight: {
      theme: 'material-theme-palenight',
      langs: [
        'html',
        'css',
        'javascript',
        'typescript',
        'vue',
        'markdown',
      ],
    },
  },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },

  dir: {
    public: 'src/public',
    shared: 'src/shared',
  },

  srcDir: 'src/app',

  serverDir: 'src/server',

  compatibilityDate: '2025-07-15',

  vite: {
    optimizeDeps: {
      include: [
        // Pulled in lazily by a transitive AI SDK dependency; Vite's
        // scanner misses it at dev-server startup and only discovers it
        // on the first chat request, forcing a re-optimization mid-session.
        'debug',
        // Forces Vite to crawl (and pre-bundle `debug` for) this chain too
        // — it pulls in a separate pnpm copy of `debug` from the entry
        // above, so without this a newly sent message's <MDC> parse fails
        // with "does not provide an export named 'default'" and silently
        // renders empty.
        '@nuxtjs/mdc/runtime',
      ],
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
})
