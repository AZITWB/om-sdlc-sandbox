# Execution plan: route flow diagram

Issue: #21 (small documentation task, no spec). The PR closes #21.
Engine: om-auto-create-pr (steps: 2, --loop: no)

## Goal

Add a Mermaid flow diagram that illustrates `SDLC.md` § Routes, and link it from `SDLC.md`.

## Scope

- **In:**
  - `SDLC-routes.md` at the repository root, next to `SDLC.md`. The diagram covers:
    - intake and triage (the category confirmation and the size choice);
    - every category route from the § Routes table, plus backlog items and trivial changes;
    - every **[H]** decision, marked.
  - A one-line link in `SDLC.md` § Routes.
- **Non-goals:**
  - changing any route or table text;
  - generating the diagram automatically.

## Implementation Plan

### Phase 1: diagram

1. Write `SDLC-routes.md` with the Mermaid diagram and a legend.
2. Link it from `SDLC.md` § Routes.

## Risks

- `SDLC.md` is a protected surface. Only a link is added, and no heading or route changes.
- Diagram drift: § Routes stays the source of truth, and the file says so.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: diagram

- [x] 1.1 Write the route diagram — 0b4a425
- [ ] 1.2 Link it from SDLC.md
