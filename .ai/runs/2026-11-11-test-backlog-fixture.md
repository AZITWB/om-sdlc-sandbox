# Execution plan: README contributing pointer (test backlog fixture)

Source doc: .ai/specs/2026-11-11-test-backlog-fixture.md
Issue: #8
Engine: om-auto-create-pr (steps: 2, --loop: no)

## Goal

A new contributor reaches `SDLC.md` § Routes from the repository root in one click, and can pick the right route from a plain-language intent.

## Scope

- Add `README.md` at the repository root: a one-line overview, a Contributing section that links `SDLC.md#routes` and `SDLC.md#categories`, and a "Where to start" table with one row per category in `SDLC.md` § Categories, each linking its § Routes entry.

**Non-goals** (from the spec): rewriting `SDLC.md`; changing any route; adding CI. The spec file itself is not committed on this branch (see Risks).

## Implementation Plan

### Phase 1: README pointer

1. Create `README.md` with the overview and Contributing section. *Check:* both links resolve (the `## Routes` and `## Categories` headings exist in `SDLC.md`, so GitHub generates the `#routes` and `#categories` anchors).

### Phase 2: Where-to-start table

1. Add the table. *Check:* every category in § Categories has exactly one row.

## Risks

- The source spec is not on `main` and has no spec PR: it exists only as an uncommitted file in the invoking checkout. It was copied into this worktree for reference and is not committed here, so the `Source doc:` path does not resolve on this branch until the spec lands separately.
- Open PR #16 (another run, for #14) also adds a root `README.md`. Whichever merges second will conflict and needs a manual merge of the two README files.
- `SDLC.md` § Routes rows have no individual anchors, so each table row links `SDLC.md#routes` and names the matching row.
- Docs-only change: the validation gate is the config JSON check plus a manual re-read of the diff. There is no markdown lint configured.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: README pointer

- [x] 1.1 Create README.md with the overview and Contributing section — a810240

### Phase 2: Where-to-start table

- [ ] 2.1 Add the Where-to-start table
