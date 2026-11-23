# Capability: workflow-customization

The Maintainer changes the repository's workflow through config and repo-local extensions that stay consistent across the affected skills, and audits those extensions against the installed skills.

## Requirement: Workflow changes are planned before they are written
The system SHALL show the affected skills, `Base:` headings, actions, config diff, and `SDLC.md` diff for a requested workflow change, and write nothing until a human confirms.

### Scenario: Multi-skill change
- WHEN `om-customize-workflow <change>` runs for a rule that applies at intake and triage
- THEN the plan lists both `om-prepare-issue` and `om-auto-manage-issues`, and no file changes before confirmation

### Scenario: Config covers it
- WHEN the change is a value an existing config key holds
- THEN the plan proposes only a config edit, and no extension

## Requirement: Changes that weaken a native check or contradict an active decision are refused
The system SHALL refuse a change that relaxes a native check (QA gate, risk-high evidence, review verdict rule, claim protocol, untrusted-content boundary), and SHALL refuse a change that contradicts an active D-entry unless the plan proposes a superseding decision.

### Scenario: Weakening refused
- WHEN the change is "skip QA on small UI changes"
- THEN the skill refuses and names `qaGate` as the only control

### Scenario: Decision conflict
- WHEN the change adds a UI design gate
- THEN the skill cites D4 and proposes a superseding entry for the Maintainer instead of writing an extension

## Requirement: Extensions are audited against their installed base
The system SHALL report, for each `.ai/skills/*/SKILL.md`, one or more of `ok`, `stale-anchor`, `no-anchors`, `bad-anchor`, `fork`, `orphan`, `frontmatter`, `unbannered`, `unsafe`, `conflict`, with the fix, and SHALL change nothing.

### Scenario: Current repository
- WHEN `--audit` runs on `main` today
- THEN all four extensions report `no-anchors`, `om-auto-manage-issues` also reports `fork`, and none reports `unbannered`

### Scenario: Upstream rename
- WHEN an installed skill renames a heading that an extension's `Base:` line names
- THEN that extension reports `stale-anchor` with the missing heading

### Scenario: No config
- WHEN `--audit` runs in a repository without `.ai/agentic.config.json`
- THEN it warns and still audits

Source: `.ai/specs/2026-11-23-om-customize-workflow.md`
