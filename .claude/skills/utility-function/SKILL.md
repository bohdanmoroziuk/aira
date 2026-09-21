---
name: utility-function
description: Creates a new shared utility function in this repo — placed in the matching `<topic>.utils.ts` file under `layers/base/shared/utils/`, documented with JSDoc, and covered by a co-located Vitest unit test. Use this when the user asks to add, create, or write a util/utility/helper function, "додай утиліту", "створи хелпер", or when a change needs a small reusable pure function that belongs in the shared base layer. Does not commit anything.
---

# Utility Function

Add one utility function to `layers/base/shared/utils/`, with JSDoc and a unit test.

## Rules

- **Location.** Utilities live in `layers/base/shared/utils/<topic>.utils.ts`. Put the function in the file that matches its topic (e.g. `common.utils.ts` for generic helpers). If no existing file fits, create a new `<topic>.utils.ts` — file name is `kebab-case`, topic is a single word or short phrase, never `misc`/`helpers`.
- **Top level only.** Nuxt auto-imports only top-level files of `shared/utils/`. Never put utils in a subfolder, or they won't be auto-imported.
- **JSDoc is mandatory.** Every exported function has a JSDoc block: one-sentence description, `@param name - ...` for each parameter, `@returns ...`. Add `@throws` if it can throw, `@example` only when usage is not obvious.
- **A test is mandatory.** Every function has a co-located unit test `<topic>.utils.test.ts` next to the utils file. A util without a test is not done.
- **Shared code is environment-neutral.** `shared/` is used by both `app/` and `server/`: no Vue, no Nuxt composables, no `window`/`document`, no Nitro/H3 imports. Prefer pure functions.
- **Reuse first.** Before writing, read the target file and grep `layers/*/shared` and `layers/*/app/utils` for an existing function that already does the job. If one exists, say so instead of adding a duplicate.
- **Types.** Reuse `Optional` / `Nullable` from `../types/common.types`. A type used by more than one util goes in `layers/base/shared/types/`, not inline.

## Steps

### 1. Clarify only what is missing

The function's name, purpose, inputs and output must be clear. If the request leaves the behavior ambiguous (e.g. what happens on empty input), pick the sensible default, state it, and continue — ask only if the ambiguity would change the public contract.

### 2. Read the target file and match its style

Open the chosen `<topic>.utils.ts`. Match what is already there: `const` arrow function vs. `function` declaration, `import type` usage, JSDoc wording, return-type inference vs. explicit annotation. Use a `function` declaration only where the file does so for a reason (e.g. generics that read better that way, like `byProp`). Add the function at the end of the file unless a related function sits elsewhere.

### 3. Write the function with JSDoc

```ts
/**
 * Checks whether an array has at least one element.
 *
 * @param array - Array to check.
 * @returns True if the array has at least one element.
 */
export const isNonEmpty = <T>(array: T[]): boolean => array.length > 0
```

Keep it small, typed, and free of hidden state. No default exports.

### 4. Write the test

Create or extend `layers/base/shared/utils/<topic>.utils.test.ts`. The `unit` Vitest project picks up any `layers/**/*.test.ts` outside `server/api`, so no config change is needed. Nuxt ignores `*.test.ts` when scanning utils.

- Import Vitest helpers explicitly: `import { describe, expect, it } from 'vitest'`. Import the function from `./<topic>.utils` — never through Nuxt auto-imports.
- One `describe('<functionName>', ...)` per function; `it` titles describe behavior in plain words (`'returns false for an empty array'`), not implementation.
- Cover: the happy path, boundaries (empty, zero, `null`/`undefined` where the type allows), and every branch. For type guards, assert both the boolean result and narrowing where it matters.
- Test through the public contract only — return value or thrown error.
- Time or randomness: use `vi.useFakeTimers()` / `vi.spyOn` and restore in `afterEach` (see how `sleep` needs fake timers), never real waits.
- Do not weaken an assertion to get green — if a test fails, fix the function or the test's real mistake.

### 5. Verify

Run the smallest relevant checks and report which passed:

```bash
pnpm vitest run --project unit layers/base/shared/utils
pnpm lint
pnpm typecheck
```

If a check cannot be run, say so.

### 6. Report

Summarize: the function added and where, the test file, the checks run and their results. Per `AGENTS.md`, list any out-of-scope findings (e.g. existing utils without tests) as suggestions — do not add tests for other functions unless asked.

## Never

- Never run `git add` or `git commit`. Draft a commit message with the `commit-message` skill only if asked or per the standing preference.
- Never add a dependency for a utility (lodash, etc.) without asking.
- Never modify existing utils' behavior while adding a new one.
