# Issue-First SDLC Adaptation (OM): Feature Brief

## Problem Statement

The team has no clear, agreed distinction between four things:

- capturing an incomplete need,
- authorizing the next activity,
- accepting a design, and
- implementing bounded work.

Today, every change tends to get the same heavy specification and backlog process, whatever its type or risk. No verified route exists for each issue type.

## Feature

Adapt SDLC intake and controlled delivery using existing OM skills. Each issue category gets its own route. Required information, human decisions, and next activities are explicit. There is no one-size-fits-all workflow.

## Requirements

### Functional

1. **Categorization:** Classify each issue as idea, feature, bug, refactor, documentation, or chore. Intake captures the need and proposes a category, and a human confirms it in triage (D8, D15).
2. **Readiness baseline:** Each category defines the minimum information needed before the next activity. Readiness never triggers automated work. It needs an explicit human command.
3. **Proportionate routing:**
   - **Idea:** captured only. No spec and no implementation until a human re-categorizes it.
   - **Feature:** always specification → human design acceptance → implementation, regardless of size (D6). Whether a backlog comes between acceptance and implementation is a human decision (D10). Backlog items then follow their own short route (D11).
   - **Bug:** bounded fix route (reproduce → root cause → fix → PR). No spec.
   - **Refactor, documentation, chore:** the route depends on size (D9).
     - **Small:** `om-auto-create-pr` with no spec.
     - **Large:** specification → human design acceptance → implementation. Backlog is a human decision (D10).
   - **Trivial changes** (typo, one-line docs or config fix) may skip the issue and go straight to `om-auto-create-pr` (D7).

### Non-Functional

- **Tooling:** Use only existing OM capabilities, configuration, and scoped local extensions. No external pipelines or non-OM skills.
- **Role independence:** Keep the roles separate (issue owner, author, reviewer, designer, QA reviewer, maintainer). Automation does not replace human QA or design approval.
- **Safety:** Merge authority stays with humans. Automation merges only PRs a human has labeled `automerge` (OM-native `prepare-and-merge`). The QA gate is unchanged.

## Scope

- **In:** idea intake, triage, readiness, design acceptance, backlog handoff, proportionate delivery routes.
- **Out:** rollout planning, skill-install cleanup, lockfile changes, event-driven execution, autonomous merging (merging a PR without a human-applied `automerge` label), product implementation (migration, deployment, client distribution).

## Constraints

- Do not modify vendored skills to override safety restrictions.
- Implementation cannot start until the design is accepted (see D1).
- Backlog publication and readiness are separate human decisions.
- Specification acceptance is not implementation authorization.

## Success Criteria

- Contributors can identify the right route and readiness information for any issue category.
- Incomplete needs can be captured without forcing spec or implementation work.
- Allowed and refused readiness paths are explicit.
- Design is accepted before implementation starts.
- Design acceptance, child-item completion (when a backlog was chosen), and source Feature completion are defined as separate milestones.

## Decisions

Recorded 2026-11-11. Rationale: `.ai/analysis/2026-11-11-issue-first-sdlc-analysis.md`. Principle: use the OM-native mechanism wherever one exists. Local extensions only enforce what OM already defines.

