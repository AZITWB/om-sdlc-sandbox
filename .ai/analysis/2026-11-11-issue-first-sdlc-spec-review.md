# Spec review: Issue-First SDLC Adaptation (OM)

> **Note (D12, 2026-11-11):** this review covers the previous draft, which enforced gates through five extensions. The spec was rewritten for minimal OM intervention, so most findings no longer apply. Two still shape the current spec: `om-backlog` readiness on a spec source, and the native "do not use" pitfalls (whole-spec implementation from a story, the bug chain for non-bugs).

Reviewed: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (Draft, 2026-11-11)
Reviewer: fresh-context subagent (Fable), read-only, per `om-spec-writing` step 8.
Spot-checked by the author: `--dry-run` is absent from `om-prepare-issue`, `om-auto-fix-issue`, `om-auto-implement-spec`, and `om-auto-create-pr`. `om-spec-writing` writes no `Status:` line. Both are confirmed.

**Verdict: revise before acceptance.** The direction matches the brief, and most native-behavior claims check out. Four problems need fixing:
1. The central D1 gate has no producer for `Status:`.
2. Several entry points are ungated.
3. The backlog-item route collides with the vendored one-implementation-PR-per-spec contract.
4. The verification plan relies on `--dry-run` flags that four of the target skills do not have.

## Decisions needed

1. Is `om-auto-create-pr "<brief citing issue #N>"` an allowed start for a feature or `size-large` issue? Recommended: no. The category and size route applies whenever a brief references an issue.
2. Who applies `do-not-close` to the source issue? `SDLC.md` makes it human-only. Recommended: drop the automated label, because `Refs`-only linkage already keeps the source open.
3. What are the routes for `security` and `dependencies`? Recommended: state "outside this contract, native behavior", or map them to the bug route or the small route.
4. Does brief mode (`om-auto-fix-issue "<free text>"`) count as one human command for both intake and start? Recommended: no. Stop after filing.
5. What is the readiness minimum for `idea`? Recommended: ideas are not readiness-checked (`n/a`), so no extension has to narrow a vendored check.

## Findings

### High

- **The D1 gate has no `Status:` producer or reader.** No skill writes a `Status:` line, and R1 passes a spec without one. Nothing says the status must be read from `origin/<base>`. An agent could write `Accepted` itself. *Fix:* add an `om-spec-writing`/`om-auto-write-spec` extension that always writes `Status: Draft` and never `Accepted`. Define the gate as "`origin/<base>:<spec>` contains `Status: Accepted`, and a missing field is refused". Add a `CODE_REVIEW.md` rule that only a human commit may flip the status. State whether the gate invokes `om-pre-implement-spec` or re-implements only R1.
- **Entry points without a gate:**
  - the R1 gate is missing on `om-auto-create-pr-loop`, `om-implement-feature*`, and `om-auto-continue-pr`;
  - ideas can still get a spec through `om-auto-write-spec` and `--write-missing-specs`;
  - D6/D9 can be bypassed with `om-auto-create-pr` given a brief that cites an issue.

  *Fix:* put the gate text in one shared file referenced by every implementing or spec-writing extension, or document each bypass explicitly. Reconcile "ideas SHALL NOT get specs" with "a direct spec command is allowed".
- **The backlog-item route conflicts with vendored contracts:**
  - `--spec` seeds the plan from the whole spec;
  - `Source doc:` makes `om-auto-implement-spec` resume a story PR as the implementation PR;
  - nothing prevents a whole-spec run after a backlog exists;
  - nobody owns the Delta archive.

  *Fix:* use no `--spec`. Pass the story's acceptance criteria as the brief, with the spec as a read-only reference and a distinct PR marker. Have the `om-auto-implement-spec` extension refuse when `backlog.md` has a section for the source. Name which item archives the Delta.
