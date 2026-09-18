---
name: route-meta-docs
description: Adds or updates `defineRouteMeta({ openAPI: ... })` on this repo's Nitro server routes (under `src/layers/*/server/api/**`, or `server/routes/**` if that pattern is ever used) so the Scalar/OpenAPI reference at `/scalar` shows real summaries, parameters, request bodies, and responses instead of bare method+path — derived strictly from what each handler (and its validator, if any) actually does. Use this when the user asks to document routes, add route/OpenAPI metadata, fill in `defineRouteMeta`, describe endpoints for Scalar/Swagger, or asks something like "додай route meta", "задокументуй ендпоінти", "заповни openAPI для роутів". Edits only `defineRouteMeta` calls (and the import it needs) inside route handler files — never touches handler logic, use-cases, or the API contract. If metadata can't be determined confidently from the code, it reports the mismatch instead of guessing.
---

# Route Meta Docs

Add or refresh `defineRouteMeta({ openAPI: ... })` on this repo's server routes so the OpenAPI reference they already have (Nitro's `/_openapi.json`, rendered by Scalar at `/scalar` — see `SETUP.md`'s "API documentation" entry) actually describes what each endpoint does, instead of just the bare method and path Nitro infers from the filename.

## Why this exists

Scalar/OpenAPI support was wired up for this project's server routes without per-route metadata — `SETUP.md` explicitly notes "Individual routes currently have no `defineRouteMeta` annotations... left for a follow-up change." This skill is that follow-up, done repeatably and safely: metadata must reflect what the handler *actually* does, not what a route's name suggests it probably does, and it must never spill into changing the handler itself.

## What it does

- **Finds server routes** under this repo's actual layout — `src/layers/*/server/api/**` (e.g. `src/layers/chat/server/api/ai.ts`, `src/layers/chat/server/api/chats/index.get.ts`) — and `src/layers/*/server/routes/**` if that pattern is ever introduced.
- **Infers HTTP method and path from the filename**, using Nitro's own convention (`index.get.ts` → `GET /chats`, `[id].delete.ts` → `DELETE /chats/{id}`, etc.) — but does not trust the filename alone when it's ambiguous (see below).
- **Reads the handler fully** (and, transitively, the use-case/service it calls) to determine real behavior: what it reads from params/query/body, what it returns on success, and every error path it can produce.
- **Adds or updates** a single `defineRouteMeta({ openAPI: ... })` call per route file — updates in place if one already exists, never adds a second.
- **Fills in `summary`, `description`, `tags`, `parameters`, `requestBody` (only if the handler reads a body), and `responses`** — strictly from what the code supports.
- **Cross-checks against a validator** (Zod or otherwise) when the route has one, so the documented shape matches the enforced shape exactly.
- **Never edits the handler, use-case, or API contract** — the only code change permitted is the `defineRouteMeta` call itself and the import it needs.
- **Reports instead of guessing** whenever the code doesn't make something unambiguous (e.g. a method-less filename, an untyped `readBody` destructure, an error path with no explicit status code).

## Steps

### 1. Discover routes

- List route files under every `src/layers/*/server/api/**` (and `src/layers/*/server/routes/**`, if present). As of this repo's current state that's `src/layers/chat/server/api/ai.ts`, `src/layers/chat/server/api/chats/index.get.ts`, and `src/layers/chat/server/api/chats/index.post.ts` — re-scan rather than assuming this list is still current.
- For each file, infer the HTTP method and path from the filename using Nitro's convention. If the user pointed at specific routes instead of "all routes," scope to those.

### 2. Resolve method/path ambiguity honestly

- A file with no method suffix (e.g. `ai.ts`, matching any method Nitro dispatches to it) is **not** safely assumed to be `GET` just because that's what Nitro's own OpenAPI auto-detection falls back to. Read the handler: if it only makes sense for one method (e.g. it calls `readBody` and has no meaningful no-body behavior), document that method and say so; if it genuinely handles multiple methods differently, document each; if it's truly ambiguous from the code alone, stop and report the ambiguity rather than picking one.

### 3. Read the handler (and what it calls) end to end

