# Execution plan: Issue-First SDLC, Phase 2

Source doc: .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md (accepted). Only Phase 2 is in scope.
Issue: #1. This PR is the last phase of the phased direct route (D20), so it carries `Closes #1`.
Engine: om-auto-create-pr (steps: 4, --loop: no)

## Goal

Record the Phase 2 verification (fixtures F1–F10) of the Issue-First SDLC process contract, so the spec's exit gate is met. That includes fixing the one partly failed fixture, F10, and re-running it.

## Scope

- **In:**
  - Fix F10 (D17 gap): add `dependencies` to `autofix.eligibility.excludeLabels`, and state in `SDLC.md` that the queue takes only triaged `bug` and `security` issues.
  - Re-run F10.
  - Write the verification record at `.ai/analysis/scenarios/2026-11-11-issue-first-verification.md`.
  - Close the `[test]` issues.
- **Non-goals:**
  - other findings, which are recorded in the verification record as follow-ups;
  - the spec's `Status:` line;
  - vendored skills;
  - `skills-lock.json`.

## Implementation Plan

### Phase 2: verification

1. Exclude `dependencies` from the autofix queue (config, `SDLC.md`, brief D17).
2. Re-run F10 against the fixed config.
3. Write the verification record.
4. Close the `[test]` issues and remove the local fixture files.

## Risks

- **Not independent.** Fixtures F1–F5 and F8 ran in the session that wrote the extensions. F6, F7a, and F9 ran as fresh-context agents. The record states this.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 2: verification

- [x] 2.1 Exclude dependencies from the autofix queue — c2630a2
- [ ] 2.2 Re-run F10
- [ ] 2.3 Write the verification record
- [ ] 2.4 Close test issues and remove local fixtures