- **Verification relies on missing `--dry-run` flags.** Three of five `-before.md` records cannot be captured without real runs, which the bootstrap rules forbid. An LLM transcript is not a characterization test. Phase 4 cannot exercise the scenarios for accepted specs, stories, or the last story's merge. *Fix:* use `Frozen by: none — agent-interpreted prose; baseline = cited vendored lines at the current skills-lock revision` (a Medium finding). Use a static check that each extension exists and contains its rules, plus an enumerated list of live fixtures.
- **Automation applies the human-only `do-not-close` label.** `SDLC.md`, the tracker descriptor, and `om-backlog`'s rules all forbid it. It also makes `om-auto-manage-issues` skip the source issue. It is unnecessary, because `om-close-fixed-issues` ignores `Refs`. *Fix:* remove it, and reclassify the requirement as ADDED.
- **Phase 1 is not docs-only.** Adding `## Definition of Ready` switches on native gates in four skills, including `om-backlog`'s evidence tiers on a spec source. A narrowed `idea` tier may be treated as a forbidden relaxation. `SDLC.md` would document gates that are not enforced yet. *Fix:* write per-category rules as additions to the full tier, with `idea` not checked. Add an `om-backlog --dry-run` check on a spec source. Mark routes "enforced from Phase N", or merge Phases 1 and 2.

### Medium

- The "unless the human asks for a spec in the same command" exception contradicts D8. Brief mode chains intake and spec in one command.
- Backlog-item recognition:
  - epics have no `Epic:`/`Story:` line;
  - `Design authority:` appears only on epics;
  - the `Depends on` order has no step;
  - a story with tasks can be implemented twice;
  - the check order is undefined.

  *Fix:* key on `Backlog source:` + `Backlog id:`. Refuse epics, and stories with open tasks or open dependencies. Use the order: backlog item → idea → category → size → readiness.
- Category and label rules:
  - `idea` and `chore` are absent from the native inference lists;
  - "exactly one category" contradicts "additive", which is a breaking change under `BACKWARD_COMPATIBILITY.md`;
  - triage applies the category, it does not propose it;
  - human-only size labels in `labels.meta` break the pattern;
  - the config is hand-edited instead of re-running setup.
- Readiness at start is unspecified for bug, refactor, documentation, and chore. `READY_STATUS` is not stored. A `size-large` refactor never gets a spec-required comment.
- The trivial-brief gate blocks legitimate issue-less callers (`om-auto-update-changelog`, `om-auto-qa-scenarios`, `om-auto-sec-report*`, `om-ai-context-maintenance`, `om-brainstorm`). How an issue-less brief is detected is undefined.
- Brief coverage gaps:
  - the three milestones have no requirement;
  - role independence and the "issue owner" role are not addressed;
  - `Closes #source` without a backlog is not implementable, because `om-auto-implement-spec <path>` has no `ISSUE_ID`.
- Bootstrap mechanics:
  - no command is named for producing four phase PRs, while native behavior is one implementation PR per spec;
  - bootstrap bans `om-auto-fix-issue`, yet items can only be started with it;
  - there is no "human accepts this spec" step;
  - one file is split across two PRs.
- The "hard backstop" is overstated. With `prepare-and-merge` and `requireIndependentReview: false`, the human `automerge` label is the only human act. *Fix:* state this, or recommend `humanOnlyLabels` or independent review for spec PRs. Both stay within D3.

### Low

- Delta format:
  - requirements bundle several behaviors;
  - "route is documented" is not observable behavior;
  - two negative scenarios have no trigger;
  - one capability spans too much;
  - stop tokens are not uniform (`NOT_READY` vs `Status: blocked`).
- Factual overstatements:
  - `om-auto-fix-issue` only stops, it does not close;
  - `om-prepare-issue` infers the labels, not `om-backlog`;
  - `om-auto-fix-issue` skips the readiness check rather than recording `n/a`;
  - "no new path is created" is false.

## Review limits

- Read in full: the target skills, their cited references, and the repo docs.
- Grep only: `om-auto-create-pr-loop`, `om-auto-write-spec`, `om-implement-feature`, and the tracker descriptor.
- Not verified: nothing was executed, so real agent behavior under the extensions is untested. Also unchecked: `om-backlog`'s readiness check on a spec source with a DoR, and the GitHub-side state.
