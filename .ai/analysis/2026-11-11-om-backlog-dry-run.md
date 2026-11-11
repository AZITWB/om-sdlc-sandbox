# om-backlog dry-run against a draft Definition of Ready

Date: 2026-11-11
Purpose: settle review 2, Decision 1. Does `om-backlog` stop on a spec source once `SDLC.md` has a Definition of Ready?
Setup:
- The native DoR section from `om-setup-agent-pipeline/references/sdlc-template.md` was inserted, word for word, into the working copy of `SDLC.md`.
- Command: `om-backlog .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md --dry-run`. There was no tracker access and nothing was written.
- Afterwards `SDLC.md` was restored with `git checkout`.
Limit: the run was executed by the spec's author agent, which had seen review 2. A fresh-context run may judge the borderline items differently.

## Result: readiness stop (not met), but only on items the spec can supply

The stop is not caused by missing discovery. The gaps are about content, and the spec can close them itself.

| Ticket-level item (`om-backlog/SKILL.md:28`) | Verdict | Basis |
|---|---|---|
| Problem rests on tiers 1–5 | Met | The Problem Statement bullets cite repository files. This is `[PRODUCT]`, tier 4, and it is relevant because the problem is about the tooling itself. |
| Who has it rests on tiers 1–5 | Borderline | "Contributors" and "the team" are named only by the brief, a team-authored `[DOCUMENT]`, tier 3. The spec states no concrete observation. A strict reader may treat this as a guess about users. |
| Expected outcome and its check | Met | TLDR, Phasing exit gates, and per-step *Check:* lines. |
| Out of scope, with an owner | **Not met** | Out-of-scope items exist (Proposed Solution item 4, the brief's Scope Out), but no owner is named. |
| No blocking question unanswered | Met (in the spec) | Resolved questions table. The four review-2 decisions live outside the spec, so the run did not see them. |
| Autonomous assumptions confirmed | n/a | Interactive spec. |
| Decisions relied on are `active` | Met, with a note | D1–D12 are recorded in the brief with no status column. A strict reader may ask for an explicit status. |

`om-backlog` does not read the spec's `Status:` line, so it would also backlog a `Draft` spec. Under D10 this is acceptable, because backlog is a human decision made after acceptance.

Next: none (the gap is not something `om-discover --refresh` answers).

## Consequence for the spec

The backlog path stays feasible under D12, with no waiver or extension. Two spec-writing obligations go into § Routes (spec route) and § Definition of Ready:

1. The Problem Statement names who has the problem, with its source tier. Example: "OM team contributors and maintainers. Source: brief (`[DOCUMENT]`), repository files (`[PRODUCT]`)." Add one concrete observation where one exists, such as an issue or PR.
2. Out-of-scope items name an owner role, for example the Maintainer.

Optionally, decisions the spec relies on carry an explicit `active` status.

Remove the waiver claim from Edge Cases. Phase 2 keeps a fresh-context dry-run with the expected outcome "readiness met".
