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

  vite: {
    optimizeDeps: {
      include: [
        // Force Vite to crawl MDC and its non-hoisted `debug` dependency;
        // otherwise the first rendered message can fail during optimization.
        '@nuxtjs/mdc/runtime',
        '@nuxtjs/mdc > remark-gfm > remark-parse > mdast-util-from-markdown > micromark > debug',
      ],
    },
  },
})
