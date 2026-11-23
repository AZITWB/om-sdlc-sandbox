# om-customize-workflow: planned workflow changes and overlay audit

Status: Accepted
Source issue: #30
Extends: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md`
Prototype implementation: #29 (evidence of intended behavior, not the design authority)

## 📝 TLDR

The maintainer who changes this repository's workflow writes `.ai/skills/<skill>/SKILL.md` extensions by hand, one at a time. Nothing keeps sibling skills and `SDLC.md` in step, and nothing notices when an upstream skill update moves the section an extension changes. **Proposed (future behavior):** a repo-owned skill, `om-customize-workflow`, has two modes:

- **Customize mode** turns one workflow change into a config edit where a key exists, and otherwise into the smallest set of extensions across every affected skill. It updates `SDLC.md` in the same change, stops for confirmation before writing, and refuses anything that weakens a native check.
- **Audit mode** (`--audit`) is read-only. It checks every extension against its installed base skill.

## 📝 Problem Statement

Evidence from this repository:
- The four extensions written for Issue-First (`.ai/skills/om-prepare-issue`, `om-auto-manage-issues`, `om-backlog`, `om-brainstorm`) repeat the same "Next-step hints" shared rules in each file. Two of them also repeat the "Category list" block. Keeping the copies identical is manual.
- The extensions point at upstream text by prose ("extends the **Category** bullet of `references/enrich-existing-issue.md` § 2"). An upstream rename or move of that text breaks the extension silently. `om-apply-upgrade-notes` checks tracker and browser descriptors and the config, but not `.ai/skills/`.
- `om-auto-manage-issues`'s extension is 50 lines against an 84-line base. The upstream overlay contract (`om-create-skill/references/overlay-contract.md`) calls 50% or more a fork.
- The workflow is meant to move from this sandbox to product repositories, so each of these problems repeats per repository.

**Who has it:** the Maintainer (`SDLC.md` § Roles), who owns the config, `SDLC.md`, and the repo-local extensions.

**Out of scope** (owner: Maintainer):
- migrating the four existing extensions to the anchor convention or shrinking the forked one, which is a follow-up issue;
- a team-wide skill repository or upstream contribution. The "upstream slot" lines in reports are advisory text only;
- running the audit in CI or the validation gate (D12: no added gates);
- changing any installed skill, the lockfile, or existing `SDLC.md` rules. Adding the one repo-owned skill under `.agents/skills/` and `.claude/skills/` is in scope, under D21 (Q2, Q5).

## Resolved assumptions (autonomous defaults)

| # | Question | Chosen answer | Rationale |
|---|---|---|---|
| Q1 | Split customize and audit into separate specs or skills? | No. One skill, with `--audit` as a read-only mode. | Same domain and same contract. This mirrors `om-spec-writing`, which both writes and reviews. One skill is less new surface than two. |
| Q2 | Is a repo-owned skill allowed under D12, which limits skill changes to repo-local extensions? | Yes, as a new decision **D21** that extends D12. D21 allows one repo-owned tooling skill. It writes only extensions, config, and `SDLC.md`, and adds no gate. Confirmed by the Maintainer on 2026-11-23 (#31). | D12 says "Later additions … are considered case by case". This spec is that case, but only the Maintainer can extend an active decision. |
| Q3 | Header shape: the upstream banner (`> **Repo-local override.** …`) or this repo's accepted header (`# <skill>: repo-local extension` plus the "Installed skill: …" line, adaptation spec § Extension files: common header)? | Audit accepts both. New extensions written in this repo use the repo's accepted header. | The accepted spec wins locally. Accepting both keeps the skill portable to repositories that follow upstream. |
| Q4 | How does an extension point at the text it changes? | Each delta section starts with `Base: <exact heading line>`, a heading anywhere in the installed skill directory. Prose pointers stay allowed next to it. | One machine-checkable line per section. It is additive, so existing extensions stay valid until migrated. |
| Q5 | Where does the skill live? | `.agents/skills/om-customize-workflow/` plus the `.claude/skills/` copy, as for the vendored skills, but not in `skills-lock.json`. | No lockfile change (AGENTS.md). The skill stays visible to every agent the vendored skills reach. |
| Q6 | Fork threshold? | The upstream 50% rule, unchanged. | Reuses the upstream contract; no local variant. |

