// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-typed-router'],

  devtools: {
    enabled: false,
  },

  // Auto-import gateway modules (app/gateways/*) alongside composables & utils.
  imports: {
    dirs: ['gateways'],
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },

  vite: {
    // Pre-bundle `debug`: it's pulled in lazily by a transitive AI SDK
    // dependency, so Vite's scanner misses it at dev-server startup and only
    // discovers it on the first chat request, forcing a re-optimization and
    // a full-page reload. Listing it here avoids that.
    optimizeDeps: {
      include: ['debug'],
    },
  },
})
