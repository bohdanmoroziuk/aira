// https://eslint.nuxt.com
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Matches Prettier's actual quote choice: pick whichever quote avoids
    // escaping (e.g. a string containing an apostrophe stays double-quoted)
    // instead of always forcing single quotes and escaping into `\'`.
    '@stylistic/quotes': [
      'error',
      'single',
      { avoidEscape: true },
    ],
    // More than one prop on a component tag: each starts on its own line.
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 1,
        multiline: 1,
      },
    ],
    // More than one array element / object property: each starts on its own
    // line. Scoped to literal expressions only — destructuring patterns and
    // import/export specifier lists keep the plain "consistent" behavior,
    // since those rules can't split their inner list element-by-element and
    // forcing the brackets alone would leave a half-wrapped result.
    '@stylistic/array-bracket-newline': [
      'error',
      { multiline: true },
    ],
    '@stylistic/array-element-newline': [
      'error',
      {
        ArrayExpression: { minItems: 2 },
        ArrayPattern: 'consistent',
      },
    ],
    '@stylistic/object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          minProperties: 2,
          consistent: true,
        },
        TSTypeLiteral: {
          minProperties: 2,
          consistent: true,
        },
        TSInterfaceBody: {
          minProperties: 2,
          consistent: true,
        },
        ObjectPattern: { consistent: true },
        ImportDeclaration: { consistent: true },
        ExportDeclaration: { consistent: true },
      },
    ],
    '@stylistic/object-property-newline': ['error'],
  },
})
