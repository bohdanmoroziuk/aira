---
name: verify
description: Runs this repo's verification suite — by default `pnpm test:unit`, `pnpm typecheck`, `pnpm lint`, and with the `full` argument also `pnpm test:e2e` — and reports which passed and which failed, with the actual error output for any failure. Use this when the user asks to verify, check, or validate the current changes, run the checks, run tests/typecheck/lint, or asks "does this pass" / "прогони перевірки" / "запусти тести, типи і лінт". Pass `full` (`/verify full`) to include the slow e2e tests. Does not fix failures on its own unless the user asks — it reports them, per `AGENTS.md`'s "report which checks were run and whether they passed" and "clearly state when a check could not be run or when an issue remains unresolved."
---

# Verify

Run this repo's standard checks and report the result of each:

- **Default:** `pnpm test:unit`, `pnpm typecheck`, `pnpm lint`.
- **`full` argument:** the same three, plus `pnpm test:e2e`.

## Why this exists

`AGENTS.md`'s Verification section calls for running "the smallest relevant verification commands available" and reporting which checks ran and whether they passed. This repo's checks are fixed commands (`package.json`'s `test:unit`, `test:e2e`, `typecheck`, `lint` scripts), so this skill exists to run them consistently and report results the same way every time, instead of re-deriving the command set each session.

The e2e tests build the whole app and take several minutes, so they are opt-in via `full`; the default run stays fast.

## What it does

- Runs `pnpm test:unit`, `pnpm typecheck`, and `pnpm lint`, in that order. With the `full` argument, also runs `pnpm test:e2e` after `pnpm test:unit`.
- Reports pass/fail for each command individually — not just an overall pass/fail.
- On failure, includes the actual error output (failing test name, type error location, lint rule/file), not just "it failed."
- States plainly when e2e tests were not run (default mode), so a green default run isn't mistaken for full coverage.
- Does not modify any files or attempt to fix failures unless the user explicitly asks afterward — this skill is a verification run, not a fix-it loop.

## Arguments

- *(none)* — default run, unit tests only.
- `full` — also run the e2e tests.

## Steps

1. **Run `pnpm test:unit`.** Capture pass/fail and, on failure, the failing test names and assertion output.
2. **If the `full` argument was given, run `pnpm test:e2e`.** It takes several minutes, so set the Bash tool timeout to its maximum (600000 ms). Capture pass/fail and, on failure, the failing suites/tests and error output (a `Hook timed out` error is a `setup()` timeout, not an assertion failure — report it as such).
3. **Run `pnpm typecheck`.** Capture pass/fail and, on failure, the file/line and type error messages.
4. **Run `pnpm lint`.** Capture pass/fail and, on failure, the file/line and rule violations.
5. **Report all results together**, even if an earlier one failed — don't stop after the first failure, since the others are independent and still worth knowing. In default mode, note that e2e tests were skipped and that `/verify full` runs them.
6. **Do not attempt fixes.** If something failed, state clearly what failed and where; only fix it if the user explicitly asks, per `AGENTS.md`'s "do not implement listed fixes or improvements without explicit approval."
