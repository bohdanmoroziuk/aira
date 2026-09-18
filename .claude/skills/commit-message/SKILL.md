---
name: commit-message
description: Analyzes the current git diff in this repo and drafts the most fitting Conventional Commit message — type, optional scope, and summary — without ever inventing changes that aren't in the diff and without staging or committing anything. Use this whenever the user asks what to commit changes as, wants a commit message suggestion, says something like "draft a commit message", "write me a commit for this", "зафіксуй", or asks to prepare/summarize a commit — including implicitly after finishing a change, per this project's standing preference of always drafting a message without committing. Never runs `git add` or `git commit` — it only proposes text for the user to use themselves.
---

# Commit Message

Draft a Conventional Commit message for the current changes in this repo, based strictly on what the diff actually shows, without ever staging or committing anything.

## Why this exists

This project's working agreement (see `AGENTS.md`) is that Claude never commits on the user's behalf. At the same time, a good commit message requires reading the actual diff, not just eyeballing filenames or guessing from memory of what was recently discussed — so this is worth doing carefully rather than assuming.

## What it does

- **Analyzes the diff.** Reads the actual added/removed lines, not just file paths, to understand the real nature of the change.
- **Forms a Conventional Commit.** Output is `type(scope): summary`, following the [Conventional Commits](https://www.conventionalcommits.org/) format — lowercase type, imperative summary, no trailing period.
- **Accounts for scope.** When the change is clearly confined to one identifiable area (a layer, a feature folder, a specific concern), include a scope in parentheses; omit the scope when the change is repo-wide, mixed, or too small to name usefully. Never force a scope that doesn't add information.
- **Never invents changes that aren't in the diff.** The message describes only what the diff shows — no assumed motivation, no referencing work that isn't part of this change, no padding with unrelated context.
- **Commits nothing.** Read-only with respect to git: only `git diff`, `git status`, `git log` are used. Never `git add`, never `git commit`.
- **Only produces the message.** The deliverable is the single most fitting commit message, not a menu of alternatives, unless the diff is genuinely ambiguous between two very different framings.

## Steps

1. **Find what changed, preferring staged over unstaged:**
   - Run `git diff --cached --stat` and `git diff --cached` to check for staged changes.
   - If nothing is staged, fall back to unstaged changes: `git status --porcelain` (to catch untracked files too) and `git diff` for modified tracked files.
   - If there are both staged and unstaged changes, draft the message for the **staged** set (that's what `git commit` would actually record), but mention in your reply that unstaged changes exist and aren't covered.
   - If there is nothing staged or unstaged, say so plainly and stop — do not invent a message.

2. **Read the actual diff content**, not just file paths. Skim the added/removed lines to understand the real nature of the change (new feature, bug fix, refactor, styling, config, docs, etc.) and, if a scope is warranted, which area it belongs to.

3. **Pick the Conventional Commits type** that best fits the dominant change: `feat`, `fix`, `refactor`, `chore`, `style`, `docs`, `test`, or another standard type if it clearly fits better. Check `git log --oneline -15` for this repo's own recent usage and stay consistent with it. If the diff mixes unrelated concerns, pick the type for the primary change and note — only if genuinely mixed — that it might be worth splitting into separate commits.

4. **Decide on scope.** A scope names the area the change is confined to (e.g. a Nuxt layer, a feature directory, `server`/`app` side). Add it in parentheses right after the type — `feat(chat): ...` — only when it's unambiguous and adds real information. Leave it out when the change spans multiple areas or a scope would just restate the type.

5. **Write the summary to describe what/why at a meaningful level** — not a mechanical restatement of the diff (avoid things like "update AppSidebar.vue"). Base it strictly on what's actually in the diff; do not attribute motivation or context that isn't visible there. If the change is small, a single summary line is enough. If it touches several distinct things within the same type/scope, add a short bulleted body underneath, still in plain style (no emoji, no AI-attribution boilerplate in the body itself — attribution trailers are handled separately by the calling context, not by this skill).

6. **Present the drafted message to the user in a fenced code block**, ready to copy into `git commit -m "..."` or an editor. Do not wrap it in any other commentary that would need to be stripped before use.

7. **Never run `git add`, `git commit`, or any other state-changing git command.** This skill is read-only with respect to git — it only inspects and reports.
