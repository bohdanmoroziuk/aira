---
name: code-review
description: Reviews new and modified files in this repo for bugs, edge cases, and unnecessary complexity, checks them against this project's development approach (AGENTS.md, CONVENTIONS.md, naming, responsibility distribution across client/server, and the ports & adapters layout under layers/*/server), and produces a prioritized list of real fixes and improvements — never proposing a refactor just for its own sake, and never treating a stylistic preference as a defect. Use this when the user asks to review changes, check the diff, "перевір зміни", "рев'ю коду", "code review", asks whether the code has bugs or edge cases, whether it's too complex, whether naming/responsibilities are well split, or whether the backend follows ports & adapters. Read-only: never runs `git add`, never edits code, never commits.
---

# Code Review

Review the current working-tree changes for correctness and fit with this project's own development approach. Report findings; do not fix them unless the user explicitly asks afterward — this matches `AGENTS.md`'s "when asked only to analyse, plan, explain, or review, do not modify files."

## Why this exists

A review that only checks style produces noise; a review that only checks style compliance misses actual bugs. This skill does both, in order: real correctness problems and edge cases first, then fit with the architecture and conventions this repo has already committed to (`AGENTS.md`, `CONVENTIONS.md`, ports & adapters under `layers/*/server`). It deliberately does not turn into a refactor engine — `AGENTS.md` already says to keep changes focused and avoid unrelated refactoring, and a reviewer that ignores that just creates work nobody asked for.

## What it does

- Looks for **bugs and edge cases** — not just "does it run," but what breaks it (empty/null/undefined input, off-by-one, unhandled promise rejections, race conditions, wrong error handling, type mismatches masked by `any`).
- Looks for **unnecessary complexity** — abstractions, indirection, or generalization the current code doesn't need.
- Checks compliance with **this project's development approach** — the conventions already established in `AGENTS.md`, `CONVENTIONS.md`, and the existing architecture (naming, responsibility split, ports & adapters).
- **Never proposes a refactor just for the sake of refactoring.** A pattern is only a finding if it solves a concrete problem in the diff, per `AGENTS.md`'s "apply patterns only when they solve a concrete problem and fit the existing architecture."
- **Separates real problems from stylistic preferences.** A different but equally valid way of writing something is not a defect — `AGENTS.md`: "do not treat a different personal preference as a defect."
- Produces a **prioritized list of fixes and improvements**, most impactful first.

## Steps

### 1. Scope the review

- Run `git status --porcelain`, `git diff --cached --stat`, and `git diff --stat` to see what's staged, unstaged, and untracked.
- Prefer reviewing staged changes if present; otherwise review unstaged/untracked changes. If both exist, review both but say which is which.
- This is informational only — never run `git add`.

### 2. Read the actual diffs and their surrounding context

For every changed file (`git diff --cached` / `git diff`, plus reading untracked files directly), read enough of the surrounding file — not just the diff hunk — to reason about behavior, not just the lines that changed.

### 3. Look for bugs and edge cases

For each changed function/handler/component, ask what input or timing would break it:

- Missing or wrong handling of empty, null, undefined, or unexpected-shape input.
- Off-by-one errors, incorrect boundary conditions, wrong comparison operators.
- Unhandled promise rejections, missing `await`, races between async operations.
- Error paths that swallow, mislabel, or leak errors (e.g. exposing internals to a client, or catching an error and continuing as if nothing happened).
- Type-level lies: `any`/`as` casts that hide a real mismatch, a type that doesn't actually constrain what the code assumes.
- State bugs: mutating something callers still hold a reference to, stale closures in Vue composables/reactivity, reactive state read outside its expected lifecycle.

Only report these as findings when you can state the concrete failure scenario (input/state → wrong output/crash). A vague "this could theoretically be an issue" is not a finding.

### 4. Look for unnecessary complexity

