# Execution plan: Issue-First SDLC, Phase 1

Source doc: .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md (accepted). Only Phase 1 is in scope.
Issue: #1 (Refs only; this PR never closes it)
Engine: om-auto-create-pr (steps: 10, --loop: no)

## Goal

Land the process contract of the accepted Issue-First SDLC spec. This covers:
- the `SDLC.md` categories, routes, readiness, acceptance, milestones, and trivial changes;
- the four repo-local skill extensions (A, B);
- the autofix config value (C);
- the `CODE_REVIEW.md` checks;
- the `AGENTS.md` pointer;
- the Delta archive.

It also records D20, the phased direct route, which this spec now uses instead of the backlog.

## Scope

- **In:**
  - D20 in the brief and the spec (route rule, Phasing, bootstrap);
  - Phase 1 steps 1–9 of the spec, verbatim from its exact text blocks.
- **Non-goals:**
  - Phase 2 (fixtures F1–F10), which ships on its own PR with `Closes #1`;
  - the spec's `Status:` line;
  - vendored skills under `.claude/skills/` and `.agents/skills/`;
  - `skills-lock.json`;
  - new labels;
  - any gate.

## Implementation Plan

### Phase 1: process contract

1. Record D20 in the brief, and update the spec's direct-route rule, Phasing, and bootstrap.
2. `SDLC.md` § Categories and § Routes.
3. `SDLC.md` § Definition of Ready, § Design acceptance, § Milestones.
4. `SDLC.md` § Trivial changes.
5. Reconcile the existing `SDLC.md` text (line 9, the Triage row, the autofix queue).
6. The four extensions under `.ai/skills/`.
7. Config C: `autofix.eligibility.excludeLabels` (D17).
8. The `CODE_REVIEW.md` repo-specific checks.
9. The `AGENTS.md` routes pointer and the non-OM-skills note.
10. Archive the Delta into `.ai/specs/capabilities/`.

## Risks

- **Protected surfaces.** This touches two surfaces in `BACKWARD_COMPATIBILITY.md`: the `SDLC.md` sections that skills read, and the issue-route contract. The PR records them, and the maintainer approves on the PR.
- **No agent-runtime test.** The extensions are prose read by agents, so no test can execute them here. Phase 2 verifies them on live issues.
- **`jq` is not installed.** The config is read with node. The validation gate is unaffected.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: process contract

- [x] 1.1 Record D20 and switch the bootstrap — 34b4ab5
- [x] 1.2 SDLC.md Categories and Routes — 6772343
- [x] 1.3 SDLC.md Definition of Ready, Design acceptance, Milestones — d6734c4
- [x] 1.4 SDLC.md Trivial changes — d7683df
- [ ] 1.5 Reconcile existing SDLC.md text
- [ ] 1.6 Skill extensions
- [ ] 1.7 Autofix config exclusions
- [ ] 1.8 CODE_REVIEW.md checks
- [ ] 1.9 AGENTS.md pointer
- [ ] 1.10 Archive the Delta
