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
})
