# Remove the non-native phased direct route (D20)

Status: Draft
Source issue: #19
Supersedes: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` — sections: Route table (rules "Direct route means one PR" and "Phased direct route (D20)")

## 📝 TLDR

People choosing a delivery route after a spec is accepted currently see three choices in `SDLC.md` § Routes: backlog, direct, and phased direct (D20).

Phased direct is not native OM. It was added for a single case: the Issue-First change was the SDLC process itself, so its verification needed Phase 1 merged first.

**Proposed (future behavior):** § Routes, § Milestones, and the route diagram offer only the two native choices, backlog or direct. D20 is recorded as superseded, a one-off bootstrap. For code, the native flow already tests inside the PR and in the QA stage, so a separate verification phase is not needed.

## 📝 Problem Statement

`SDLC.md` § Routes lists phased direct as a third delivery choice. Its milestone appears in § Milestones, and the branch appears in the diagram in `SDLC-routes.md`. All of it is `[PRODUCT]`; see `SDLC.md` lines 67, 77–78, and 166, and `SDLC-routes.md` lines 41 and 52.

Native OM knows only two choices: `om-backlog`, and `om-auto-implement-spec` (one PR, with `om-auto-create-pr-loop` for long plans). That makes the third route friction:
- `om-backlog` does not know a spec went phased direct, or which phases merged. A backlog run would propose work already done. Source: Phase 2 fixture F6, `.ai/analysis/scenarios/2026-11-11-issue-first-verification.md`, follow-up 1, `[DOCUMENT]`.
- It contradicts D12 (minimal intervention).
- The case that needed it, verifying a process change only after it is live, does not arise for code. Code changes test inside the PR (validation gate, `om-integration-tests`) and in the QA stage (`om-auto-qa-pr`, QA gate). Source: `SDLC.md` § Ticket lifecycle and § The QA gate, `[PRODUCT]`.

**Who has it:**
- contributors choosing a delivery route after acceptance;
- maintainers keeping `SDLC.md` aligned with native OM.

Sources: #19 `[DOCUMENT]`, and the files above `[PRODUCT]`.

**Out of scope** (owner: Maintainer):
- rewriting the accepted Issue-First spec, which keeps a one-line `Superseded by` annotation only;
- changing the backlog or direct routes;
- changing vendored skills or the skill extensions.

## 📝 Proposed Solution

1. **`SDLC.md` § Routes, feature row:** the delivery choice becomes "backlog or direct".
2. **`SDLC.md` § Routes, rules:**
   - remove the "Phased direct route" rule;
   - reword "Direct route means one PR" to its first sentence only, "`om-auto-implement-spec` ships the whole spec on one PR.", with no guidance on dependent parts (Q1). No note that a route was retired (Q2).
3. **`SDLC.md` § Milestones:** remove the "Phased direct" bullet.
4. **`SDLC-routes.md`:** remove the `phaseRun` node and its edge. The delivery question offers backlog or direct.
5. **Brief D20:** prefix the D20 decision text with "**Superseded by `.ai/specs/2026-11-11-remove-phased-direct-route.md`:** a one-off bootstrap of the Issue-First spec, not a standing route." Keep the original text and drop its "(extends D10)". D10 loses its "(extended by D20)" note.
6. **Prior spec:** insert this line directly below its H1 and touch nothing else (`references/prior-specs.md` §4): `` > ⚠️ Superseded by `.ai/specs/2026-11-11-remove-phased-direct-route.md` (2026-11-11) — sections: Route table. Current state: see the new spec. `` This step runs on this spec PR, per `om-spec-writing` step 9.

No Delta: this is a docs-only change to the process contract, with no skill behavior or capability requirement changing (`delta-format.md`: omit it for docs-only changes). Neither capability spec mentions phased direct.

### Alternatives considered

- **Keep D20, and teach `om-backlog` about it** (the original #19). Rejected: it would grow a non-native route instead of removing it, against D12.
- **Keep D20 and add a retirement note in `SDLC.md`.** Rejected by the human (Q2). History belongs in the brief and in this spec.

### Research

Native OM already covers ordered delivery. `om-backlog` encodes order with `Depends on:`, and `om-auto-create-pr-loop` keeps long plans on one PR with per-step commits and checkpoints. Mainstream flows, such as GitHub Flow and trunk-based development, use the same two units: one PR per change, or a tracked set of issues. None of them adds a third unit.

## 📝 Edge Cases & Failure Scenarios

| Case | What happens | Mitigation |
|---|---|---|
| A spec whose parts must merge in order | No route names this case after removal (Q1). | The native backlog with `Depends on:` covers it. The human picks it after acceptance. |
| Readers of the merged Issue-First history | Phased direct appears in PR 6 and PR 18, in the run plans, and in the prior spec's Phasing and bootstrap step 3. | Expected: these record how that spec shipped, and they stay unchanged. The brief marks D20 superseded and points here. |
| The diagram drifts from § Routes | The two disagree. | Steps 1 and 2 ship in one PR, checked by the same grep. |

## 📝 Risks & Impact Review

- **Protected surface.** This changes the issue-route contract in `BACKWARD_COMPATIBILITY.md`. That row calls a change breaking when it removes a category, removes a human decision point, or lets readiness start work, and none of those happens here:
  - every category keeps its route;
  - the delivery choice after acceptance stays a human decision, now between backlog and direct;
  - readiness is untouched.

  The removal is therefore not a breaking change under that row, so no supersession note in `SDLC.md` is required (Q2). The maintainer's approval is still recorded in the PR.
- **No consumer breaks.** No skill or extension refers to the phased direct route. A grep over `.ai/skills/` and `.claude/skills/` for "phased" matches only the generic phrase "phased implementation", in three vendored skills. No issue or PR in flight uses it.
- **Reversible** by reverting the PR.

## 📋 Phasing

1. **Phase 1: remove the route.** One PR, documentation, small.

## 📋 Implementation Plan

### Phase 1: remove the route

1. **`SDLC.md` § Routes and § Milestones.** Apply items 1–3 of Proposed Solution. *Check:* `grep -i phased SDLC.md` returns nothing, and the feature row offers backlog or direct.
2. **`SDLC-routes.md`.** Apply item 4. *Check:* `grep -i phased SDLC-routes.md` returns nothing, and a reviewer confirms the diagram renders on GitHub.
3. **Brief.** Apply item 5. *Check:* D20 starts with "Superseded by …" and keeps its text, and D10 has no D20 note. (Item 6, the prior-spec annotation, ships on the spec PR.)
4. **Repo-wide check.** `grep -rni "phased direct" --exclude-dir=runs --exclude-dir=analysis --exclude-dir=.claude --exclude-dir=.agents .` matches only the brief's D20, the prior spec's history sections, and this spec.
5. **PR.** It carries `Closes #19` and the maintainer's approval for the route-contract change.

## 📝 Resolved questions

Answered by a human on 2026-11-11, in interactive mode:

| Q | Answer |
|---|---|
| Q1: guidance for parts that must merge in order | None. The native backlog with `Depends on:` covers it. |
| Q2: trace of phased direct in `SDLC.md` | None. History stays in the brief and in this spec. |
