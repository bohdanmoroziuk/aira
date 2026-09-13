# Working Agreements

## General

* Keep changes focused on the requested task.
* Inspect the existing code and conventions before making changes.
* Prefer simple solutions over unnecessary abstractions.
* Reuse existing patterns and utilities before introducing new ones.
* Preserve existing behavior unless the task explicitly requires changing it.
* Avoid unrelated refactoring, formatting, or cleanup.
* Consider established design patterns and current best practices when analysing or implementing a solution.
* Apply patterns only when they solve a concrete problem and fit the existing architecture.

## Task Scope

* Follow the user's requested scope and completion criteria.
* When asked only to analyse, plan, explain, or review, do not modify files.
* Ask before making a broader architectural change than the task requires.
* Do not overwrite or revert changes made by the user unless explicitly requested.
* Do not implement optional improvements or unrelated fixes without explicit approval.

## Findings and Recommendations

When relevant issues are discovered outside the requested scope, report them without changing the code.

Separate findings into:

### Suggested Fixes

List concrete defects, inconsistencies, risks, or maintainability problems that may require correction.

For each item, briefly include:

* the affected area;
* the problem;
* its practical impact;
* the recommended correction.

### Suggested Improvements

List optional enhancements related to architecture, design patterns, readability, performance, testing, developer experience, or established best practices.

For each item, briefly include:

* the affected area;
* the proposed improvement;
* why it may be useful;
* any important tradeoff.

These lists are advisory only.

* Do not implement listed fixes or improvements without explicit approval.
* Do not include them in the current diff unless they are required to complete the requested task.
* Do not treat a different personal preference as a defect.
* Avoid speculative recommendations that provide no clear practical benefit.
* Prioritize findings by impact rather than listing every possible refinement.

## Dependencies

* Respect the package manager already established by the repository.
* For a new JavaScript or TypeScript project without an established package manager, prefer pnpm.
* Ask before adding new production dependencies.
* Do not update or remove dependencies unless the task requires it.

## Verification

* Run the smallest relevant verification commands available for the change.
* Review the final diff for unrelated or accidental changes.
* Report which checks were run and whether they passed.
* Clearly state when a check could not be run or when an issue remains unresolved.

## Version Control

* Do not create commits, amend commits, push changes, or change branches unless explicitly requested.
* Do not run destructive Git commands such as `reset --hard`, `clean`, or forced checkout without explicit approval.
* Keep existing uncommitted work intact.

## Security

* Do not expose, copy, or modify secrets and credentials unless the task explicitly requires it.
* Do not broaden filesystem, network, or execution permissions without a clear need.

## Communication

* Keep explanations concise, concrete, and focused on the current task.
* Surface important assumptions, risks, and blockers.
* At completion, briefly summarize:

  * the changes made;
  * the verification results;
  * suggested fixes, when applicable;
  * suggested improvements, when applicable.
