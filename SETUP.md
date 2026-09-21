# Aira — Setup Log

A compact reference for why project-level tools and configuration exist. Use
`README.md` for commands and `CONVENTIONS.md` for working agreements; keep this
file focused on configuration ownership, architecture, and non-obvious
constraints.

- Repository: https://github.com/bohdanmoroziuk/aira
- Author: Bohdan Moroziuk (https://github.com/bohdanmoroziuk)

## Environment

| Tool | Version | Source of truth |
| --- | --- | --- |
| Node | 22.14.0 pinned; >=22.14.0 accepted | `.nvmrc`, `package.json#engines` |
| pnpm | 12.3.4 pinned; >=12 accepted | `package.json` |
| Nuxt | ^4.5.2 | `package.json` |
| Vue | ^3.5.42 | `package.json` |

## Configuration

### Toolchain and portability

- `.nvmrc`, `package.json#engines`, and `.npmrc` keep Node and pnpm versions
  aligned; `engine-strict=true` makes incompatible installs fail.
- Corepack provides the pnpm version pinned by `packageManager`. Setup commands,
  including the optional nvm workflow, are documented in `README.md`.
- `.npmrc` uses `shamefully-hoist=true` so Nuxt/Vite tooling can resolve
  undeclared transitive packages, and `shell-emulator=true` for cross-platform
  package scripts.
- `.editorconfig` defines editor-neutral whitespace rules; `.gitattributes`
  normalizes repository text files to LF on every OS.

### TypeScript

- `typescript` and `vue-tsc` pin the compiler used by the editor, CI, and
  `nuxt typecheck`.
- Keep TypeScript on 5.x. The 7.x native port has no `lib/tsserver.js` and is
  not yet supported by `vue-tsc` or Nuxt type checking.

### Editor

- `.vscode/settings.json` selects workspace TypeScript and pnpm, excludes Nuxt
  output and other generated files, and delegates formatting and fixes to
  ESLint.
- Tailwind IntelliSense scans CSS, strings, `ui` props, and `defineAppConfig`.
  Built-in CSS/LESS/SCSS validators are disabled because they misreport
  Tailwind directives in CSS and Vue SFCs.
- `.vscode/extensions.json` recommends Volar, Prisma, Tailwind CSS, and ESLint;
  Vetur and the legacy Vue TypeScript plugin are marked as conflicting.

### Linting and formatting

- `@nuxt/eslint` generates the Nuxt-aware flat config; `eslint.config.mjs`
  extends it through `withNuxt()`. ESLint is both linter and formatter.
- Nuxt's stylistic config preserves the existing arrow-parenthesis and `1tbs`
  brace style. `@stylistic/quotes` uses `avoidEscape` to choose the quote that
  avoids escaping.
- `vue/max-attributes-per-line` puts multiple component props on separate
  lines. The array/object newline rules do the same for expression literals
  with multiple entries while keeping destructuring and import/export lists
  consistent rather than half-wrapped.
- ESLint has no equivalent of Prettier's `printWidth`, so arbitrary expressions,
  strings, and template attributes are not automatically rewrapped.
- Lint commands are documented in `README.md`.

### Testing

- `vitest.config.ts` defines two Node-environment projects: `unit` for all tests
  except server API routes, and `e2e` for
  `layers/**/server/api/**/*.test.ts`.
- E2E tests call real Nitro endpoints with `$fetch()` from
  `@nuxt/test-utils/e2e`. This verifies routing, layer merging, and
  dependency-injection wiring without hand-written H3 mocks.
- The Nuxt app is built once per e2e run in `vitest.e2e.global-setup.ts`
  (into `.nuxt/test/e2e`, removed afterwards) with the OpenAPI spec prerender,
  minification, and sourcemaps turned off, since the tests only call API
  routes. `vitest.e2e.setup.ts` runs before
  every e2e file and starts a fresh server from that build, so each file keeps
  its own in-memory state without a rebuild. Test files therefore don't call
  `setup()` themselves. The global setup restores `process.stdout/stderr` after
  the build, because Nuxt's logger otherwise swallows Vitest's reporter output.
- Browser/component peers are unnecessary because UI testing is currently out
  of scope. Tests are co-located as `*.test.ts` and import Vitest APIs
  explicitly; globals remain disabled.
- `vitest.config.ts` maps `#layers` to `./layers` so code tested outside Nuxt
  can use the same cross-layer import shape. `fileURLToPath` keeps the alias
  valid on Windows.
- Test commands and the unit/E2E distinction are documented in `README.md`.

### Git hooks

- Husky's `prepare` script installs repository hooks during `pnpm install`.
- `.husky/pre-commit` runs the full lint check, so lint errors block commits
  before CI.

### Nuxt architecture

- Root `nuxt.config.ts` owns cross-application modules, OpenAPI, Scalar, ESLint,
  and shared Vite settings. It uses compatibility date `2025-07-15` and keeps
  devtools disabled.
- Nuxt discovers the root `layers/` directory without custom `srcDir`,
  `serverDir`, or public-directory overrides.
- `layers/base` owns the application shell, shared UI, theme, styles, markdown,
  common types/utilities, and typed routing through `nuxt-typed-router`.
- `layers/chat` owns chat/project UI, gateways, server routes, use-cases,
  repositories, validation, and AI runtime configuration.
- Default Nuxt auto-imports cover framework APIs, composables, utilities, and
  shared types. Gateways are imported explicitly by their consumers.
- `layers/base/app/app.vue` provides `<UApp>`, `NuxtLayout`, `NuxtPage`, the
  route announcer, loading indicator, and title template.

### UI

- `@nuxt/ui` and Tailwind CSS v4 provide the component and styling system.
  Nuxt UI also registers Icon, Fonts, and Color Mode modules.
- `layers/base/app/assets/css/main.css` is the application stylesheet. It
  declares Scalar's CSS layer order before importing Tailwind and Nuxt UI, so
  application utilities win without a Tailwind config.
- Root `<UApp>` enables toasts, tooltips, and programmatic overlays.
  `layers/base/app/app.config.ts` sets `violet` as the primary palette and
  `slate` as the neutral palette.

### Markdown rendering

- `@nuxtjs/mdc` renders message content through `<MDC>` in
  `layers/base/app/components/MarkdownRenderer.vue`.
- `layers/base/nuxt.config.ts` configures Shiki with the Palenight theme and
  bundles only HTML, CSS, JavaScript, TypeScript, Vue, and Markdown grammars.

### AI and validation

- `ai` and `@ai-sdk/openai` provide model-agnostic text generation and the
  OpenAI provider used by `layers/chat/server/assistants/openai.assistant.ts`,
  which backs the assistant-reply flow.
- `layers/chat/nuxt.config.ts` maps `OPENAI_API_KEY` to server-only runtime
  config; the key is never exposed to the client.
- Zod schemas validate project input at the flow boundary before use-cases
  receive it.

### API documentation

- `@scalar/nuxt` serves the interactive reference at `/scalar`. Nitro exposes
  `/_openapi.json` and prerenders the production schema; its duplicate Scalar
  and Swagger UIs are disabled.
- `/scalar/**` is client-rendered to avoid Scalar hydration mismatches without
  changing SSR for application routes.
- Chat and project endpoints declare OpenAPI metadata with `defineRouteMeta`.
- Nitro finds `defineRouteMeta` by statically scanning the whole route file, so
  it may appear after `export default defineEventHandler(...)`.
- Route files import `defineRouteMeta` from `nitropack/runtime` so this
  Nitro-only macro does not leak into app-level typed `$fetch` imports.

### Dependency workarounds

- Root `nuxt.config.ts` prebundles Scalar agent chat's lazy dependency chain to
  `@vercel/oidc`, which is not hoisted under pnpm.
- `layers/base/nuxt.config.ts` prebundles `@nuxtjs/mdc/runtime` and MDC's
  non-hoisted `debug` chain; otherwise the first `<MDC>` render can fail during
  Vite optimization.
- `layers/chat/nuxt.config.ts` prebundles the AI SDK's lazy `debug` dependency
  to avoid a re-optimization on the first chat request.
- `pnpm-workspace.yaml` allows build scripts for `esbuild`, `unrs-resolver`, and
  `vue-demi`; `better-sqlite3` stays explicitly blocked.
- Keep `byProp` in `layers/base/shared/utils/common.utils.ts` as a function
  declaration: `export function byProp<T, K extends keyof T>(...)`. Nuxt's
  auto-import scanner misreads the equivalent exported generic arrow as a
  phantom `K` export and breaks full builds.

### Environment variables

- `.env.example` lists every required variable without secrets. Local `.env`
  and `.env.*` files are ignored except for that template.
- `OPENAI_API_KEY` authorizes requests made by `POST /api/chats/:chatId/assistant-reply`. Copying the
  template and other setup commands are documented in `README.md`.

### Package metadata and license

- `package.json` marks the app private and records the author, MIT license,
  repository, homepage, and issue tracker.
- `LICENSE` is authoritative for the license text and copyright.
