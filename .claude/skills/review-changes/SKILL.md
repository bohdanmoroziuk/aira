---
name: review-changes
description: Reviews new and modified files in this repo against the project's own conventions — whether changes are staged, whether names (files, functions, variables, types) actually match what they do on both client (app/) and server (server/) sides, whether roles/responsibilities are cleanly split across client and server layers, and whether server-side code specifically follows the ports & adapters layout used under src/layers/*/server. Produces a prioritized list of fixes and improvements without modifying any files. Use this when the user asks to review changes, check the diff, "перевір зміни", "перевір стейдж", "перевір архітектуру", "рев'ю коду", asks whether files are staged, whether naming makes sense, whether responsibilities are well split, or whether the backend follows ports & adapters. Read-only: never runs `git add`, never edits code, never commits.
---

# Review Changes

Audit the current working-tree changes against this repo's own conventions (`AGENTS.md`, `CONVENTIONS.md`, and the ports & adapters layout already established under `src/layers/*/server`). Report findings; do not fix them unless the user explicitly asks afterward — this matches `AGENTS.md`'s "when asked only to analyse, plan, explain, or review, do not modify files."

## Why this exists

The repo already has architectural conventions (Nuxt layers, `app/`·`server/`·`shared/` split, ports/repositories/services/use-cases on the backend) and naming conventions (`CONVENTIONS.md`'s chat vocabulary, `*.port.ts`/`*.repository.ts`/`*.use-case.ts`/`*.service.ts` suffixes). Diffs drift from these silently — a route handler picks up business logic, a repository gets called directly from an API route instead of through a use-case, a variable gets named `message` when it holds a raw string. This skill catches that drift before it's committed.

## Steps

### 1. Identify the changed files and their staging state

- Run `git status --porcelain` to list every new/modified/deleted file (staged and unstaged both show up here, with different status codes — see `git help status` for the `XY` meaning, e.g. a first column letter means staged, second means unstaged).
- Run `git diff --cached --stat` and `git diff --stat` separately to see exactly which of those files are staged vs. not.
- Report this as a simple split: **staged**, **modified but unstaged**, **untracked**. Do not run `git add` — only report the state.
- If a file that is clearly part of the same logical change is missing from staging (e.g. a `.ts` file staged but its updated test isn't), flag it as a finding rather than staging it yourself.

### 2. Read the actual diffs

For every changed file (prefer `git diff --cached` if there's staged content, otherwise `git diff` plus `cat` for untracked files), read enough of the surrounding file — not just the diff hunk — to judge names and responsibilities in context. A diff line alone rarely tells you whether a name fits its purpose.

### 3. Check naming — client and server both

For every new or renamed identifier in the diff (file names, exported functions/types, variables, composables, route/handler names) on **both** the `app/` (client) and `server/` sides:

- Does the name describe what the thing actually does/holds, not what it used to do or a generic placeholder (`data`, `temp`, `handler2`, `newChat`)?
- Does it follow this repo's established suffix conventions where applicable:
  - Server: `*.port.ts` (interface), `*.repository.ts` (persistence adapter), `*.service.ts` (external-integration adapter), `*.use-case.ts` (application logic), `*.container.ts` (composition root), `*.types.ts` (shared types).
  - Client: `use*.ts` composables (`app/composables/`), `*.gateway.ts` client-side API adapters (`app/gateways/`), `*.guard.ts` route/data guards (`app/guards/`), `*.utils.ts` pure helpers (`app/utils/`), PascalCase `.vue` components.
- Does it follow `CONVENTIONS.md`'s chat vocabulary — `message` only for a `ChatMessage` object, `content` only for the message body string, `text` for a raw string outside a `ChatMessage`, never `message` for a plain string? (Applies wherever chat data flows, client or server.)
- Is a file's location consistent with its name and the Nuxt layer split (`app/` vs `server/` vs `shared/`; cross-boundary types only in `shared/types/`, top-level, per `CONVENTIONS.md`)?

### 4. Check role/responsibility distribution — client and server both

For each changed unit, judge whether it does exactly one job and whether that job matches its layer, on **both** sides:

**Server (`server/`):**
- **API route handlers** (`server/api/**`) should stay thin: parse/validate the request, call a use-case (or a container-exported function), shape the response/error. They should not contain business logic, direct persistence calls, or direct calls to an external SDK.
- **Use-cases** (`server/use-cases/*.use-case.ts`) hold application logic and depend only on **port types**, never on a concrete repository/service implementation or on framework globals (`#imports`, `h3`, etc.).
- **Repositories** (`server/repositories/*.repository.ts`) and **services** (`server/services/*.service.ts`) are adapters: persistence or external-integration logic only, no orchestration that belongs in a use-case.
- **Composition roots** (`*.container.ts`) only wire adapters to use-cases/ports — no logic of their own.

**Client (`app/`):**
- **Components** (`app/components/**`, `.vue`) should stay presentational: markup, local UI state, delegate data-fetching and business logic to composables. They should not call gateways or the server API directly.
- **Composables** (`app/composables/use*.ts`) hold reactive/client-side state and orchestration, calling gateways for I/O rather than issuing raw `fetch`/`$fetch` calls inline.
- **Gateways** (`app/gateways/*.gateway.ts`) are the client-side adapters that wrap calls to the server API — HTTP concerns only, no UI or business logic.
- **Guards** (`app/guards/*.guard.ts`) should check one condition each (existence, ownership, etc.) and not absorb unrelated logic.
- **Pages** (`app/pages/**`) compose components/composables for a route; they should stay thin, not reimplement logic that belongs in a composable.
- **Utils** (`app/utils/*.utils.ts`) should be pure functions with no side effects or framework dependencies.

Flag any case where logic clearly sits in the wrong layer (e.g. an API handler building a model/SDK call directly, a repository containing decision logic, a use-case importing a concrete adapter class instead of its port type, a component calling a gateway directly instead of going through a composable, a composable doing raw HTTP calls instead of using a gateway).

### 5. Check ports & adapters — server side only

This check applies **only to `server/` code**. There is no ports & adapters layer on the client (`app/`) side in this repo — client-side responsibility is covered by step 4 above (components/composables/gateways/guards/pages/utils), not by ports & adapters.

This repo already has the pattern in `src/layers/chat/server/` (`ports/chat.repository.port.ts` defines the contract, `repositories/in-memory-chat.repository.ts` implements it, `use-cases/get-chats.use-case.ts` depends on the port type, `chat.container.ts` wires them, `api/chats/index.get.ts` calls the use-case). For any changed or new server-side code that talks to a database, external API, or SDK, check:

- Is there a `*.port.ts` type describing the capability, or does the code reach an external system directly from a use-case or API handler?
- Does the concrete adapter (repository/service) implement that port type (`: SomePort =` or equivalent), so it's swappable?
- Is the adapter instantiated only in a `*.container.ts` (or equivalent composition root), not inline inside a use-case or API handler?
- Do use-cases and API handlers depend on the port's type, not the adapter's concrete type?

If a change adds an external integration without going through this pattern, flag it as a fix — but confirm severity: for a small route that's genuinely a one-off (no port anywhere else needs it yet), note it as a suggested improvement rather than a hard defect, per `AGENTS.md`'s "apply patterns only when they solve a concrete problem."

### 6. Report findings as a prioritized list

Follow `AGENTS.md`'s Findings and Recommendations split:

- **Suggested Fixes** — concrete defects: unstaged files that belong with the change, names that actively mislead, logic in the wrong layer, an external integration bypassing ports & adapters where the pattern is already established elsewhere in the same layer. For each: affected area, the problem, its practical impact, the recommended correction.
- **Suggested Improvements** — optional, lower-stakes items: a name that's fine but could be clearer, a responsibility split that would help only if the code grows, a ports & adapters extraction that isn't yet justified by a second implementation. For each: affected area, the proposed improvement, why it may help, the tradeoff.

Order each list by impact, most important first. Do not pad the list with restated personal-preference nitpicks the project doesn't actually require.

### 7. Do not modify anything

This skill only reads and reports. Do not run `git add`, do not edit source files, do not create commits. If the user wants any finding fixed, wait for them to say so explicitly, then treat it as a separate, scoped follow-up.
