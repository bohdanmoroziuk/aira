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
  `defineEventHandler` endpoints under `src/layers/*/server/api`) and the
  use-cases they call — UI/component testing is out of scope for now.
- `@nuxt/test-utils` was chosen over hand-rolling H3 event mocks because it's
  the officially supported way to exercise real Nitro routes: `setup()` +
  `$fetch()` from `@nuxt/test-utils/e2e` start the actual app and hit real
  endpoints over HTTP, verifying routing, layer merging and DI wiring end to
  end. Its heavier peer dependencies (`jsdom`, `happy-dom`, `@vue/test-utils`,
  `playwright-core`, etc.) are all `optional` and were **not** installed, since
  none of them are needed without component/browser testing.
- `vitest.config.ts` (repository root) uses `defineVitestConfig` from
  `@nuxt/test-utils/config` with `test.environment: 'node'` — this single
  `node` environment covers both plain unit tests (e.g. use-cases tested with
  fake repositories, no Nuxt runtime involved) and the `@nuxt/test-utils/e2e`
  integration tests, which just talk to a Nitro subprocess over HTTP and don't
  need a special "nuxt" test environment.
- Test files are co-located next to the code they test (`*.test.ts`), matching
  the project's existing flat file layout, and import `describe`/`it`/`expect`
  explicitly from `vitest` (`globals: true` was left off, consistent with
  `imports.autoImport: false` in `nuxt.config.ts`).
- `test` script: `vitest run`.

### Git hooks

- `husky` as a devDependency — manages Git hooks in-repo. The `prepare` script
  (`"prepare": "husky"`) installs them automatically on `pnpm install`, so every
  contributor gets the hooks without a manual step.
- `.husky/pre-commit` runs `pnpm lint` (`eslint .`) before each commit, so lint
  errors block the commit locally instead of only surfacing in CI.

### Nuxt

- `nuxt.config.ts`: `compatibilityDate: '2025-07-15'`, `devtools.enabled: false`.
- `srcDir: 'src/app'`, `serverDir: 'src/server'`, `dir: { public: 'src/public',
shared: 'src/shared' }` — consolidates all source (`app/`, `server/`,
  `shared/`, `public/`) under `src/`, keeping only config files at the
  repository root. `~` still resolves to `srcDir` (`src/app`) automatically.
- `imports.dirs: ['gateways']` — auto-imports `src/app/gateways/*`, the layer
  that wraps backend endpoints (`$fetch` calls) behind typed functions, so
  callers never touch transport details.
- Scaffold: `src/app/app.vue` wraps `NuxtLayout` + `NuxtPage` in `<UApp>`.

### UI

- `@nuxt/ui` + `tailwindcss` as runtime dependencies — the component library
  (Reka UI + Tailwind CSS v4). Registered in `nuxt.config.ts` via
  `modules: ['@nuxt/ui']`; it auto-registers `@nuxt/icon`, `@nuxt/fonts` and
  `@nuxtjs/color-mode`, so those are not listed separately.
- `src/app/assets/css/main.css` — the single stylesheet, loaded through
  `css: ['~/assets/css/main.css']`. Holds only `@import 'tailwindcss'` and
  `@import '@nuxt/ui'`; Tailwind v4 is configured in CSS, so there is no
  `tailwind.config`.
- `src/app/app.vue` wraps the tree in `<UApp>` — required for toasts, tooltips
  and programmatic overlays.
- `src/app/app.config.ts` — Nuxt UI runtime theme. Overrides the
  design tokens: `primary` is set to `violet` (replacing the Nuxt UI default
  `green`) to give Aira a calm, distinctive brand accent, and `neutral` to
  `slate` for a matching cool grey scale.
- pnpm gate: `vue-demi` is allow-listed in `pnpm-workspace.yaml` so its
  postinstall (which pins it to the installed Vue major) may run.

### Markdown rendering

