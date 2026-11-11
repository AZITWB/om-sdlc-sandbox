# Backward compatibility

This repository has no application API. Its protected contract surfaces are the ones the OM skills and the team read. Breaking one silently breaks automation or a person's workflow.

| Surface | Consumers | Breaking change | Required path |
|---|---|---|---|
| `.ai/agentic.config.json` (keys and value shapes) | Every OM skill's config loader | Removing or renaming a key, changing a value's type, or an invalid enum | Re-run `om-setup-agent-pipeline`. Update `SDLC.md` in the same PR. Note it in the PR body. |
| Label taxonomy (names in config and on GitHub) | Tracker label guards, triage, merge, QA skills, humans filtering issues | Renaming or deleting a label, or moving a label between groups (e.g. additive to exclusive) | Add new labels alongside the old ones. Migrate the open issues and PRs. Remove the old label only in a later PR, after a maintainer's sign-off. |
| `.ai/trackers/github.md` operations | All tracker-driven skills | Changing an operation's name, arguments, or output shape, or bypassing a label guard | Extend rather than rewrite. Diff against the shipped descriptor in the PR. |
| `.ai/browsers/agent-browser.md` operations | QA and integration-test skills | Changing an operation's name or contract | Same as the tracker descriptor. |
| `SDLC.md` sections that skills read (e.g. a future Definition of Ready, the label state machine, the QA gate) | `om-auto-manage-issues`, `om-prepare-issue`, `om-auto-fix-issue`, review/merge skills | Removing or renaming a section heading that skills parse, or weakening a gate | Keep the heading stable. A gate change needs maintainer approval and a matching config change. |
| Issue-route contract (categories, readiness per category, human decision points) once adopted from the Issue-First brief | Contributors, triage skills, repo-local extensions | Removing a category, removing a human decision point, or letting readiness start work | Supersede the route explicitly in `SDLC.md`, with a maintainer's approval recorded in the PR. |
| Paths (`.ai/runs`, `.ai/specs`, `.ai/qa`, …) | Skills that write and read run artifacts | Moving a path without updating the config | Change `paths.*` in the config and move the content in the same PR. |

Implementation skills warn when a change violates this file. Review skills treat an unmanaged break as a blocker.