## 📝 Proposed Solution

1. **Customize mode** (`/om-customize-workflow <change>`):
   1. **Classify the change.** Refuse a change that weakens a native check. Use a config key when one covers the change. Otherwise write extensions. Hand off to `om-create-skill` when the change has its own goal and trigger.
   2. **Map the change** to every affected skill on the chain, using a fixed stage-to-skill table. A rule goes into the engine skill (`om-code-review`, `om-auto-implement-spec`), not into each caller.
   3. **Show a plan table** (skill, `Base:` heading, action, reason), the config diff, and the `SDLC.md` diff. Write nothing until the human confirms.
   4. **Write** extensions in the repo's header shape, with `Base:` anchors. Update `SDLC.md` in the same change.
   5. **Gate** the result: overlay-contract checks plus the audit. Leave the result uncommitted.
2. **Audit mode** (`/om-customize-workflow --audit`) needs no config and reports one status per extension:
   - `ok`;
   - `stale-anchor`, `no-anchors`, `bad-anchor`;
   - `fork`, `orphan`, `frontmatter`, `unsafe`, `conflict`;
   - `unbannered`: neither accepted header is present.
3. **Active decisions are a protected surface.** Customize mode reads `.ai/specs/briefs/*.md` decision tables. A change that contradicts an active D-entry (for example a UI design gate, dropped by D4) is refused unless the plan includes a superseding decision for the Maintainer to approve.

**Alternatives considered:**
- **Extend `om-create-skill`.** Rejected: it is upstream and authors one skill at a time.
- **Extend `om-apply-upgrade-notes`.** Rejected: it is upstream, and its contract excludes `.ai/skills/`.
- **A separate reviewer skill for the whole SDLC.** Rejected: it overlaps `om-pipeline-retro`, `om-judge-agent-session`, and `om-evolve-harness`, and has no fixed rubric.

**Research:** Renovate presets and ESLint shareable configs solve the same layering problem. Both use an explicit `extends` pointer and fail loudly when the target is missing; `Base:` is that pointer. Both also keep local deltas small and push shared rules upstream. This spec carries that through the "upstream slot" line in every report.

## 📝 Delta

### Capability: workflow-customization

#### ADDED Requirement: Workflow changes are planned before they are written
The system SHALL show the affected skills, `Base:` headings, actions, config diff, and `SDLC.md` diff for a requested workflow change, and write nothing until a human confirms.

##### Scenario: Multi-skill change
- WHEN `om-customize-workflow <change>` runs for a rule that applies at intake and triage
- THEN the plan lists both `om-prepare-issue` and `om-auto-manage-issues`, and no file changes before confirmation

##### Scenario: Config covers it
- WHEN the change is a value an existing config key holds
- THEN the plan proposes only a config edit, and no extension

#### ADDED Requirement: Changes that weaken a native check or contradict an active decision are refused
The system SHALL refuse a change that relaxes a native check (QA gate, risk-high evidence, review verdict rule, claim protocol, untrusted-content boundary), and SHALL refuse a change that contradicts an active D-entry unless the plan proposes a superseding decision.

##### Scenario: Weakening refused
- WHEN the change is "skip QA on small UI changes"
- THEN the skill refuses and names `qaGate` as the only control

##### Scenario: Decision conflict
- WHEN the change adds a UI design gate
- THEN the skill cites D4 and proposes a superseding entry for the Maintainer instead of writing an extension