- Abstraction or indirection with only one call site and no second implementation in sight (a factory/strategy/interface that exists for a case that isn't there).
- Config, flags, or parameters that are never varied.
- Logic duplicated where an existing utility/composable/use-case in this repo already does the same thing (`AGENTS.md`: "reuse existing patterns and utilities before introducing new ones").
- Code doing more than the task at hand required (`AGENTS.md`: "don't add features, refactor, or introduce abstractions beyond what the task requires").

### 5. Check compliance with this project's development approach

This covers naming, responsibility distribution, and (server-side) ports & adapters — the concrete shape of "does this fit how the repo is already built."

**Naming — client (`app/`) and server (`server/`) both:**
- Does the name describe what the thing actually does/holds, not a generic placeholder (`data`, `temp`, `handler2`, `newChat`)?
- Suffix conventions: server — `*.port.ts`, `*.repository.ts`, `*.service.ts`, `*.use-case.ts`, `*.container.ts`, `*.types.ts`; client — `use*.ts` composables, `*.gateway.ts`, `*.guard.ts`, `*.utils.ts`, PascalCase `.vue` components.
- `CONVENTIONS.md`'s chat vocabulary: `message` only for a `ChatMessage` object, `content` only for the message body string, `text` for a raw string outside a `ChatMessage`.
- File location consistent with the Nuxt layer split (`app/` vs `server/` vs `shared/`; cross-boundary types only in `shared/types/`, per `CONVENTIONS.md`).

**Responsibility distribution — client and server both:**
- Server: API handlers (`server/api/**`) stay thin (parse, call a use-case, shape the response) — no business logic, no direct persistence/SDK calls. Use-cases (`server/use-cases/`) depend only on port types. Repositories/services (`server/repositories/`, `server/services/`) are adapters only. Composition roots (`*.container.ts`) only wire, no logic.
- Client: components (`app/components/**`) stay presentational, delegate to composables. Composables (`app/composables/use*.ts`) hold client state/orchestration, call gateways for I/O. Gateways (`app/gateways/*.gateway.ts`) wrap the server API, HTTP concerns only. Guards (`app/guards/*.guard.ts`) check one condition each. Pages (`app/pages/**`) compose, stay thin. Utils (`app/utils/*.utils.ts`) are pure.

**Ports & adapters — server side only** (no equivalent layer exists on the client; client responsibility is covered above): For server-side code that talks to a database, external API, or SDK, check whether there's a `*.port.ts` type describing the capability, whether the concrete adapter implements it, and whether it's wired only in a `*.container.ts` rather than instantiated inline in a use-case or API handler. Established pattern: `layers/chat/server/ports/chat.repository.port.ts` → `repositories/in-memory-chat.repository.ts` → `use-cases/get-chats.use-case.ts` → `chat.container.ts` → `api/chats/index.get.ts`.

### 6. Separate real problems from stylistic preferences

Before listing something, check: is this actually inconsistent with the diff's own logic, this repo's stated conventions, or a real risk of a bug — or is it just a different valid way to write the same thing? If it's the latter, drop it. Do not list an equally-correct alternative formatting, structuring, or naming choice as a problem just because it isn't how you'd have written it.

### 7. Don't recommend refactoring for its own sake

A finding earns a place in the list only if it fixes something concretely wrong (a bug, a real inconsistency with this repo's approach, complexity with no justification in the current diff) — not because a "cleaner" pattern exists in the abstract. If a suggestion only pays off assuming future requirements that aren't part of this change, treat it as a low-priority improvement at most, not a fix, and say why it isn't more urgent.

### 8. Report findings as a prioritized list

Follow `AGENTS.md`'s Findings and Recommendations split:

- **Suggested Fixes** — concrete defects: real bugs/edge cases, architecture violations, names that actively mislead. For each: affected area, the problem, its practical impact, the recommended correction.
- **Suggested Improvements** — optional, lower-stakes items: complexity that could be reduced, a responsibility split that would help only if the code grows, a ports & adapters extraction not yet justified by a second implementation. For each: affected area, the proposed improvement, why it may help, the tradeoff.

Order each list by impact, most important first. Keep it to what's actually worth the reader's attention — do not pad it.

### 9. Do not modify anything

This skill only reads and reports. Do not run `git add`, do not edit source files, do not create commits. If the user wants a finding fixed, wait for them to say so explicitly and treat it as a separate, scoped follow-up.
