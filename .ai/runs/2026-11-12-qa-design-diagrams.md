# Execution plan: QA and design diagrams

Issue: #27 (small documentation task, no spec). The PR closes #27.
Engine: om-auto-create-pr (steps: 2, --loop: no)

## Goal

Add two diagrams to `SDLC-routes.md`: the PR path with tests and QA, and design for user-facing changes. Each node comes from `SDLC.md` or an installed skill.

## Scope

- **In:**
  - `SDLC-routes.md`: the shared legend (adding a merge-blocking gate style) and diagrams 2 and 3;
  - diagram 1 stays unchanged;
  - the file name stays the same, so no `SDLC.md` link change is needed (the open question in #27).
- **Non-goals:**
  - changing any route, gate, or QA rule;
  - `om-mockup-prototype`;
  - automatic generation.

## Implementation Plan

### Phase 1: diagrams

1. Add the tests/QA diagram and the legend update.
2. Add the design diagram.

## Risks

- Diagram drift from `SDLC.md`. Each diagram cites its source sections.

## Progress

PR: #28

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: diagrams

- [x] 1.1 Tests and QA diagram — 2208aa6
- [x] 1.2 Design diagram — 2208aa6
