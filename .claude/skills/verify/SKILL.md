---
name: verify
description: Runs this repo's full verification suite — `pnpm test`, `pnpm typecheck`, `pnpm lint` — and reports which passed and which failed, with the actual error output for any failure. Use this when the user asks to verify, check, or validate the current changes, run the checks, run tests/typecheck/lint, or asks "does this pass" / "прогони перевірки" / "запусти тести, типи і лінт". Does not fix failures on its own unless the user asks — it reports them, per `AGENTS.md`'s "report which checks were run and whether they passed" and "clearly state when a check could not be run or when an issue remains unresolved."
---

# Verify

Run this repo's three standard checks — `pnpm test`, `pnpm typecheck`, `pnpm lint` — and report the result of each.

## Why this exists

`AGENTS.md`'s Verification section calls for running "the smallest relevant verification commands available" and reporting which checks ran and whether they passed. This repo's checks are fixed commands (`package.json`'s `test`, `typecheck`, `lint` scripts), so this skill exists to run them consistently and report results the same way every time, instead of re-deriving the command set each session.

## What it does

- Runs `pnpm test`, `pnpm typecheck`, and `pnpm lint`, in that order.
- Reports pass/fail for each command individually — not just an overall pass/fail.
- On failure, includes the actual error output (failing test name, type error location, lint rule/file), not just "it failed."
- Does not modify any files or attempt to fix failures unless the user explicitly asks afterward — this skill is a verification run, not a fix-it loop.

## Steps

1. **Run `pnpm test`.** Capture pass/fail and, on failure, the failing test names and assertion output.
2. **Run `pnpm typecheck`.** Capture pass/fail and, on failure, the file/line and type error messages.
3. **Run `pnpm lint`.** Capture pass/fail and, on failure, the file/line and rule violations.
4. **Report all three results together**, even if an earlier one failed — don't stop after the first failure, since the others are independent and still worth knowing.
5. **Do not attempt fixes.** If something failed, state clearly what failed and where; only fix it if the user explicitly asks, per `AGENTS.md`'s "do not implement listed fixes or improvements without explicit approval."
