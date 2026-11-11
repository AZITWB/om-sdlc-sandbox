# Execution plan: README Contributing links to the routes (E01-S01, #14)

## Goal

A contributor at the repository root reaches `SDLC.md` § Routes and § Categories in one click from the README's Contributing section.

## Scope

- Add a root `README.md` (none exists on `main`) with a short project description and a Contributing section that links `SDLC.md#routes` and `SDLC.md#categories`.
- Verify both anchors match existing headings in `SDLC.md` (`## Routes`, `## Categories`, each unique), so GitHub's generated anchors resolve.

Implements backlog item #14 only. No `Source doc:` is set (operator instruction).

## Non-goals

- Rewriting `SDLC.md`, changing any route or category, adding CI (out of scope per #14).
- Other backlog items under epic #12, or the rest of the parent design.
- Any change under `.claude/skills/`, `.agents/skills/`, or `skills-lock.json`.

## Implementation Plan

### Phase 1: README Contributing links

- 1.1 Add `README.md` with a Contributing section linking `SDLC.md#routes` and `SDLC.md#categories`.
- 1.2 Verify both anchors resolve against the `SDLC.md` headings and run the validation gate.

## Risks

- GitHub anchor generation: `## Routes` → `#routes`, `## Categories` → `#categories`. A duplicate heading of the same text would shift the anchor to `-1`; checked that each heading is unique.
- Docs-only change: the configured gate (config JSON parse) does not lint Markdown, so the anchor check is done by script and by re-reading the diff.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: README Contributing links

- [ ] 1.1 Add README.md with Contributing section linking the routes and categories
- [ ] 1.2 Verify anchors and run the validation gate
