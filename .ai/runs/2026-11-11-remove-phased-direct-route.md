# Execution plan: remove the phased direct route

Source doc: .ai/specs/2026-11-11-remove-phased-direct-route.md (accepted)
Issue: #19 (direct route; this PR closes it)
Engine: om-auto-create-pr (steps: 4, --loop: no)

## Goal

Remove the non-native phased direct route (D20) from `SDLC.md` and `SDLC-routes.md`, and mark D20 superseded in the brief. This follows the accepted spec.

## Scope

- **In:**
  - Implementation Plan steps 1–4 of the spec;
  - the PR, with `Closes #19`.
- **Non-goals:**
  - the backlog and direct routes;
  - vendored skills;
  - the prior spec (its annotation already shipped);
  - any note in `SDLC.md` that a route was retired (Q2).

## Implementation Plan

### Phase 1: remove the route

1. `SDLC.md` § Routes and § Milestones.
2. `SDLC-routes.md` diagram.
3. Brief D20 and D10.
4. Repo-wide grep check.

## Risks

- Protected surface (issue-route contract). Per the spec, this is not a breaking change. The maintainer's approval is recorded on the PR.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: remove the route

- [x] 1.1 SDLC.md Routes and Milestones — 3dc68f2
- [ ] 1.2 SDLC-routes.md diagram
- [ ] 1.3 Brief D20 and D10
- [ ] 1.4 Repo-wide grep check
