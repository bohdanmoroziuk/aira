---
name: tests
description: Analyzes the current change, decides what in it is actually worth testing, finds important scenarios that are missing coverage, and generates or updates tests only where they add real value — testing behavior through the public contract, not implementation details, in this project's existing testing style. Runs the relevant tests afterward and fixes the actual test or code behind a failure, never weakens an assertion just to force green. Use this when the user asks to add tests, write tests, check test coverage, "напиши тести", "додай тести", "прогони тести", or asks whether a change is tested. If no testing framework/style exists in the repo yet, stops and asks the user which one to set up before writing anything, instead of picking one unasked.
---

# Tests

Test the current change: decide what's worth testing, fill in genuinely missing coverage, and verify it actually passes for the right reason.

## Why this exists

Test suites rot in two opposite directions: too few tests (real bugs ship untested) or too many low-value tests (a trivial getter gets a test, a real edge case doesn't, and the suite becomes noise nobody trusts). The other common failure mode is a red test "fixed" by loosening its assertion instead of fixing the actual defect — that doesn't fix anything, it just hides it. This skill exists to avoid all three: test what matters, skip what doesn't, and never fake green.

## What it does

- **Analyzes the change** — reads the actual diff, not just file names, to understand what behavior was added or modified.
- **Decides what's actually worth testing** — not everything needs a test.
- **Finds missing important scenarios** — checks what's already covered against what the change's behavior actually requires, and adds only the gap.
- **Generates/updates tests only where they add value** — no test-for-test's-sake.
- **Tests behavior, not implementation details** — asserts on the public contract (return value, emitted state, thrown error), not on private internals or call counts that don't affect behavior.
- **Follows this project's existing testing style** — framework, file location/naming, assertion idioms, fixture/fake patterns already in use.
- **Runs the relevant tests after writing them, and fixes the real cause of a failure** — the test if the test is wrong, the code if the code is wrong. Never weakens an assertion just to make a red test pass.

## Steps

### 1. Scope the change being tested

- Run `git status --porcelain`, `git diff --cached --stat`, and `git diff --stat` to see what changed (staged, unstaged, untracked).
- Read the actual diffs (`git diff --cached` / `git diff`, plus the full surrounding file for context) to understand the real behavior that was added or changed — not just which files were touched.
- If the user pointed at a specific file/feature instead of "the current change," scope to that instead.

### 2. Check for an existing testing setup and style before writing anything

- Look for a test runner config (e.g. `vitest.config.*`, a `test`/`test:*` script in `package.json`) and existing test files (`*.test.ts`, `*.spec.ts`, `__tests__/`, etc.).
- **If a testing setup already exists:** read a few existing tests near the changed code (same layer/feature if possible) to learn the actual conventions in use — framework, file naming and location (co-located vs. a `__tests__` folder), `describe`/`it` phrasing, assertion style, how fakes/mocks are done. Match that style exactly; do not introduce a second, competing style.
- **If no testing setup exists yet in this repo:** stop before writing or installing anything and ask the user which framework/tooling they want (for a Nuxt project, `vitest` + `@nuxt/test-utils` is the common default, but this is a real tooling decision — new devDependencies and project-wide config, not just "add a test"). This matches `AGENTS.md`'s "ask before adding new production dependencies" and "ask before making a broader architectural change than the task requires" — picking a test framework is exactly that kind of decision, so don't make it unilaterally.

### 3. Decide what's actually worth testing

Prioritize testing:
- Business/application logic — use-cases, guards, gateways/composables with real branching or state logic, pure utils with non-trivial behavior.
- Anything with edge cases that would silently misbehave: boundary conditions, empty/null input, error paths, async ordering.
- Bug fixes — a fixed bug without a regression test isn't actually fixed.

Skip or deprioritize:
- Pure presentational markup with no logic.
- Trivial one-line pass-throughs or re-exports.
- Framework-generated boilerplate, types-only changes, config-only changes.
- Anything the framework itself already guarantees (don't test that Vue reactivity works).

If nothing in the change clears this bar, say so plainly instead of inventing a test to have one.

### 4. Find missing important scenarios

For each unit that does clear the bar in step 3, enumerate the scenarios that actually matter — happy path, boundary/empty/invalid input, error/rejection paths, and any concrete failure scenario a correctness review would flag (see the `code-review` skill's bug/edge-case criteria for the same bar). Check against tests that already exist for that unit and only add what's genuinely missing — don't duplicate existing coverage, and don't pad the suite with scenarios that can't actually occur given the code's own guards/types.

### 5. Write or update tests — behavior, not implementation

- Assert through the unit's public contract: a use-case's return value/thrown error given a port (e.g. this repo's ports & adapters pattern already gives swappable fakes like `in-memory-chat.repository.ts` — instantiate the use-case with a fake adapter and assert on outcomes, don't spy on internal calls), a guard's pass/fail result, a composable's exposed reactive state/methods, a component's rendered output or emitted events.
- Do not assert on private/unexported internals, call counts to helper functions that don't affect the outward result, or implementation choices that could change without changing behavior (e.g. don't assert *that* a particular internal helper was called — assert what the caller actually gets back).
- Keep each test focused on one behavior; prefer several small, clearly named tests over one test asserting many unrelated things.

### 6. Run the relevant tests and fix the real cause of any failure

- Run the narrowest test command that covers what you touched first (a single file or the affected area), matching `AGENTS.md`'s "run the smallest relevant verification commands available." Run the broader suite if the change could plausibly affect other areas.
- On a failure, diagnose before touching anything:
  - If the **code** has the bug, fix the code — scoped to this change, not unrelated pre-existing issues (report those separately instead, per this project's Findings and Recommendations convention).
  - If the **test** is wrong (bad setup, wrong expected value, testing the wrong thing), fix the test.
- **Never fix a failing test by loosening, removing, or skipping its assertion just to turn it green.** That is not a fix. The only time an assertion's expected value legitimately changes is when the intended behavior itself genuinely changed as part of this task — and in that case, say so explicitly when reporting, so the user can see that the bar moved rather than assume it was silently lowered.
- Iterate until tests pass because the behavior is actually correct, not because the check got weaker.

### 7. Report what happened

Summarize: what was tested and why, what scenarios were added, what was deliberately left untested and why, and the test run result (command run, pass/fail). If something outside this change's scope turned up as broken while testing, report it as a finding rather than fixing it silently, per `AGENTS.md`'s Findings and Recommendations convention.

### 8. Stay within version-control boundaries

Editing test files and, when a test reveals a real bug in the code under test, the minimal fix for that bug are both in scope for this skill. Do not run `git add`, do not create commits, and do not touch files unrelated to the change being tested — those remain governed by `AGENTS.md`'s normal rules.
