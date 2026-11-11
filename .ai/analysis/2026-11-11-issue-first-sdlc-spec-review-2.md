# Spec review 2: Issue-First SDLC Adaptation (OM), minimal-intervention draft

Reviewed: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (Draft, D12 version, 2026-11-11)
Reviewer: fresh-context subagent (Fable), read-only. The reviewer was told the D12 direction is settled, so it proposes no gates.
Spot-checked by the author, all confirmed:
- `om-backlog` has no waiver ("waive" and "ready as is" do not occur in it);
- `om-auto-create-pr` takes no issue argument (`references/pr-finalize.md:14`: "no issue — e.g. `om-auto-create-pr`");
- `om-auto-review-pr` autofixes PRs authored by `$CURRENT_USER` (`SKILL.md:73`).

**Verdict: revise before acceptance.** D12 holds, and most citations check out. Two routes rest on behavior the native skills do not define: `om-backlog` once a DoR exists, and an "issue-driven" `om-auto-create-pr`. The planned `CODE_REVIEW.md` check would also let automation write `Status: Accepted`.

## Decisions needed

1. **DoR vs the backlog path.** Once the DoR exists, `om-backlog` applies the full ticket-level tier, including evidence tiers 1–5, to a spec source, and it has no waiver. Recommended: run `om-backlog <spec> --dry-run` against a local draft of the DoR *before* accepting the spec; it needs no tracker. If it stops, keep the DoR, document what a spec's Problem Statement must carry, and offer only the direct path until an addition is approved under D12.
2. **Native output advertises the forbidden command.** Issue bodies (`om-prepare-issue/SKILL.md:56`), `om-backlog`'s `Next:` line (`:45`), the not-ready comment (`enrich-existing-issue.md:139`), `om-brainstorm` ramp 6, and `SDLC.md` § autofix queue all point at `om-auto-fix-issue`. Recommended: accept this, and add a rule to § Routes that the route table overrides those prompts.
3. **`chore` on PRs.** Native PR labeling maps `chore` to `refactor` (`pr-finalize.md:101-110`, `om-open-pr/SKILL.md:16`). Recommended: accept `refactor`/`documentation` on PRs and reword the trivial row.
4. **"Triage classifies" is not native on the standard route.** `om-prepare-issue` labels at creation, and triage never changes an existing label. Recommended: document the intake label as provisional and the human as its confirmer in triage.

## Findings

### High

- **The backlog path may be infeasible once the DoR exists.** `om-backlog/SKILL.md:28` requires the problem and who has it to rest on evidence tiers 1–5, and its stop routes to `om-discover`. The Edge Cases claim of a maintainer waiver is false, and the Phase 2 check passes on either outcome. *Fix:* run the dry-run before acceptance, state the expected result, and remove the waiver claim.
- **"Issue-driven `om-auto-create-pr`" is not a native mode.** The skill takes only a brief and has no issue operations (`SKILL.md:12-17,29`). `Closes #N` therefore depends on agent inference. Without it, the item is never closed, the epic checklist never completes, and the issue is never claimed. A body line `Backlog source: <spec>` may also make the run adopt the whole parent spec (`SKILL.md:13`). *Fix:* prescribe the brief text in § Routes: paste the acceptance criteria, require `Closes #N`, limit the scope to this item, and forbid the parent spec as `Source doc`. Add a `CODE_REVIEW.md` check for `Closes #N`. Add a live fixture.
- **Safety: the `CODE_REVIEW.md` check lets the autofix loop write `Status: Accepted`.** `om-auto-review-pr` autofixes its own PRs (`SKILL.md:73`) and edits spec documents (`:80`). `om-auto-merge-buddy` runs review with `--autofix`. *Fix:* word the rule as human-only. A missing `Accepted` means "awaiting human acceptance" and is never a fixable finding. Any agent commit that adds or changes `Status:` is a Blocker. State the limit: under the human's login, "set by a human" cannot be verified.
- **Native artifacts steer contributors to the forbidden command** (see Decision 2). The costliest misuse, whole-spec implementation from a story, is the path the tooling itself prints.

