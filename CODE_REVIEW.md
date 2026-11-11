# Code review rules

`om-code-review` (and therefore `om-auto-review-pr`) applies this file in addition to its built-in checklist. This repository holds process documents and pipeline configuration, not application code, so the review focuses on process correctness and safety.

## Review priorities

1. **Safety and authority.** A change must not widen what automation may do without a human decision. Examples: making readiness trigger work, letting automation apply `qa-approved` outside the self-QA exception, changing merge authority, or relaxing a vendored skill's safety rule through a repo-local extension.
2. **Consistency.** `SDLC.md`, `.ai/agentic.config.json`, and `.ai/trackers/github.md` must agree. A label, route, or gate named in one must exist in the others. A config change without the matching `SDLC.md` update, or the reverse, is a blocker.
3. **Contracts.** Changes to a surface listed in `BACKWARD_COMPATIBILITY.md` follow that file's required path.
4. **Clarity for contributors.** For any issue category, a reader can tell the route, the readiness information, and who decides the next step.

## Repo-specific checks

- `.ai/agentic.config.json` parses as JSON and contains no secrets, tokens, or personal identities.
- Label names added to the config also appear in the `SDLC.md` label table, and setup can create them. Existing labels are never renamed or deleted.
- Vendored skills under `.claude/skills/` and `.agents/skills/` are not edited. Customization lives in `.ai/skills/<name>/SKILL.md`.
- `skills-lock.json` is not modified, except in a PR whose ticket is explicitly about skill installation.
- Every route described in process docs names its human decision points and the skill (or human) that drives each step. A route that only skills can complete is a blocker.
- Design acceptance, backlog publication, readiness, and implementation start stay separate decisions. A document that merges any two of them is a blocker.

## Severity

- **Blocker:** safety or authority regression, config/doc inconsistency, protected-surface break without its required path, secrets in the repo.
- **Major:** an ambiguous route or readiness rule, or a missing human decision point.
- **Minor:** wording, formatting, or links. Deferred to a follow-up issue when the PR is otherwise ready.
