---
name: draft-commit-message
description: Analyzes staged or unstaged git changes in this repo and drafts a ready-to-use commit message matching the project's existing conventional-commits log style. Use this whenever the user asks what to commit changes as, wants a commit message suggestion, says something like "draft a commit message", "write me a commit for this", "зафіксуй", or asks to prepare/summarize a commit — including implicitly after finishing a change, per this project's standing preference of always drafting a message without committing. Never runs `git add` or `git commit` — it only proposes text for the user to use themselves.
---

# Draft Commit Message

Produce a commit message for the current changes in this repo, without ever staging or committing anything.

## Why this exists

This project's working agreement (see `AGENTS.md`) is that Claude never commits on the user's behalf. At the same time, drafting a good commit message requires reading the actual diff, not just eyeballing filenames — so this is worth doing carefully rather than guessing from memory of what was recently edited.

## Steps

1. **Find what changed, preferring staged over unstaged:**
   - Run `git diff --cached --stat` and `git diff --cached` to check for staged changes.
   - If nothing is staged, fall back to unstaged changes: `git status --porcelain` (to catch untracked files too) and `git diff` for modified tracked files.
   - If there are both staged and unstaged changes, draft the message for the **staged** set (that's what `git commit` would actually record), but mention in your reply that unstaged changes exist and aren't covered.
   - If there is nothing staged or unstaged, say so plainly and stop — do not invent a message.

2. **Read the actual diff content**, not just file paths. File names alone (e.g. "AppSidebar.vue changed") don't tell you *what* changed or *why* — skim the added/removed lines to understand the real nature of the change (new feature, bug fix, refactor, styling, config, docs, etc.).

3. **Match this repo's commit log style.** Run `git log --oneline -15` and follow the same pattern you see there: lowercase `type: short imperative summary`, no scope in parentheses, no trailing period. Common types used in this repo: `feat`, `fix`, `refactor`, `chore`, `style`. Pick the type that best fits the dominant change; if the diff mixes concerns, pick the type for the primary change and consider whether it should be described as one commit or whether to flag that it might be worth splitting (mention this only if genuinely mixed, don't force it).

4. **Write the summary line to describe *why/what* changed at a meaningful level** — not a mechanical restatement of the diff (avoid things like "update AppSidebar.vue"). If the change is small, a single summary line is enough. If it touches several distinct things, add a short bulleted body underneath explaining each, still matching the repo's plain style (no emoji, no AI-attribution boilerplate in the body itself — attribution trailers are handled separately by the calling context, not by this skill).

5. **Present the drafted message to the user in a fenced code block**, ready to copy into `git commit -m "..."` or an editor. Do not wrap it in any other commentary that would need to be stripped before use.

6. **Never run `git add`, `git commit`, or any other state-changing git command.** This skill is read-only with respect to git — it only inspects (`git diff`, `git status`, `git log`) and reports.