For each route, before writing anything:
- What does it read? — `getRouterParams`/`event.context.params` (path params), `getQuery` (query params), `readBody`/`readValidatedBody` (request body). Note the actual keys destructured/used, not a guessed full shape.
- What does it call? — trace into any use-case/service (this repo's ports & adapters layers, e.g. `chat.container.ts` → `use-cases/*.use-case.ts`) far enough to know the real shape of what's returned and which of its failures surface back to the HTTP layer.
- What does it return on success? — the actual object/array shape, from the `return` statement(s), not the route's name.
- What errors can it produce? — every `createError({ statusCode, ... })` (or thrown/caught error mapped to one) in the handler, with the real status code and message pattern used (e.g. `ai.ts`'s catch-all 500 with a `FIXME` about the message it leaks — document the status code that's actually thrown, don't editorialize on the `FIXME` since fixing it is out of scope here).

### 4. Cross-check against a validator, if one exists

- If the route validates its input (Zod or another library — none of this repo's routes do yet, but check each one), read the schema directly and mirror its types, optionality, enums, and constraints in `parameters`/`requestBody` exactly. Do not hand-write a shape that merely looks plausible next to a schema you didn't fully read.
- If there's no validator (the current state for every route in this repo), document the shape based strictly on how the handler actually destructures/uses the body — and don't imply a guarantee (required/optional, type) that nothing in the code actually enforces.

### 5. Find or add `defineRouteMeta`

- Search the route file for an existing `defineRouteMeta({ openAPI: ... })` call first. If found, **edit its `openAPI` object in place** — never add a second `defineRouteMeta` call to the same file (Nitro only honors one, and a duplicate is dead/conflicting code).
- If none exists, add one as a top-level statement in the file, sibling to `export default defineEventHandler(...)` (not nested inside it) — matching how `defineRouteMeta`/`definePageMeta`-style Nitro/Nuxt macros are used elsewhere.
- This repo disables blanket auto-import (`imports.autoImport: false` in `nuxt.config.ts`) and imports Nitro/Nuxt composables explicitly even where they'd otherwise auto-import — see `createError`/`useRuntimeConfig` in `ai.ts`. Follow the same convention: `import { defineRouteMeta } from '#imports'`, added to the file's existing import statement(s) rather than a new standalone one where it can be combined.

### 6. Fill in each field — only what the code actually supports

- **`summary`** — one short line, what the endpoint does in plain terms (e.g. "Create a new chat", not "Chats endpoint").
- **`description`** — only add one when it says something `summary` doesn't (a constraint, a side effect, an error condition worth calling out); skip it when it would just restate the summary.
- **`tags`** — check every other route already documented in this repo first and reuse its tag(s) for the same feature area (e.g. routes under `src/layers/chat/server/api/**` share a tag). If this is the very first route being documented, pick one plain, factual tag per feature layer (not a marketing label) and use it consistently on every subsequent route in that layer — that choice becomes the convention for later runs of this skill.
- **`parameters`** — one entry per path/query parameter the handler actually reads (name, `in: 'path' | 'query'`, required, type). Do not add a parameter the handler never reads, and do not mark something optional/required opposite to how the code actually treats it (e.g. a path param is always required; a query param is optional unless the handler throws/defaults when it's missing).
- **`requestBody`** — only for routes that call `readBody`/`readValidatedBody`. Shape it from the validator if one exists, otherwise from the actual destructured keys and their inferred TS types. Do not add a `requestBody` to a route that never reads one.
- **`responses`** — one entry per status code the handler can actually produce: the success code with the real returned shape, and each distinct error code from step 3/4 with a short, factual description of when it occurs (e.g. "500 — the AI provider call failed", not a generic "Internal Server Error" boilerplate if the code's own message pattern says more). Match this repo's existing tone in code comments and `SETUP.md`/`README.md` — plain and specific, not marketing copy.
- Reuse this repo's existing response-description conventions once some routes are documented — don't invent a new phrasing style per route.

### 7. Report instead of inventing when something is unclear

If, after reading the handler and any validator, a field still can't be determined with confidence — an ambiguous method, an untyped body with no validator and no clear usage pattern, an error path whose status code isn't explicit in the code — do not fill it in with a plausible-sounding guess. Stop and tell the user exactly what's ambiguous and where (file:line), and leave that specific field out or mark it clearly as unconfirmed, rather than documenting something the code doesn't actually guarantee.

### 8. Stay inside the documentation boundary

- The only permitted edits are: the `defineRouteMeta({ openAPI: ... })` call/object, and the import needed to bring `defineRouteMeta` into scope.
- Do not change `defineEventHandler`'s logic, use-case/service code, validator schemas, response shapes, or anything else about the route's actual behavior — if something looks like a bug or an inconsistency while you're reading the handler, report it (per `AGENTS.md`'s Findings and Recommendations convention) instead of fixing it here.

### 9. Verify consistency after writing

For every route touched, re-read the final `defineRouteMeta` block against the handler one more time and confirm each field still matches: method/path ↔ filename+handler behavior, `parameters`/`requestBody` ↔ what's actually read (and the validator, if any), `responses` ↔ what's actually returned/thrown. Then run `pnpm typecheck` (the metadata is TypeScript-checked like any other code) and, if a dev server is reasonably available, check `/_openapi.json` or the Scalar UI at `/scalar` to confirm the new metadata actually renders as expected — this closes the loop between implementation, validation, and documentation rather than trusting the write alone.

### 10. Report what happened

Summarize which routes got new metadata, which got updated metadata, and list — clearly separated — any routes or fields flagged in step 7 as too ambiguous to document confidently, so the user can resolve them.
