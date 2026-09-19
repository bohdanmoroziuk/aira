# Aira — Conventions

Working agreements for this project. Follow them when changing code,
configuration, tooling, or docs.

## Cross-platform

- The project must run on **all operating systems** (macOS, Linux, Windows).
- Add cross-platform settings by default — pnpm `shell-emulator=true`, LF line
  endings, POSIX-safe `package.json` scripts, Windows-safe path handling.
- Never drop such a setting just because it is a no-op on the current machine.
  If one is deliberately skipped, say so and explain why in the same change.

## Toolchain versions are pinned

- Node: `.nvmrc` + `engines.node` in `package.json`, enforced by `.npmrc`
  `engine-strict=true`.
- Package manager: pnpm, pinned via `packageManager` and `engines.pnpm`.
- TypeScript: stay on the **5.x** line. A bare `pnpm add -D typescript`
  resolves to the 7.x native port, which `vue-tsc` and `nuxt typecheck` do not
  support yet.

## Types & naming

- Cross-boundary types (shared by a layer's `app/` and `server/`) live in that
  layer's `shared/types/*.ts` — top level only, so they are auto-imported and
  reachable via `#shared`. App-only types go in the layer's `app/types/`.
- Chat vocabulary:
  - `message` — a `ChatMessage` object.
  - `content` — the message body string, the `content` field of `ChatMessage`
    (name kept to match the OpenAI / Anthropic payload shape).
  - `text` — a raw message string outside a `ChatMessage` (e.g. the argument to
    `sendMessage`). Never name a plain string `message`.

## Configuration settings

- When adding an editor/tool setting, verify it is **current**, not just valid:
  not deprecated, not redundant with the tool's defaults or with `.gitignore`,
  not premature (no benefit at the project's current size), not a no-op in this
  setup.
- Prefer the smallest set of settings that has a real effect.

## SETUP.md

- Written in **English**.
- Contains only the **Environment** and **Configuration** sections — no
  step-by-step log, no backlog.
- Every project-configuration change is recorded there in the same commit.
- Describe the **purpose** of each config file, not its literal contents. Keep
  entries short.

## README.md

- README is the source of truth for **how to run** the project; SETUP.md is for
  **why** a tool or setting exists.
- When a script is added to `package.json`, document it in README.md in the
  same change: a task-specific section with a fenced `bash` command block.
- Do not add a summary "Scripts" table.
