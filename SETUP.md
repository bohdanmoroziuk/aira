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
  workspace TypeScript version, sets pnpm as the package manager, makes
  Prettier the default formatter with format-on-save, and applies ESLint
  autofixes on save. Settings are reviewed for current relevance, not just
  valid syntax.
- `.vscode/extensions.json` — recommends the extensions this project is built
  around (Prettier, Vue Volar, Prisma, Tailwind CSS, ESLint) so contributors
  get a one-click install prompt, and marks conflicting/legacy ones as unwanted
  (Vetur and the deprecated Vue TypeScript plugin, both superseded by Volar).

### Linting and formatting

- `@nuxt/eslint` + `eslint` as devDependencies — the module wires ESLint into
  Nuxt and generates a project-aware flat config (`.nuxt/eslint.config.mjs`,
  gitignored) from the actual route/component/import setup.
- `eslint.config.mjs` (repository root) — the real entry point: re-exports the
  generated config through `withNuxt()`. Registered in `nuxt.config.ts` via
  `modules: ['@nuxt/eslint']`.
- The module's `stylistic` option is left off (its default): Prettier owns
  formatting, so enabling the `@stylistic` rule set would only duplicate work
  Prettier already does.
- `eslint-config-prettier` is applied **last** in `eslint.config.mjs` as a
  guard — if a formatting-related rule is ever added, it stays disabled so it
  can't fight Prettier. ESLint keeps the correctness and Vue/Nuxt rules.
- `prettier` as a devDependency is the single formatter. `.prettierrc.json`
  pins the house style (`singleQuote`, no semicolons — matches the existing
  code); `.prettierignore` skips generated output and the lockfile.
- Scripts: `lint` (`eslint .`), `lint:fix` (`eslint . --fix`), `format`
  (`prettier --write .`), `format:check` (`prettier --check .`).
- pnpm gate: `unrs-resolver` (native resolver used by the ESLint import plugin)
  is allow-listed in `pnpm-workspace.yaml` so its build script may run under
  pnpm's blocked-by-default policy.

### Nuxt

- `nuxt.config.ts`: `compatibilityDate: '2025-07-15'`, `devtools.enabled: false`.
- Scaffold: `app/app.vue` with `NuxtLayout` + `NuxtPage`.

### Environment variables

- `.env.example` (repository root) — template listing every env var the app
  expects, committed with no secret values. Copy it to `.env` for local work:
  ```bash
  cp .env.example .env
  ```
- `.env` and `.env.*` are gitignored; `.env.example` is the one exception.

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
