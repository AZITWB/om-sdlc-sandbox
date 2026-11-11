# Capability: issue-categories

Lets contributors file and triage an issue under any of the team's categories, including `idea` and `chore`. Readiness is checked against the Definition of Ready.

## Requirement: Intake and triage recognize idea and chore
The system SHALL let `om-prepare-issue` and `om-auto-manage-issues` infer the categories `idea` and `chore`, in addition to the native categories. It SHALL still apply exactly one category label when none is present.

### Scenario: Incomplete need filed
- WHEN `om-prepare-issue --no-spec` files "we probably need some way to track X, not sure how"
- THEN the issue is created with the `idea` category label

### Scenario: Maintenance issue triaged
- WHEN `om-auto-manage-issues` processes an issue "tidy .gitignore and the agent-browser descriptor" with no category label
- THEN it applies `chore`, with the reason in its label-rationale comment

### Scenario: Package bump is not a chore
- WHEN `om-prepare-issue --no-spec` files "bump agent-browser to the latest version"
- THEN the issue is created with `dependencies`, not `chore`

## Requirement: Readiness is checked against the Definition of Ready
The system SHALL turn on the native readiness behaviors once `SDLC.md` has `## Definition of Ready`:
- `om-auto-manage-issues` records `READY_STATUS` as `ready` or `not-ready`, and posts the not-ready comment;
- the feature route of `om-auto-fix-issue` stops with `NOT_READY` on a ticket that fails the ticket-level tier;
- `om-backlog` checks its source against the ticket-level tier.

### Scenario: Idea triaged
- WHEN `om-auto-manage-issues` processes an `idea` issue that has a problem and who has it, but no expected outcome
- THEN `READY_STATUS = not-ready`, and the not-ready comment names the missing outcome and its check

### Scenario: Maintainer waiver
- WHEN a maintainer comments "ready as is" on a not-ready issue
- THEN triage records `READY_STATUS = ready`

### Scenario: Backlog source checked
- WHEN `om-backlog <spec> --dry-run` runs on a spec whose out-of-scope items have no owner
- THEN it stops with a readiness list naming that item

Source: .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md
