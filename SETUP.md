# Aira — Setup Log

A running record of project configuration. Add each setup change here as it is made.

- Repository: https://github.com/bohdanmoroziuk/aira
- Author: Bohdan Moroziuk (https://github.com/bohdanmoroziuk)
- Project conventions: see `CONVENTIONS.md`

---

## Environment

| Tool | Version                                                            |
| ---- | ------------------------------------------------------------------ |
| Node | >=22.14.0 (pinned via `.nvmrc`, enforced via `engines` + `.npmrc`) |
| pnpm | 12.3.4                                                             |
| Nuxt | ^4.5.2                                                             |
| Vue  | ^3.5.42                                                            |

---

## Configuration

### Node version

- Pinned to `v22.14.0` in `.nvmrc` (repository root).
- Installed and activated with nvm:
  ```bash
  nvm install   # reads .nvmrc, downloads v22.14.0
  nvm use       # switches the current shell to v22.14.0
  ```
- `corepack enable pnpm` was run under v22.14.0 so the pinned pnpm stays available.

### Package manager

- pnpm, pinned in `package.json`:
  - `"packageManager": "pnpm@12.3.4"` (Corepack)
  - `"engines": { "node": ">=22.14.0", "pnpm": ">=12" }`
- `.npmrc` (repository root):
  - `shamefully-hoist=true` — flattens `node_modules` so Nuxt/Vite tools can
    resolve packages they use but don't declare as direct dependencies.
  - `engine-strict=true` — aborts `pnpm install` when the local Node/pnpm
    version violates `engines` in `package.json`, so `.nvmrc`, `engines` and
    `packageManager` are actually enforced instead of advisory.
  - `shell-emulator=true` — runs `package.json` scripts through pnpm's built-in
    POSIX shell so they behave the same on Windows; a no-op on macOS/Linux.

### TypeScript

- `typescript` and `vue-tsc` as devDependencies. Not in the Nuxt scaffold by
  default — added so the editor and CI use one pinned compiler and so
  `nuxt typecheck` works.
- Pinned to the **5.x** line (`typescript@^5.9.3`). `pnpm add -D typescript`
  otherwise resolves to `7.x`, the native (Go) port, whose package has no
  `lib/tsserver.js` and which `vue-tsc` / Nuxt's typecheck do not yet support.
- `typecheck` script: `nuxt typecheck`.

### Editor

- `.editorconfig` (repository root) — enforces a consistent base coding style
  (encoding, line endings, indentation, whitespace) across all editors and
  contributors, independent of personal IDE settings.
- `.gitattributes` (repository root) — `* text=auto eol=lf`: normalizes every
  text file to LF in the repository and working tree on all operating systems,
  the git-level counterpart to `.editorconfig`.
- `.vscode/settings.json` — workspace VS Code tuning: excludes Nuxt
  build/output dirs from the file watcher (VS Code's defaults already cover
  `node_modules`/`.git`; `.gitignore` + `search.useIgnoreFiles` already cover
  search, so only `coverage` and `pnpm-lock.yaml` are added there), uses the
  workspace TypeScript version, sets pnpm as the package manager, makes the
  ESLint extension the default formatter with format-on-save
  (`eslint.format.enable`) and applies ESLint autofixes on save
  (`source.fixAll.eslint`), and enables Tailwind IntelliSense for Nuxt UI
  (treat `.css` as Tailwind, suggest inside strings, scan the `ui` prop and
  `defineAppConfig`),
  and turns off the built-in CSS/LESS/SCSS validators (`css.validate`,
  `less.validate`, `scss.validate: false`) — the Tailwind CSS IntelliSense
  extension already covers `@apply`/`@reference`, so the built-in ones only
  flag them as "Unknown at rule", including inside Vue SFC `<style>` blocks.
  Settings are reviewed for current relevance, not just valid syntax.
- `.vscode/extensions.json` — recommends the extensions this project is built
  around (Vue Volar, Prisma, Tailwind CSS, ESLint) so contributors get a
  one-click install prompt, and marks conflicting/legacy ones as unwanted
  (Vetur and the deprecated Vue TypeScript plugin, both superseded by Volar).

### Linting and formatting

- `@nuxt/eslint` + `eslint` as devDependencies — the module wires ESLint into
  Nuxt and generates a project-aware flat config (`.nuxt/eslint.config.mjs`,
  gitignored) from the actual route/component/import setup.
- `eslint.config.mjs` (repository root) — the real entry point: re-exports the
  generated config through `withNuxt()`. Registered in `nuxt.config.ts` via
  `modules: ['@nuxt/eslint']`.
- ESLint owns both linting and formatting — there is no separate formatter.
  `nuxt.config.ts`'s `eslint.config.stylistic` option turns on the module's
  bundled `@stylistic/eslint-plugin` rule set (indent, quotes, semicolons,
  brace style, etc.), tuned with `arrowParens: true` and `braceStyle: '1tbs'`
  to match the codebase's pre-existing (formerly Prettier-formatted) style.
  `eslint.config.nuxt.sortConfigKeys` is explicitly turned back off — it's a
  separate default this option enables that reorders every key in
  `nuxt.config.ts` to match Nuxt's schema order, unrelated to formatting.
- `eslint.config.mjs` adds rules `@stylistic` doesn't turn on by itself:
  - `vue/max-attributes-per-line` (`singleline: 1, multiline: 1`) — a
    component tag with more than one prop always wraps, one prop per line.
  - `@stylistic/array-element-newline` / `object-curly-newline` /
    `object-property-newline` (scoped to `ArrayExpression`/`ObjectExpression`,
    plus `TSTypeLiteral`/`TSInterfaceBody` for the object rule) with
    `minItems`/`minProperties: 2` — an array or object literal with more than
    one element always wraps, one element per line. Scoped away from
    destructuring patterns and import/export specifiers: those rules can't
    split their inner list element-by-element, so forcing just the
    brackets/braces there would leave a half-wrapped result.
  - `@stylistic/array-bracket-newline: { multiline: true }` — once the two
    rules above have split an array's elements onto their own lines, this
    pushes the brackets onto their own lines too.
  - `@stylistic/quotes: { avoidEscape: true }` — reproduces Prettier's actual
    quote choice (pick whichever quote needs no escaping) instead of always
    forcing single quotes and escaping apostrophes as `\'`.
  - There is no equivalent of Prettier's `printWidth`: no ESLint/stylistic
    rule can re-wrap arbitrary expressions or long strings/template
    attributes the way Prettier did, so no line-length rule is configured.
- Scripts: `lint` (`eslint .`), `lint:fix` (`eslint . --fix`).
- pnpm gate: `unrs-resolver` (native resolver used by the ESLint import plugin)
  is allow-listed in `pnpm-workspace.yaml` so its build script may run under
  pnpm's blocked-by-default policy.

### Testing

- No test runner or test files existed in the project before this. `vitest` and
  `@nuxt/test-utils` were added as devDependencies to test server routes (Nitro
  `defineEventHandler` endpoints under `layers/*/server/api`) and the
  use-cases they call — UI/component testing is out of scope for now.
- `@nuxt/test-utils` was chosen over hand-rolling H3 event mocks because it's
  the officially supported way to exercise real Nitro routes: `setup()` +
  `$fetch()` from `@nuxt/test-utils/e2e` start the actual app and hit real
  endpoints over HTTP, verifying routing, layer merging and DI wiring end to
  end. Its heavier peer dependencies (`jsdom`, `happy-dom`, `@vue/test-utils`,
  `playwright-core`, etc.) are all `optional` and were **not** installed, since
  none of them are needed without component/browser testing.
- `vitest.config.ts` (repository root) uses `defineConfig` from
  `vitest/config` with `test.environment: 'node'` — this single
  `node` environment covers both plain unit tests (e.g. use-cases tested with
  fake repositories, no Nuxt runtime involved) and the `@nuxt/test-utils/e2e`
  integration tests, which just talk to a Nitro subprocess over HTTP and don't
  need a special "nuxt" test environment.
- `vitest.config.ts` also defines a `#layers` alias to `./layers`, mirroring the
  `#layers/<name>` alias Nuxt generates. Plain Vitest has no Nuxt auto-imports,
  so unit-tested server code (e.g. use-cases) imports cross-layer utilities
  explicitly through it (`#layers/base/shared/utils/...`) instead of relative
  `../../../base/...` paths. The path is built with `fileURLToPath` so it stays
  valid on Windows.
- Test files are co-located next to the code they test (`*.test.ts`), matching
  the project's existing flat file layout, and import `describe`/`it`/`expect`
  explicitly from `vitest` because `globals: true` is intentionally disabled.
- `test` script: `vitest run`.

### Git hooks

- `husky` as a devDependency — manages Git hooks in-repo. The `prepare` script
  (`"prepare": "husky"`) installs them automatically on `pnpm install`, so every
  contributor gets the hooks without a manual step.
- `.husky/pre-commit` runs `pnpm lint` (`eslint .`) before each commit, so lint
  errors block the commit locally instead of only surfacing in CI.

### Nuxt

- `nuxt.config.ts`: `compatibilityDate: '2025-07-15'`, `devtools.enabled: false`.
- `layers/base` owns application-wide UI, styling and markdown configuration;
  `layers/chat` owns chat UI, server routes, AI runtime configuration and chat
  gateways. Nuxt discovers both from the root `layers/` directory.
- The project uses Nuxt 4's default root layout (`layers/`, `public/`) without
  a custom `srcDir`, `serverDir` or `dir.public` override.
- Nuxt's default auto-imports are enabled for Vue/Nuxt APIs, layer composables,
  app/shared utilities and shared types. The chat layer additionally registers
  `app/gateways`, which wraps backend endpoints behind typed functions.
- Scaffold: `layers/base/app/app.vue` wraps `NuxtLayout` + `NuxtPage` in
  `<UApp>`.

### UI

- `@nuxt/ui` + `tailwindcss` as runtime dependencies — the component library
  (Reka UI + Tailwind CSS v4). Registered in `layers/base/nuxt.config.ts` via
  `modules: ['@nuxt/ui']`; it auto-registers `@nuxt/icon`, `@nuxt/fonts` and
  `@nuxtjs/color-mode`, so those are not listed separately.
- `layers/base/app/assets/css/main.css` — the single stylesheet, loaded by the
  base layer. It declares Scalar's CSS layer order before importing Tailwind
  and Nuxt UI, so their utilities take precedence without a Tailwind config.
- `layers/base/app/app.vue` wraps the tree in `<UApp>` — required for toasts, tooltips
  and programmatic overlays.
- `layers/base/app/app.config.ts` — Nuxt UI runtime theme. Overrides the
  design tokens: `primary` is set to `violet` (replacing the Nuxt UI default
  `green`) to give Aira a calm, distinctive brand accent, and `neutral` to
  `slate` for a matching cool grey scale.
- pnpm gate: `vue-demi` is allow-listed in `pnpm-workspace.yaml` so its
  postinstall (which pins it to the installed Vue major) may run.

### Markdown rendering

- `@nuxtjs/mdc` as a runtime dependency — renders markdown (message content)
  to HTML via `<MDC>`, used in
  `layers/base/app/components/MarkdownRenderer.vue`. Registered by the base
  layer.
- `mdc.highlight` in `layers/base/nuxt.config.ts` — Shiki syntax highlighting for fenced
  code blocks: `theme: 'material-theme-palenight'`, `langs` limited to the
  languages actually used in this project (`html`, `css`, `javascript`,
  `typescript`, `vue`, `markdown`) instead of Shiki's full bundle.
- `vite.optimizeDeps.include` in the base layer includes `@nuxtjs/mdc/runtime`
  and its non-hoisted `debug` dependency chain, which Vite's scanner otherwise
  misses at dev-server startup and can make the first `<MDC>` render fail.

### AI

- `ai` + `@ai-sdk/openai` as runtime dependencies — Vercel AI SDK's model-agnostic
  `generateText` and its OpenAI provider. Used in
  `layers/chat/server/services/ai.service.ts` to build the model and generate
  the chat response for `layers/chat/server/api/ai.post.ts`.
- `runtimeConfig.openaiApiKey` in `layers/chat/nuxt.config.ts`, sourced from
  `OPENAI_API_KEY` — server-only, not exposed to the client.

### API documentation

- `@scalar/nuxt` as a runtime dependency — renders an interactive OpenAPI
  reference UI for the server routes at `/scalar`, so they can be browsed
  and tried without a separate HTTP client. Available in every environment,
  including production: `nitro.experimental.openAPI` (`nuxt.config.ts`)
  turns on Nitro's `/_openapi.json` spec route, and the module sets
  `nitro.openAPI.production` to `'prerender'`, so the spec is baked into the
  production build rather than served live.
- `nitro.openAPI.meta` supplies the generated document's title, description
  and API version. Nitro's built-in Scalar and Swagger pages are disabled
  because `@scalar/nuxt` owns the public `/scalar` reference. Scalar's page
  metadata is configured separately under `scalar.metaData`. The
  `/scalar/**` route is client-rendered through `routeRules` to avoid a
  hydration mismatch in Scalar's interactive UI; this does not affect SSR for
  the application routes.
- Registering the module surfaced a real build-breaking bug: Nuxt's
  auto-import scanner (unimport) misparsed the two-type-parameter generic on
  `byProp` in `common.utils.ts` (`export const byProp = <T, K extends keyof
  T>(...)`), treating the `K` type parameter as a phantom named export and
  failing every full build (`nuxt build`, and the `@nuxt/test-utils` e2e
  specs' internal build) with `[MISSING_EXPORT] "K" is not exported`.
  Renaming the type parameter didn't help — it's the multi-param generic
  clause on an exported `const` arrow function that trips the scanner.
  Rewriting `byProp` as `export function byProp<T, K extends keyof T>(...)`
  (same signature, `function` keyword instead of a `const` arrow) avoided
  the misparse entirely, with no change in behavior or call-site type
  inference.
- `GET /api/chats` and `POST /api/chats` have `defineRouteMeta({ openAPI:
  ... })` annotations (summary, description, tags, request/response
  schemas), placed after `export default defineEventHandler(...)` in each
  file — Nitro extracts it by statically scanning the whole file, the same
  way Nuxt extracts `definePageMeta`, so placement doesn't affect behavior.
  `POST /api/ai` is method-scoped through its `ai.post.ts` filename but is not
  documented with route metadata.
- Route files import `defineRouteMeta` directly from `nitropack/runtime`. This
  keeps the Nitro-only macro out of the app-level `#imports` declaration that
  Nuxt consumes while generating typed `$fetch` routes.

### Environment variables

- `.env.example` (repository root) — template listing every env var the app
  expects, committed with no secret values. Copy it to `.env` for local work:
  ```bash
  cp .env.example .env
  ```
- `.env` and `.env.*` are gitignored; `.env.example` is the one exception.
- `OPENAI_API_KEY` — OpenAI API key used by the `/api/ai` route to generate
  chat responses. Get one from the OpenAI dashboard.

### Package metadata

- `package.json` identity fields:
  - `"private": true` — never published to a registry.
  - `"author": "Bohdan Moroziuk <bogdan7morozyuk@gmail.com> (https://github.com/bohdanmoroziuk)"`
  - `"license": "MIT"` — matches the `LICENSE` file.
  - `"repository": { "type": "git", "url": "git+https://github.com/bohdanmoroziuk/aira.git" }`
  - `"homepage": "https://github.com/bohdanmoroziuk/aira#readme"`
  - `"bugs": { "url": "https://github.com/bohdanmoroziuk/aira/issues" }`

### License

- MIT, see `LICENSE` in the repository root. Copyright (c) 2026 Bohdan Moroziuk.
