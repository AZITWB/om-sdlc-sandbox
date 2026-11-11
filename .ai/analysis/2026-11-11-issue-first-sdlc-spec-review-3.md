# Spec review 3: Issue-First SDLC Adaptation (OM), Draft v3

Reviewed: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (Draft v3, D1–D16), 2026-11-11.
Reviewer: a fresh-context subagent (Fable), read-only. It was told that D12 and D13 are settled.

Spot-checks by the author, all confirmed:
- `om-open-pr/references/pr-body-template.md:51-52`: a spec-only PR uses `Refs`. The spec's claim that `om-open-pr <n>` always writes `Closes` is wrong.
- `om-auto-manage-issues/references/implementation-prep.md:60`: `Next: om-auto-fix-issue {issueId}`. This is a fifth hint location.
- `om-brainstorm/SKILL.md:45-48`: ramp 2 has no `--no-spec`. Ramps 3 and 5 need no issue.
- `om-open-pr/SKILL.md:65`: `git add -A`.
- `c0c8f6e` is not on `origin/main`.
- `om-auto-issue-triage/SKILL.md:15`: the triage covers "bug fixes, maintenance and features".

**Verdict: revise (targeted), then proceed.** D12 and D13 hold, and the override contract permits Extensions A and B. The remaining problems:
- Extension B is under-specified where it touches machine-parsed `Next:` lines.
- The bootstrap contradicts the spec's own rule about briefs that name a spec.
- The fixtures miss three of the riskiest claims.

## Decisions needed

1. **Autofix queue "bug only": documentation or config?** Recommended: add `idea`, `feature`, `refactor`, `documentation`, and `chore` to `autofix.eligibility.excludeLabels` through `om-setup-agent-pipeline`. This is a native filter value, not a gate. `CODE_REVIEW.md:8` treats a mismatch between docs and config as a Blocker. Alternative: word the sentence as a human convention.
2. **`om-brainstorm` ramps 2, 3, and 5 are off-route.** Ramp 2 lacks `--no-spec`. Ramps 3 and 5 start a spec or a PR with no issue. Recommended: Extension B adds `--no-spec` to ramp 2, and § Routes says ramps 3 and 5 need an issue first unless the change is trivial.

## Findings

### High

- **Extension B does not define the literal `Next:` line.**
  - Problem: the five-line brief template breaks the one-line contract `^Next: …$` (`om-backlog/SKILL.md:48`). A placeholder is not an invocation, yet an orchestrator may run `Next:` as written (`om-brainstorm/SKILL.md:8,57`).
  - Risk: a brief that names only `#<n>` can resolve the parent spec.
  - *Fix:* a literal, self-contained one-line string in Extension B.
- **Extension B has no deterministic answer for several cases.**
  - **Idea:** "no command" conflicts with the required `Next: om-…` shape. Use `Next: none`.
  - **Feature:** there are two alternative commands, but `Next:` needs exactly one.
  - **Small or large work:** the size is unknown at intake (D9).
  - **`security` and `dependencies`:** there is no bullet for them.
  - **Epics:** they also carry `Backlog source:` and `Backlog id:` (`om-backlog/references/filing.md:10-11`).
  - **Precedence:** none is defined between "backlog item" and the item's category.
  - *Fix:*
    - A backlog item is a story or task: the body has `Epic:` or `Story:`. It wins over the category.
    - Epics get no command.
    - After intake, the next step is always triage (`om-auto-manage-issues <n>`).
    - In prose, show both size options. In `Next:`, use one fixed default per category.
    - `security` and `dependencies` keep the native hint.
- **The bootstrap contradicts the spec, and a prerequisite is missing.**
  - Step 3 passes a brief that names the spec. That seeds both phases (`om-auto-create-pr/SKILL.md:13`; the spec itself says so at its § Routes).
  - The setup commit `c0c8f6e` is not on `origin/main`, and worktrees branch from it.
  - The delivery path for this spec is in no route row.
  - *Fix:*
    - Merge the setup first.
    - Dogfood the backlog route, or paste the Phase 1 steps with "Phase 2 is a non-goal".
    - Linkage: the Phase 1 PR gets `Refs #<source>`, and the Phase 2 PR gets `Closes`.
    - § Routes: the direct route means the whole spec in one PR. A spec whose phases depend on earlier merges uses the backlog.

