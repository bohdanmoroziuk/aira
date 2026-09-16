import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $meta: {
    name: 'chat',
  },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },

  srcDir: 'app',

  vite: {
    optimizeDeps: {
      include: [
        // Pulled in lazily by a transitive AI SDK dependency; Vite's
        // scanner misses it at dev-server startup and only discovers it
        // on the first chat request, forcing a re-optimization mid-session.
        'debug',
      ],
    },
  },
})