### Medium

- **Readiness paths are not explicit.** The only native readiness refusal is on the feature route of `om-auto-fix-issue`, which the routes forbid. The per-category notes are not written. *Fix:* put the per-category minimum table in the spec, with notes that add to the native five items and never narrow them. Add a readiness column to the route table: ready or waived means go on, not-ready means stop, both by convention.
- **The no-backlog path does not close the source issue.** `om-auto-implement-spec <path>` has no `ISSUE_ID` (`spec-resolution.md:7-9`). A source issue has no checklist. *Fix:* at acceptance the human comments the spec path on the issue, then runs `om-auto-implement-spec <issue#>`. Add § Milestones (design acceptance, child-item completion, source completion = all epics referencing it are closed).
- **Spec-PR step gaps.**
  - `om-spec-writing` only writes a file, so the interactive branch has no PR-opening command.
  - The template has no `Status:` line.
  - `om-auto-write-spec` opens a ready PR labeled `review`/`documentation`/`skip-qa`.

  *Fix:* name the PR step (`om-open-pr {issueId} documentation --draft`, or a hand-opened PR). The human adds `Status:`.
- **The idea row is not executable.** `om-brainstorm` files nothing, and its ramps call `om-prepare-issue` without `--no-spec`. Triage posts implementation-prep notes by default. *Fix:* use `om-brainstorm` (optional), then **[H]** `om-prepare-issue --no-spec "<goal> — brief: <path>"`, with `--no-prep` in triage. After re-categorization, re-run triage.
- **Phase 2 is not executable as written.**
  - The dry-run needs hand-filed issues without labels.
  - Stopping "up to the first human decision" never exercises the risky claims.
  - No PR carries the verification record.
  - The Delta archive belongs on the implementation PR.
  - Bootstrapping with `--spec` seeds the whole spec.

  *Fix:* list the fixtures and their expected artifacts. Move the archive into Phase 1. Bootstrap without `--spec`. Name the Phase 2 PR.
- **The trivial row promises a `chore` PR label** that native skills cannot apply (Decision 3).
- **Existing `SDLC.md` text contradicts the new sections.** "Triage" means `om-verify-in-repo` (`SDLC.md:25`). Line 9 puts spec work before intake. The autofix queue (`:204-212`) routes everything to `om-auto-fix-issue`. *Fix:* add a Phase 1 step that reconciles these passages.
- **The mini-extension is underspecified.**
  - It has no tie-breakers (idea vs feature, chore vs refactor/dependencies/documentation).
  - The "bump…" example collides with `dependencies`.
  - The wording must keep "exactly one category when none is present" and the guards, so the extension reads as two added values and not as a relaxation.
  - It should use a plain reference instead of `@`-import.

  *Fix:* put the exact extension text in the spec.

### Low

- Non-bugs reach the bug chain through the "when unsure" default (`om-auto-fix-issue/SKILL.md:43`). An idea or chore phrased "add…" takes the feature route.
- The `om-prepare-issue` side effect is overstated: the same items apply as hygiene without a DoR (`SKILL.md:58`).
- `automerge.humanOnlyLabels` forces human QA but does not hold spec PRs.
- `jq` is already in `AGENTS.md:27`.
- `CODE_REVIEW.md` is missing from Proposed Solution and Architecture.
- The Delta records one of the four behaviors that turn on.
- There is no spec-required comment for a large refactor/docs/chore.
- `om-fix-issue` leaves work staged, and the bug row names no PR step.

## Review limits

- Read in full: the spec, the brief, the prior review, the repo docs, the config, and the skills `om-prepare-issue`, `om-auto-manage-issues`, `om-auto-fix-issue`, `om-auto-create-pr`, `om-auto-implement-spec`, `om-auto-write-spec`, and `om-backlog` with their references.
- Partial: `om-spec-writing`, `om-brainstorm`, `om-auto-review-pr`, `om-open-pr`, `om-close-fixed-issues`.
- Nothing was executed. Agent behavior is inferred from the skill text.