### Medium

- **The hand-written spec-PR step is unsafe.**
  - `om-open-pr` runs `git add -A` and pushes the current branch (`om-open-pr/SKILL.md:65,74`), and no spec branch is named.
  - It expects a `PREVIOUS STEP` block (`:60`).
  - `--draft` needs a ready flip before merge.
  - The same problem affects `om-fix-issue` → `om-open-pr <n> bug`, which must run in the emitted `WORKTREE`.
  - *Fix:* name the branch, require a clean tree, pass a summary, and add the ready flip.
- **The fixtures miss the riskiest claims.**
  - No fixture covers a real-run `om-backlog` `Next:` line, a story or epic body, ramp 6, or the direct path's `Closes #n`.
  - F5 is not deterministic, because the native footer is a gate statement (`enrich-existing-issue.md:139`).
  - F7 setup is unstated: it needs a throwaway spec that meets D16, a real `om-backlog` run, and cleanup.
  - *Fix:* add F7a, F8, and F9. Redefine F5. Give the exact footer per category.
- **The direct path can resolve the wrong file.**
  - Resolution scans the issue body and comments for any `$SPECS_DIR` path (`spec-resolution.md:9`), and the briefs live under `.ai/specs/briefs/`.
  - *Fix:* a fixed comment `Accepted spec: <path>`, with a path fallback and a hand-added `Closes`.
- **`SDLC.md` would still leave contributors stuck:**
  - there is no small-task brief template, and `om-auto-create-pr` has no **get-issue** (`SKILL.md:29`);
  - triage flags are named only for ideas;
  - `implementation-prep.md:60` is a fifth hint location, outside D13;
  - nobody commits `backlog.md` (`om-backlog/SKILL.md:38`);
  - `security` and `dependencies` have no route;
  - re-categorizing by hand (in the GitHub UI) is not described;
  - backlog items and small tasks get no claim.
- **`Frozen by: none` on the MODIFIED readiness requirement.** The spec flags this itself.

### Low

- **Delta:**
  - "Backlog dry-run" has a false WHEN.
  - The hint change is MODIFIED, not ADDED (`delta-format.md:51-53`).
  - It records one of four readiness behaviors.
- **Inconsistencies:**
  - Extension A cites "step 4"; the right reference is § 2 (`enrich-existing-issue.md:30-31`).
  - The spec says "two checks" but lists three.
  - "`om-open-pr <n>` always writes `Closes`" is wrong.
  - The `om-backlog` and `om-brainstorm` extensions lack the installed-skill header.
  - Milestone 3: epics reference the spec path, not the source issue.
  - The native Definition of Ready, copied word for word, still advertises the `om-auto-fix-issue` feature route.
- **Compatibility:** two protected surfaces in `BACKWARD_COMPATIBILITY.md` change. Record the maintainer's approval in the Phase 1 PR.
- **Edge Cases:** missing `om-auto-fix-issue` on an `idea` or `chore` phrased "add…", which takes the feature route (`om-auto-fix-issue/SKILL.md:40`).

## Status of review-2 findings

- **Decisions:**
  - 1 resolved (pending F6);
  - 2 partly;
  - 3 and 4 resolved.
- **High:**
  - backlog feasibility: resolved;
  - issue-driven `om-auto-create-pr`: resolved, except claims;
  - `Status:` autofix: resolved;
  - native hints: partly.
- **Medium:**
  - resolved: readiness, no-backlog closure (not verified), idea row, trivial label, extension text, `SDLC.md` contradictions (except the Definition of Ready sentence);
  - partly: spec-PR step and Phase 2.
- **Low:**
  - mostly resolved;
  - Delta coverage not resolved;
  - `idea`/`chore` reaching the feature route: partly.

## Review limits

Nothing was executed, and no tracker or network was used. Agent behavior is inferred from the skill text. The reviewer did not read `claim-pr.md`, `om-backlog/references/identity.md`, `backlog-tree.md`, or `spec-when-missing.md`. It is unverified whether a `cez-autofix` worker exists.
