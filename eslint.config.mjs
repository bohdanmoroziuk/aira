// https://eslint.nuxt.com
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  // Custom flat configs go here, e.g.:
  // { rules: { 'vue/multi-word-component-names': 'off' } }

  // Keep last: disables ESLint rules that would conflict with Prettier.
  prettier,
)