| Id | Decision |
|---|---|
| D1 | **Design acceptance** (amended by D19) means a human sets the spec to `Status: Accepted` and merges the design-only spec PR into `main`. Who may approve and merge is decided natively by GitHub permissions and policies. Automation never accepts. This is a documented convention, checked in review, not an enforced gate (D12). |
| D2 | **Readiness** is OM-native: `READY_STATUS` is computed from the per-category Definition of Ready in `SDLC.md`, or comes from a maintainer's "ready as is" waiver. There is no readiness label. Work starts only on a separate human command. |
| D3 | **Automerge** stays in OM-native `prepare-and-merge` mode. A human authorizes each merge by applying the `automerge` label. |
| D4 | Former requirements for UI design gates and traceability are dropped, because OM-native mechanisms cover them (Design stage, `Prototype:`, QA state matrix, `Closes`/`Refs`, readiness item R3). Workbooks are entirely outside this repository and are not addressed here. |
| D5 | Specs live in `.ai/specs/`, and briefs live in `.ai/specs/briefs/`. |
| D6 | **Every feature goes through a spec**, whatever its size. The category decides the route: work that needs no spec is not a feature, and is filed as chore, refactor, or documentation instead. |
| D7 | **Trivial changes may skip the issue.** A typo or a small, local, obvious docs or config fix goes straight to `om-auto-create-pr` with `skip-qa` (the OM-native "task brief without a ticket" path). `SDLC.md` defines what counts as trivial. Anything that does not clearly qualify needs an issue. |
| D8 | **Intake does not start spec work.** `om-prepare-issue` always runs with `--no-spec`. Triage (`om-auto-manage-issues`) classifies the issue, records `SPEC_STATUS` and `READY_STATUS`, and posts the spec-required and not-ready comments. It never runs with `--write-missing-specs` unless a human asks. A spec starts only on a separate human command. |
| D9 | **Size-based fork for refactor, documentation, and chore.** Small work goes through `om-auto-create-pr` from the issue, with no spec. Large work goes through spec → design acceptance (D1) → implementation, with backlog decided per D10. "Large" uses the OM-native criterion: the change is not small, local, and obvious from its description. The human decides in triage, and the command they run records the decision. There are no size labels. |
| D10 | **Backlog is a human decision after spec acceptance** (extended by D20), for every spec route (feature and large refactor/documentation/chore). The human picks one of two OM-native paths. **Backlog:** `om-backlog --dry-run`, then human confirmation, then `om-backlog`, then implementation per child item. **Direct:** `om-auto-implement-spec` on the whole accepted spec. The decision is separate from design acceptance and from readiness. Without a backlog, the child-item milestone does not apply, and the source issue closes with its implementation PR. |
| D11 | **Backlog items have their own short route.** Items filed by `om-backlog` are already categorized and carry acceptance criteria and their parent spec. They get no re-classification and no spec of their own; D6 is satisfied through the parent spec. A human starts each item with an issue-driven `om-auto-create-pr "implement #<item> per its acceptance criteria"` (`Closes #<item>`), in `Depends on` order. `om-auto-fix-issue` and `om-auto-implement-spec` are not used for items, because both would implement the whole parent spec. A human closes epics and the source issue when their checklists are complete. |
| D12 | **Minimal intervention in OM.** OM stays native: no added gates, and no change to how skills chain. Routes are documented conventions that a human follows by choosing the native command for each category. Skill changes are limited to repo-local extensions that add rules and never relax a native check. There are two: the `idea`/`chore` category list for `om-prepare-issue` and `om-auto-manage-issues`, and route-correct next-step hints (D13). Later additions, such as a label, are considered case by case. |
| D13 | **Next-step hints follow the route.** Native output suggests `om-auto-fix-issue` in four places: the `om-prepare-issue` issue body and its report `Next:`, the `om-backlog` `Next:` line, the not-ready comment of `om-auto-manage-issues`, and `om-brainstorm` ramp 6. Repo-local extensions of these skills replace that suggestion with the command from the route table for the issue's category: `om-auto-create-pr "implement #<n> …"` for a backlog item, a spec command for a feature or large work, and `om-auto-fix-issue` only for a bug. The extensions change only the suggested text. Chaining, gates, and output formats stay native, and `om-backlog`'s `Next:` still matches `^Next: (none\|om-[a-z-]+.*)$`. |
| D14 | **`chore` is an issue category only.** PRs get the native category label: `refactor`, or `documentation` for a docs-only change. No PR-labeling skill is extended. |
| D15 | **The intake category is provisional.** `om-prepare-issue` labels at creation, and triage never changes an existing label. The human confirms the label in triage, or changes it by hand, before choosing a route. |
| D16 | **A spec must be backlog-ready.** A dry-run of `om-backlog` against the native Definition of Ready (`.ai/analysis/2026-11-11-om-backlog-dry-run.md`) stops on content, not on missing discovery. Every spec therefore names who has the problem, with its source tier, and an owner role for its out-of-scope items. `om-backlog` has no waiver. The maintainer's "ready as is" waiver applies only to issues, through `om-auto-manage-issues`. |
| D17 | **The autofix queue takes bugs only.** `idea`, `feature`, `refactor`, `documentation`, and `chore` are added to `autofix.eligibility.excludeLabels` by re-running `om-setup-agent-pipeline`. This is a native filter value, so the config and `SDLC.md` say the same thing. It adds no gate. |
| D18 | **`om-brainstorm` exits stay issue-first.** Extension B adds `--no-spec` to the ramp-2 hint. § Routes states that ramps 3 and 5 (spec or PR without an issue) need an issue first, unless the change is trivial (D7). The hints for ramps 3 and 5 stay native. |
| D19 | **Acceptance on explicit instruction** (amends D1). Automation never sets `Status:` on its own initiative, and never inside a review autofix. An agent may write `Status: Accepted` only when a human explicitly instructs it. The change goes on its own PR, which changes only the `Status:` line and records the instruction in its body. The human's merge of that PR is the acceptance. First used on PR #4, after spec PR #3 merged without the status line. |
| D20 | **Phased direct route** (extends D10). After acceptance, a spec whose phases must merge one after another may skip the backlog. A human runs one `om-auto-create-pr` per phase, with that phase's steps in the brief and no `--spec`. Each PR references the source issue: intermediate phases with `Refs #<n>`, the last phase with `Closes #<n>`. This keeps a small, phased change off the heavy backlog path. First used for this brief's own spec, where the backlog would have filed two epics and a dozen items for a process change. |