- `@nuxtjs/mdc` as a runtime dependency — renders markdown (message content)
  to HTML via `<MDC>`, used in `src/app/components/MarkdownRenderer.vue`.
  Registered in `nuxt.config.ts` via `modules: ['@nuxtjs/mdc']`.
- `mdc.highlight` in `nuxt.config.ts` — Shiki syntax highlighting for fenced
  code blocks: `theme: 'material-theme-palenight'`, `langs` limited to the
  languages actually used in this project (`html`, `css`, `javascript`,
  `typescript`, `vue`, `markdown`) instead of Shiki's full bundle.
- `vite.optimizeDeps.include` in `nuxt.config.ts` gained `@nuxtjs/mdc/runtime`
  alongside the existing `debug` entry: it pulls in a separate pnpm copy of
  `debug` that Vite's dependency scanner otherwise misses at dev-server
  startup, which made the first `<MDC>` parse after sending a chat message
  fail with "does not provide an export named 'default'" and render empty.

### AI

- `ai` + `@ai-sdk/openai` as runtime dependencies — Vercel AI SDK's model-agnostic
  `generateText` and its OpenAI provider. Used in
  `src/server/services/ai.service.ts` to build the model and generate the chat
  response for `src/server/api/ai.ts`.
- `runtimeConfig.openaiApiKey` in `nuxt.config.ts`, sourced from `OPENAI_API_KEY`
  — server-only, not exposed to the client (no matching key under `public`).

### API documentation

- `@scalar/nuxt` as a runtime dependency — renders an interactive OpenAPI
  reference UI for the server routes at `/scalar`, so they can be browsed
  and tried without a separate HTTP client. Available in every environment,
  including production: `nitro.experimental.openAPI` (`nuxt.config.ts`)
  turns on Nitro's `/_openapi.json` spec route, and the module sets
  `nitro.openAPI.production` to `'prerender'`, so the spec is baked into the
  production build rather than served live.
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
  `POST /api/ai` does not have one yet: it has no method suffix in its
  filename (`ai.ts`), so Nitro's OpenAPI generator always labels it `GET` in
  the spec regardless of any `defineRouteMeta` content — fixing that would
  mean renaming the file to `ai.post.ts`, which also narrows Nitro's actual
  method dispatch (today it accepts any method), a real behavior change
  outside a docs-only task.
- **Known false positive**: `pnpm typecheck` fails on any route file that
  imports a Nitro-only composable via `#imports` (`defineRouteMeta` is the
  first one used here) — `Module '"#imports"' has no exported member
  '<name>'`. Root cause: Nuxt generates `.nuxt/types/nitro-routes.d.ts` to
  give `$fetch('/api/chats')` accurate return-type inference, and that file
  type-imports every server route file, which pulls each one into the
  **app**-context TS project. There, `#imports` resolves to the app-level
  declaration (`.nuxt/imports.d.ts`), which — correctly — doesn't include
  server/Nitro-only macros, since they're meaningless in browser/app code.
  Confirmed this isn't a real error: the same file type-checks cleanly in
  isolation against the dedicated server tsconfig
  (`.nuxt/tsconfig.server.json`, where `#imports` does resolve
  `defineRouteMeta` correctly), and the code works correctly at runtime.
  Ruled out two apparent fixes: adding a matching `typescript.tsConfig.exclude`
  for `src/layers/*/server/**/*` (the parallel of the existing `include`
  override below) has no effect, because `exclude` only prunes initial glob
  discovery, not files pulled in via another included file's import graph —
  `nitro-routes.d.ts` isn't excludable this way. Enabling `imports.autoImport`
  also has no effect — it only controls whether Nuxt auto-injects missing
  imports, not which symbols the `#imports` ambient declaration exports; it
  doesn't add `defineRouteMeta` to `.nuxt/imports.d.ts` regardless. No fix is
  applied — this is left as a documented, safe-to-ignore failure specific to
  Nitro-only imports in route files.

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
