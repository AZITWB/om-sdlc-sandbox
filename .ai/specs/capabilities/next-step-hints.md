# Capability: next-step-hints

The next-step commands that OM prints point contributors at the route for each issue's category, so a hint never sends a feature, a backlog item, or non-bug work to `om-auto-fix-issue`.

## Requirement: Suggested next commands follow the route table
The system SHALL make `om-prepare-issue`, `om-auto-manage-issues`, `om-backlog`, and `om-brainstorm` suggest the step from `SDLC.md` § Routes for the kind of issue at hand, per their repo-local extensions.

The suggestions SHALL obey two rules:
- Every `Next:` line is either `none` or a command that can be run as written.
- The skills never run the suggestion themselves.

### Scenario: Feature filed
- WHEN `om-prepare-issue --no-spec` files a `feature`
- THEN the body suggests triage and the feature route, and the report ends `Next: om-auto-manage-issues <n>`

### Scenario: Bug prepared
- WHEN `om-auto-manage-issues <n>` posts implementation-prep notes on a `bug`
- THEN they end `Next: om-auto-fix-issue <n>`

### Scenario: Backlog filed
- WHEN a real `om-backlog <spec>` run files a tree
- THEN each story and task body has a `## ▶️ Start` section with its filled-in brief, epics have none, and the report ends `Next: none`

### Scenario: Backlog dry-run unchanged
- WHEN `om-backlog <spec> --dry-run` runs
- THEN it ends `Next: om-backlog <spec>`

Source: .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md