#### ADDED Requirement: Extensions are audited against their installed base
The system SHALL report, for each `.ai/skills/*/SKILL.md`, one or more of `ok`, `stale-anchor`, `no-anchors`, `bad-anchor`, `fork`, `orphan`, `frontmatter`, `unbannered`, `unsafe`, `conflict`, with the fix, and SHALL change nothing.

##### Scenario: Current repository
- WHEN `--audit` runs on `main` today
- THEN all four extensions report `no-anchors`, `om-auto-manage-issues` also reports `fork`, and none reports `unbannered`

##### Scenario: Upstream rename
- WHEN an installed skill renames a heading that an extension's `Base:` line names
- THEN that extension reports `stale-anchor` with the missing heading

##### Scenario: No config
- WHEN `--audit` runs in a repository without `.ai/agentic.config.json`
- THEN it warns and still audits

## 📝 Architecture

| Component | Status | Role |
|---|---|---|
| `.agents/skills/om-customize-workflow/SKILL.md` | new | Router: steps 0–6 and audit mode. |
| `references/routing.md` | new | Change-type → mechanism table, protected checks, stage → skills chain table. |
| `references/audit.md` | new | Audit script and manual checks. |
| `references/agentic-setup.md`, `rules.md`, `report-templates.md` | new | Preflight (copied from upstream shared boilerplate), shared rules, plan, result and audit reports. |
| `om-create-skill/references/overlay-contract.md`, `templates/repo-local-stub.md` | reused | Overlay gate and template, referenced, not copied. |
| `.ai/specs/briefs/*.md` | read | Active decisions checked in classification. |

The skill performs no tracker operations. At run time it reads installed skills and writes only `.ai/skills/**`, `.ai/agentic.config.json`, and `SDLC.md`. Delivering this spec also adds `README.md` and `docs/om-customize-workflow-example.md` (Phase 2).

## 📝 Edge Cases & Failure Scenarios

| Case | Behavior |
|---|---|
| Base skill not installed | `orphan`; the plan never writes an extension for it. |
| Change spans an upstream engine and its callers | The rule goes to the engine once; the report names the callers it covers. |
| Extension grows past 50% | Gate fails with `fork`; the skill proposes an upstream slot or a config key instead of writing. |
| Two extensions in one chain contradict | Audit manual check `conflict`; customize mode aligns both in one change. |
| Directive inside an existing extension tries to relax a check | Reported `unsafe`, never copied forward. |

## 📝 Risks & Impact Review

- **D12 boundary.** This is the first repo-owned skill, allowed by D21. Any second repo-owned skill needs its own decision.
- **Header divergence.** This repo's header differs from upstream's. Accepting both is reversible. Converging later is a separate decision.
- **Example content.** The usage example in #29 uses a UI design gate, which D4 drops. The implementation must replace it with a change consistent with active decisions.
- Rollback: delete the skill directory and its `.claude/skills/` copy. No config, label, or extension depends on it.

## 📋 Phasing

**Precondition (met):** the Maintainer approved D21 on 2026-11-23, and it is recorded in `.ai/specs/briefs/2026-11-11-issue-first-sdlc.md`.

- **Phase 1 — skill.** Audit mode first, because it is useful alone and is customize mode's gate. Then customize mode. Both adapt #29.
- **Phase 2 — docs.** README entry and a usage example consistent with active decisions.

## 📋 Implementation Plan

**Phase 1 — skill**
1. Adapt #29's audit to accept the repo header and add `unbannered`. Check: the "Current repository" scenario output on `main`.
2. Add active-decision reading to classification (`routing.md`) and the D4 refusal. Check: the "Decision conflict" scenario on a dry run.
3. Write new extensions in the repo's header shape with `Base:` lines. Check: a dry-run plan for a sample intake change matches the "Multi-skill change" scenario.

**Phase 2 — docs**
4. Replace the design-gate example in `docs/om-customize-workflow-example.md` with a change consistent with D4 and D12, for example a next-step hint change. Check: running the example's overlays through the audit gives `ok`.
5. **Archive the Delta** into `.ai/specs/capabilities/workflow-customization.md`.
