import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    'nuxt-typed-router',
    '@nuxtjs/mdc',
  ],

  $meta: {
    name: 'base',
  },

  // `~` in a layer's own options resolves against the final merged
  // project's srcDir, not this layer's — resolve from this file instead.
  css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],

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

  srcDir: 'app',

  vite: {
    optimizeDeps: {
      include: [
        // Forces Vite to crawl (and pre-bundle `debug` for) this chain
        // — it pulls in a separate pnpm copy of `debug` that the chat
        // layer's AI SDK entry also needs pre-bundled (see that layer's
        // config), so without this a newly sent message's <MDC> parse
        // fails with "does not provide an export named 'default'" and
        // silently renders empty.
        '@nuxtjs/mdc/runtime',
      ],
    },
  },
})
