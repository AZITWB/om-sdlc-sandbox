# Software delivery process

## Purpose

This file documents how work flows from ticket to merged PR in this repository. The agent skills configured in `.ai/agentic.config.json` enforce the process; humans read it here. New PRs default to `main`; existing PRs use their own current target branch (`baseRefName`) for base updates, reviews, required checks, and merging; issues and PRs live in GitHub (`AZITWB/om-sdlc-sandbox`), with every tracker operation the skills run defined in `.ai/trackers/github.md` (edit that file to extend or override tracker behavior).

Work enters through two paths: a free-form task brief handed to an agent, or a filed ticket. Both converge on the same review loop, the same validation gate, and the same merge gates.

Before intake, the work is shaped: `om-brainstorm` turns a single idea or question into a routing decision and a brief, and the spec skills (`om-spec-writing`, `om-auto-write-spec`) turn a feature into a design document before anything is built. Those steps feed the table below; they are not the ticket flow itself.

## Roles

- **Author** — the human or agent who writes the change. Owns the ticket from claim to a merge-ready PR.
- **Reviewer** — reads the diff and approves or requests changes. May be a human or the `om-auto-review-pr` skill; the `om-code-review` checklist applies either way. The reviewer is also the second person a `risk-high` change needs and signs off the spec when a feature requires one; a team that names a tech lead or an architect puts them here.
- **Designer** — owns the flow and its states before the code exists, and the design contract the UI review reads back. May be a human, `om-ux-shape` for shaping, `om-ux-design` for detailed screens from a specification, or `om-ux-review-pr` for the pass over a PR's screens.
- **QA reviewer** — exercises user-facing changes before they merge, with `om-prepare-test-env` to boot the app once and `om-auto-qa-pr` to walk it in a real browser. Manual means a person judges the result and owns `qa-approved`; it does not mean the work is unassisted. Always referenced by role, never by name or handle: assignments change.
- **Maintainer** — owns branch protection, the label taxonomy, the config, this document, and the installed skills with their repo-local overrides under `.ai/skills/`; arbitrates when gates conflict. Acts as the release manager unless the team names one.

## Ticket lifecycle

| Stage | What happens | Driven by | Done when |
|---|---|---|---|
| Discovery | An idea, question, or itch is talked through before any artifact exists: the problem is questioned, alternatives (including building nothing) are weighed, and the conversation ends in a routing decision — an answer, a filed ticket, a brief for a spec, or a direct change. | `om-brainstorm` or a human | Conversation routed; a brief written when the work continues |
| Intake | A ticket or task brief is filed in GitHub with enough detail to act on: what is wrong or wanted, for whom, and what done looks like. `om-prepare-issue` files it with SDLC labels. | Anyone, `om-prepare-issue` | Ticket exists |
| Triage | Confirm the issue is real, still unfixed on `main`, and not already claimed or covered by an open PR. Read-only; stops the chain cleanly when there is nothing to do. | `om-verify-in-repo` or a human | Confirmed actionable, or closed as no-action |
| Claim | The author claims the ticket so concurrent agents back off. See the claim protocol below. | `om-fix` / `om-auto-create-pr`, or a human | Claim visible on the ticket |
| Design | For a user-facing change, the flow and its states are settled before the code exists: what the screen does when empty, loading, in error, and without permission, and what the change deliberately does not do. Detailed screens may be designed from the specification with repository components; only an accepted version becomes its `Prototype:` reference. A ticket that touches no UI skips this stage. | `om-ux-shape`, optionally `om-ux-design` when chosen, or a human designer | The flow and its states are decided, or the ticket is not user-facing |
| Implement | Locate the minimal change surface (`om-root-cause`, read-only), then implement the change with regression tests and run the validation gate. Task briefs without a ticket go through `om-auto-create-pr`, which plans, implements phase by phase in an isolated worktree, and runs the same gate. | `om-root-cause` + `om-fix`, `om-auto-create-pr`, or a human author | Change complete, validation gate green |
| PR | Commit, push, and open a PR against `main` with normalized labels. On a hand-worked branch, `om-check-and-commit` runs the gate, fixes obvious drift, and pushes when green. | `om-open-pr`, `om-auto-create-pr`, or `om-check-and-commit` | Open, labeled PR |
| Review loop | The reviewer reads the diff against the `om-code-review` checklist and approves or requests changes. Requested changes are addressed (`om-auto-continue-pr` resumes agent PRs from the tracking plan, and adopts a PR that has none by reconstructing the plan from the PR's own context) and the PR is re-reviewed until approved. A user-facing change also gets a design pass: `om-ux-review-pr` walks the changed screens and reports findings ranked by user impact. That pass is advisory — it informs the review, it does not hold the merge. | `om-auto-review-pr` (single PR), `om-review-prs` (sweep), `om-ux-review-pr` (design pass), or a human | Approving review submitted |
| QA | A PR carrying `needs-qa` waits for QA. The reviewer boots the app once with `om-prepare-test-env`, walks the change in a real browser with `om-auto-qa-pr` — which attaches screenshots and a pass/fail report and touches no labels by default — and records the outcome. A flow worth keeping becomes `om-integration-tests` coverage. See the QA gate below. | QA reviewer, with `om-prepare-test-env`, `om-auto-qa-pr`, `om-integration-tests` | `qa-approved` applied by a QA reviewer or the permitted self-QA exception; `qa-failed` routes it back |
| Merge | `om-merge-buddy` reports, read-only, which PRs can merge now and which are close but blocked. `om-approve-merge-pr` re-checks every gate, approves, and squash-merges. `om-auto-merge-triage` proposes candidates for `automerge`, and labels those a human confirms. `om-auto-merge-buddy` works the PRs a human labeled `automerge` unattended until the three automerge signals hold, then marks them ready or squash-merges them. | `om-merge-buddy` + `om-approve-merge-pr`, `om-auto-merge-triage` + `om-auto-merge-buddy`, or a human | PR squash-merged into its current target branch |
| Post-merge housekeeping | Close issues the merged PR fixes; comment on issues whose PRs were closed without merging; turn leftover asks or review comments into tracked follow-up issues. | `om-close-fixed-issues`, `om-followup-issue-from-pr` | Tracker reconciled, follow-ups filed |

After merge, this process stops. Deployment, smoke tests, monitoring, and rollback belong to the repository's release process, not to this document: the Maintainer — or a release manager, when the team names one — drafts the changelog with `om-auto-update-changelog` and reconciles the tracker with `om-close-fixed-issues`, and `om-pipeline-retro` reads finished runs to rank what second passes cost. Merge is where this document ends; delivering the change to users is a separate process the team owns.

## Categories

Every issue carries exactly one category label. The intake category is provisional until a human confirms it in triage (§ Routes).

| Category | Use it for |
|---|---|
| `idea` | An incomplete need whose outcome or approach is not decided ("maybe we need…", "explore whether…"). If the expected outcome is stated, it is a `feature`. An idea starts no work. |
| `feature` | New capability with a decided outcome. It always goes through a spec. |
| `bug` | Behavior that differs from what was intended. |
| `refactor` | Restructuring code or skills, with no behavior change. |
| `documentation` | A docs-only change. |
| `chore` | Maintenance with no behavior change: tooling, configuration, CI, repository housekeeping. It is an issue category only, so a PR for chore work carries `refactor`, or `documentation` for a docs-only change. |
| `security` | A vulnerability or hardening. It follows the bug route. |
| `dependencies` | A third-party version bump. It follows the small-task route. |

Tie-breakers:
- A version bump of a third-party package is `dependencies`, not `chore`.
- A docs-only change is `documentation`.
- A restructuring is `refactor`.
- When unsure between `idea` and another category, choose `idea`.

Intake and triage learn `idea` and `chore` through the repo-local extensions of `om-prepare-issue` and `om-auto-manage-issues`.

## Routes

Work is issue-first: it starts from a categorized issue, except a trivial change. **[H]** marks a human decision or a command a human runs. Readiness never starts work; a human command does. "Triage" means `om-auto-manage-issues <n>`: implementation-prep notes are on by default for a single issue, and `--no-prep` turns them off.

| Category | Route (native commands) | Readiness before the next command | Do not use |
|---|---|---|---|
| **idea** | **[H]** optional `om-brainstorm` → **[H]** `om-prepare-issue --no-spec "<goal> — brief: <path>"` → triage with `--no-prep` → **[H]** re-categorize (then re-run triage) or close | not checked for start: an idea starts no work. The not-ready comment lists what it needs to become actionable. | any spec or implementation command |
| **feature** | **[H]** `om-prepare-issue --no-spec` → triage → **[H]** spec PR (§ Design acceptance) → **[H]** `Status: Accepted` + merge → **[H]** choose one: **backlog** (`om-backlog <spec> --dry-run`, confirm, `om-backlog <spec>`, commit `backlog.md`, then items), **direct** (comment `Accepted spec: <path>` on the issue, then `om-auto-implement-spec <n>`), or **phased direct** (one `om-auto-create-pr` per phase, see below) | issue `ready` before the spec step; spec backlog-ready (§ Definition of Ready) before `om-backlog` | `om-auto-fix-issue` (chains spec into implementation); `om-prepare-issue` without `--no-spec`; triage with `--write-missing-specs` |
| **backlog item** (story or task from `om-backlog`) | **[H]** assign yourself → **[H]** run the command in the item's `## ▶️ Start` section (the backlog-item brief), in `Depends on` order → review → **[H]** merge. GitHub closes the item through `Closes #<item>`. | the item carries acceptance criteria and its parent spec | `om-auto-fix-issue`, `om-auto-implement-spec`, `om-auto-create-pr --spec`, or any brief naming the parent spec (each would implement the whole parent spec) |
| **bug** (and **security**) | **[H]** `om-prepare-issue --no-spec` → triage → **[H]** `om-auto-fix-issue <n>` (native bug chain, opens the PR), or `om-fix-issue <n>` (staged), then **[H]** `om-open-pr <n> bug` in the emitted `WORKTREE` | reproducible: `om-verify-in-repo` inside the chain | — |
| **refactor / documentation / chore** (and **dependencies**), small | **[H]** `om-prepare-issue --no-spec` → triage → **[H]** assign yourself → **[H]** `om-auto-create-pr` with the task brief template | issue `ready` | `om-auto-fix-issue` (runs the bug chain) |
| **refactor / documentation / chore**, large | triage → **[H]** comment "needs a spec (large)" on the issue → as feature, from the spec PR onwards | as feature | as feature |
| **trivial change** | **[H]** `om-auto-create-pr "<task>"` with no issue. The PR carries `documentation` or `refactor`, plus `skip-qa`. | — | — |

**Rules:**
- **Category at intake.** `om-prepare-issue` labels the issue at creation, and triage never changes an existing label. In triage the human confirms the label, or re-categorizes in the GitHub UI by removing it and adding the new one. Then re-run triage.
- **Size.** Small or large is the human's call in triage. The change is large when it is not small, local, and obvious from its description. The command the human runs records the decision. A large refactor, documentation, or chore gets no native spec-required comment, so the human writes one.
- **Direct route means one PR.** `om-auto-implement-spec` ships the whole spec on one PR. A spec whose phases must merge one after another uses the backlog route or the phased direct route.
- **Phased direct route.** The human runs one `om-auto-create-pr` per phase, with that phase's steps in the brief and no `--spec`. Intermediate phase PRs carry `Refs #<n>`, and the last phase PR carries `Closes #<n>`. Each phase starts after the previous one merges.
- **Brainstorm shortcuts.** Ramps 3 and 5 of `om-brainstorm` start a spec or a PR without an issue. Use them only for trivial changes. Otherwise, file the issue first with ramp 2.
- **Claims.** `om-auto-create-pr` claims only its PR. Before starting a backlog item or a small task, the human assigns the issue to themselves, so that two runs never take the same item.
- **Autofix queue.** It takes bugs only (§ Human-confirmed issue autofix queue).
- **`backlog.md`.** `om-backlog` updates `.ai/specs/backlog.md` but does not commit it. The human commits it through the trivial path, or by hand on a docs branch.
- **Next-step hints.** The repo-local extensions make the hints OM prints follow this table. When a hint and this table disagree, this table wins.

**Backlog-item brief template.** `om-auto-create-pr` takes only a brief and cannot read the issue. A brief that names a spec makes it implement that spec. The brief therefore carries everything it needs and never names the parent spec. `om-backlog` writes this brief, filled in, into each story and task under `## ▶️ Start`:

```text
om-auto-create-pr "Implement backlog item #<n> (<id> — <title>) and only this item.
Acceptance criteria (from #<n>):
<criteria>
Scope: this item only. Do not implement other items or the rest of the parent design, and do not set a Source doc.
The PR body must contain: Closes #<n>"
```

**Task brief template** (small refactor, documentation, chore, or dependencies):

```text
om-auto-create-pr "Implement #<n> (<title>), small change, no spec.
What is wanted and how it is checked (from #<n>):
<problem, expected outcome, check>
Out of scope: <from #<n>>
The PR body must contain: Closes #<n>"
```

Source: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (decisions D1–D20 in `.ai/specs/briefs/2026-11-11-issue-first-sdlc.md`).

## Definition of Ready

A ticket is ready for implementation when the answers below are on the ticket or in a spec it links. They come in two tiers, because a spec can supply the second but never the first.

**Ticket-level — only a human can supply these:**

- the problem or need, and who has it (a user or a role);
- the expected outcome, and how it will be checked;
- what is out of scope;
- open questions, each marked blocking or non-blocking — no blocking question left unanswered;
- any autonomous assumption confirmed by a human (the resolved-assumptions comment on a spec PR).

**Spec-level — a covering spec supplies these, and `om-auto-write-spec` writes them when they are missing:**

- acceptance criteria;
- business rules;
- the happy path and the main unhappy paths;
- impact on data and permissions;
- dependencies;
- a link to the prototype or mockups when the change is user-facing.

For a bug, ready means reproducible: `om-verify-in-repo` is that gate, and the list above applies only to its ticket-level items. Enforcement: `om-prepare-issue` files tickets with these sections; `om-auto-manage-issues` records `READY_STATUS` per issue and posts a not-ready comment naming what is missing; `om-auto-fix-issue`'s feature route stops on a ticket that fails the ticket-level tier instead of speccing around the gap, the way `om-verify-in-repo` stops on a bug that is not real. Spec-level gaps are not a stop — the spec is authored. A maintainer may waive an item by saying so on the ticket. This section is what those skills read: a repository whose `SDLC.md` has no Definition of Ready gets no readiness check.

The enforcement sentence above describes native behavior. § Routes decides which command to run.

**Per-category minimums.** The ticket-level tier above applies to every category. These notes say what an item means for a category; they never remove an item.

| Category | Ticket-level minimum (in addition to the tier above) |
|---|---|
| idea | Problem and who has it. An expected outcome is not needed to file, but it is what makes the idea actionable. |
| feature | The tier in full. The spec supplies the spec-level tier. |
| bug, security | Reproducible (`om-verify-in-repo`). The rest of the tier applies only to its ticket-level items. |
| refactor, documentation, chore, dependencies | The tier in full. The expected outcome includes the size the human chose. |
| spec, as an `om-backlog` source | The Problem Statement names who has the problem, with its source tier. Out-of-scope items name an owner role. The decisions it relies on are recorded. `om-backlog` has no waiver, so a spec must meet this before the backlog step. |

The "ready as is" waiver applies to issues only, through `om-auto-manage-issues`.

## Design acceptance

A spec is accepted when a human sets `Status: Accepted` in it and merges the design-only spec PR into `main`. Who may approve and merge is decided by GitHub permissions and policies.

- **Spec PR by agent:** `om-auto-write-spec <n>`. It opens a ready PR labeled `review`, `documentation`, and `skip-qa`, with `Refs #<n>`.
- **Spec PR by hand** (after `om-spec-writing`):
  1. Create a branch `docs/spec-<slug>` from `main`.
  2. Keep only the spec, and its brief when there is one, in the working tree. `om-open-pr` runs `git add -A`.
  3. Run `om-open-pr <n> documentation --draft` in the same session, so its previous-step summary exists. For a spec-only PR it writes `Refs #<n>`.
  4. Mark the PR ready before merge.
- The `om-spec-writing` template writes no `Status:` line. The human adds `Status: Draft` when opening the spec PR, and changes it to `Accepted` before merge.
- Automation never sets `Status:` on its own initiative, and never inside a review autofix.
- **Acceptance on explicit instruction.** An agent may write `Status: Accepted` only when a human explicitly instructs it. The change goes on its own PR, which changes only the `Status:` line and records the instruction in its body. The human's merge of that PR is the acceptance. This PR is also the repair path when a spec PR merged without the status line.
- Under the human's own GitHub login, "set by a human" cannot be verified. This is an accepted limit of a convention-based process.

## Milestones

1. **Design accepted:** the spec PR is merged with `Status: Accepted`. The source issue stays open, because spec PRs use `Refs`.
2. **Child items complete** (only when a backlog was chosen): every story and task of an epic is closed, and a human closes the epic.
3. **Source complete:**
   - **With a backlog:** every epic whose `Backlog source:` is the accepted spec's path is closed, and a human closes the source issue.
   - **Direct:** the PR from `om-auto-implement-spec <n>` closes the source issue on merge.
   - **Phased direct:** the last phase PR closes the source issue on merge.

## Label state machine

Pipeline labels are mutually exclusive: a PR carries at most one, and it names where the PR sits in the flow.

- A ready, non-draft PR carries `review`.
- The reviewer moves it: request changes → `changes-requested`; after fixes it returns to `review`; approval → `merge-queue`.
- `merge-queue` is routing, not proof of QA: a `needs-qa` PR legitimately sits there until QA signs off.
- Only a QA reviewer sets the `qa` pipeline label. They move a queued `needs-qa` PR from `merge-queue` to `qa` while testing, then back to `merge-queue` with `qa-approved` on pass, or to `qa-failed` on failure. Automated skills request QA with `needs-qa`; they never set `qa`.
- `blocked` and `do-not-merge` are set and cleared by humans and stop the flow wherever it is.

| Group | Labels | Exclusivity | Meaning |
|---|---|---|---|
| Pipeline | `review`, `changes-requested`, `qa`, `qa-failed`, `merge-queue`, `blocked`, `do-not-merge` | one at a time | Workflow state |
| Category | `idea`, `feature`, `bug`, `refactor`, `documentation`, `chore`, `security`, `dependencies` | additive | Kind of change |
| Meta | `needs-qa`, `skip-qa`, `qa-approved`, `qa-self-verified`, `in-progress`, `claim-reset`, `ci-monitoring` | additive | Process signals |
| Priority | `priority-low`, `priority-medium`, `priority-high`, `priority-extreme` | one at a time; unset = medium | Urgency of the work |
| Risk | `risk-low`, `risk-medium`, `risk-high` | one at a time; unset = medium | Blast radius of the change |

Priority is how urgent the work is; risk is how dangerous the change is to ship. A one-line fix for an outage can be `priority-extreme` and `risk-low`; a large auth refactor that can wait can be `priority-low` and `risk-high`. A PR inherits both from its source issue unless the scope clearly changed. When an automated skill adds or changes a pipeline or meta label, it leaves a short comment explaining why.

When no priority label is set, infer one:

- `priority-extreme` — production outage, data loss, or an active security incident.
- `priority-high` — security hardening or a release-blocking regression.
- `priority-medium` — ordinary bug fixes and net-new features (also the default reading of unset).
- `priority-low` — cosmetic, docs-only, dependency bumps, follow-up cleanup.

When no risk label is set, infer one:

- `risk-high` — authentication and login sessions, data scoping, money, schema migrations, shared contract surfaces, or broad cross-cutting edits.
- `risk-medium` — an ordinary single-area change that ships with tests (also the default reading of unset).
- `risk-low` — docs-only, test-only, typo, or isolated cosmetic changes.

When signals conflict, pick the higher label and say why in the label comment. A `risk-high` PR is not merely advised to get more scrutiny; it triggers gates:

| Area behind `risk-high` | What the PR must carry |
|---|---|
| Auth, sessions, permissions | an integration test for the denied path and the wrong-scope read; a second person's review |
| Data scoping | an isolation test proving one scope cannot read another |
| Money | tests for the failure, retry, and idempotency paths; a second person's review |
| Schema migrations | a migration test up and down, and a rollback plan in the PR body |
| Shared contract surfaces | the consuming side exercised, per `BACKWARD_COMPATIBILITY.md` |
| Any `risk-high` | `needs-qa` when user-facing; no self-QA; `om-code-review` blocks without the evidence above unless a maintainer waives it on the PR |

Two labels live outside this taxonomy, and only humans decide them (the automerge signal labels below are applied only by `om-auto-merge-buddy`):

- `do-not-close` — on issues that housekeeping skills must never auto-close. Skills only ever read it.
- `automerge` — on a PR the human wants merged without further attention. A human applies it directly, or `om-auto-merge-triage` applies it to the PRs a human confirms from its ranked proposal (eligibility rules: `automerge.eligibility`). Its AI judgment prioritizes important fixes close to merge, inspecting older PRs with screenshots and requested changes. Requested changes must be bounded and pass that judgment before any tier can propose the PR; review, QA and CI remain required. `om-auto-merge-buddy` works these PRs one at a time within a time window (default 2 hours). It resumes due tracked work from local `.ai/meta/merge-buddy.json`, prefers current-user assigned actionable work when tracking is nonempty, and assigns/verifies the current user at the first actionable step. Empty/reset scheduling keeps the global queue; live `in-progress` claims remain protected. Readiness is three signals, each recorded as a label that only this skill applies:
  - `automerge-signal-1-cr` — `om-auto-review-pr` approved the current head; independent native approval is additional only when the resolved policy requires it.
  - `automerge-signal-2-qa` — QA is not required (`skip-qa`, or no `needs-qa`), or `qa-approved` is pinned to the current head by its `QA head:` line. Only `om-auto-qa-pr` may apply it through self-QA, on `risk-high` only under the explicit invocation-scoped risk override below.
  - `automerge-signal-3-ci` — every check on the current head finished green, with no conflicts.

  On its first visit to a PR, when no signal is recorded yet, the buddy derives the initial signals from the PR's real state: its labels, reviews and comments, and its CI checks on the current head. It then starts from the first signal still missing, so review, QA or CI work already done is not repeated. A missing signal is produced by `om-auto-review-pr --autofix`, `om-auto-qa-pr`, or `om-auto-fix-pr`, each run with `--orchestrated` so the buddy alone owns the claim and the labels. CI that is still running is parked under `ci-monitoring` and checked again later. A PR that cannot be fixed within the attempt limit is parked under `automerge-blocked`; remove that label to retry. A fork PR is carried forward to a credited replacement that keeps the label. In `prepare-to-merge` mode, a PR with all three signals gets `merge-queue`. In `prepare-and-merge` mode (the missing-config default) it is squash-merged, bypassing other labels and host merge rules, because the three signals are the gate. Removing `automerge` stops the automation.

Mode and independent review come from `.ai/agentic.config.json`:
`automerge.mode` defaults to `prepare-and-merge`, and
`automerge.requireIndependentReview` defaults to `false`. Explicit `--mode`,
`--require-independent-review` or `--skip-independent-review` override current
config; conflicting review flags/invalid values stop. Automatic code review and
actionable inherited objections remain required. Default mode does not wait
for native approval or a stale requested-changes state after objections are
resolved. Strict policy needs fresh nonauthor/nonautomation human native
approval on the current head before either prepare mode finishes, with no
newer standing requested-changes verdict; missing approval waits without
repeating automated stages or consuming attempts. Recheck policy/evidence at
every entrance and final guard; saved status/scheduler policy is never authority.
Standalone skills keep their existing review gates. `automerge.defaultToHumanQa`
defaults false: missing mandatory local QA approval/testable gaps schedule real
`om-auto-qa-pr --orchestrated` for coverage/legitimate self-sign-off, reusing
current covered evidence. True prefers human approval; explicit `--human-qa` or
`--auto-qa` overrides config. Only verified ineligibility/blockers or explicit
human routing wait for a human; no preference fabricates approval labels.

### Explicit automerge risk override

`om-auto-merge-buddy --force` records the operator’s explicit exception on the
PR and run for this invocation only. It waives the risk-high integration-evidence
requirement and risk-high self-QA exclusion; the QA skill must still complete
real verification, attach screenshots and pin its sign-off to the tested head.
Full review, actual correctness/security findings, the configured validation
gate, required QA, CI, conflicts and the merge head guard remain. It does not
change risk labels or authorize claim takeover. The buddy passes the separate
`--skip-risk-checks` flag to orchestrated stages. Without `--force`, even on
resume, strict gates apply and override-derived review/QA approvals cannot be
reused as ordinary approvals. Standalone skill defaults are unchanged.

The independent `--skip-pre-existing-ci-errors` flag permits only an individual
completed CI failure proved identical on the exact current target SHA, using
matching workflow/job context, unchanged relevant CI definitions and actual
matching diagnostic/root cause. Record both runs, SHAs and the proof; pending,
new, unreadable or unknown failures are not waived. The flag is invocation-only,
never enabled by `--force`; later strict runs and target advances/reruns require
fresh CI evaluation. A waived failure stays visibly failed, not green. Local
validation and all other gates remain unchanged.

For human-authorized automerge PRs, signal 2 also accepts a trusted completed
`om-auto-qa-pr` PASS on the unchanged head, independently of manual-approval
labels or self-QA eligibility, including evidence-only and risk-high reports
with disclosed coverage limitations. Trust requires same-author starter,
report and completion history from an account with write access; resolve legacy
short `Verified` SHAs uniquely to the exact current head. Keep limitations
visible, add no `qa-approved`/`qa-self-verified`, and skip duplicate QA attempts.
Newer trusted FAIL, revocation/deletion or head changes invalidate this evidence.
This automerge signal exception leaves standalone QA and other merge skills'
manual-approval gates unchanged.

## The QA gate

The one hard rule of this process: **a PR carrying `needs-qa` must not merge until it also carries `qa-approved`, even when every other check is green.** `om-merge-buddy` classifies such a PR as blocked; `om-approve-merge-pr` refuses to merge it.

- Apply `needs-qa` to UI changes, new features, and other user-facing behavior that needs manual exercise.
- For a UI change, QA covers more than "it works": the state matrix (default, empty, loading, error, no-permission, long content, narrow viewport) is part of the pass/fail, and so is conformance to the design contract in `.uxproof/` when the repository has one. A missing state fails QA. `om-ux-review-pr` remains the advisory design review; its objective checks are the ones QA runs.
- `skip-qa` is the explicit opt-out for docs-only, dependency-only, CI-only, test-only, and similarly low-risk non-user-facing changes. Never combine it with `needs-qa`.
- `qa-failed`, `do-not-merge`, and `blocked` are hard blocks regardless of every other signal. An active `qa` pipeline label means a tester is on the PR right now — never merge under an active tester.
- The gate is satisfied when a QA reviewer tests the PR and applies `qa-approved`.
- **`qa-approved` is pinned to a commit.** The comment that grants it — the QA reviewer's note, or the self-QA evidence comment — carries the line `QA head: <sha>` for the head that was tested. A push after that line leaves the label in place but stales it: `om-merge-buddy` reports "QA evidence older than head", and `om-approve-merge-pr` asks for confirmation before merging. The way back is a QA reviewer re-testing, or stating on the PR that the new commits do not touch the tested scope, with a fresh `QA head:` line.
- **Self-QA exception**: when no QA reviewer has capacity in time, any engineer — or `om-auto-qa-pr --self-qa-signoff` — may sign off instead, on a `risk-low` or `risk-medium` PR only. The evidence attached to the PR names the scenario exercised, the environment, the test data, the observed result, the negative cases tried, and the `QA head:` line. Then apply both `qa-approved` (so the gate passes) and `qa-self-verified` (so the exception is auditable). No evidence, no `qa-approved`.
- **No self-QA on `risk-high`.** A PR labeled `risk-high`, or one whose diff touches auth, sessions, data scoping, money, schema migrations, or shared contracts (the `risk-high` inference above), needs a QA reviewer, or a maintainer's explicit exception stated on the PR; `om-auto-qa-pr` withholds the sign-off on such a PR and posts the evidence only. A change to auth or money also needs a second person's review regardless of the QA path.

## The claim protocol

Before mutating an issue or PR, read **get-lock** as well as assignees, `in-progress` and live claim comments. GitHub, GitLab and Forgejo use atomic **acquire-lock**: create the descriptor's reserved ref exactly once, pointing to a unique metadata commit carrying the owner/run/item. Only that creator proceeds. Same-login bots still compete; an existing ref blocks even before comments or labels exist. The winner retains a claim comment with legacy prefix plus `Claim-Run`, `Claim-Actor`, `Claim-State`, `Claim-Lock` and `Claim-Lock-SHA`. Claim/comment ids are additional audit evidence. Assign when supported, then verify `in-progress` as the mandatory second check; confirmed unassignable bots omit only assignment.

Only trackers explicitly lacking an atomic primitive use comment-first election: fresh complete reads select the lowest live creation-order candidate, and losers withdraw their own candidate without labels or work. Git-host permissions, API or transport failures and missing operations block acquisition; never silently downgrade GitHub/GitLab/Forgejo to comment mode. Linear/Jira issues retain comment election; their GitHub PRs delegate atomic operations. Upgrade installed claimers/descriptors together. Non-atomic providers retain safe complete-list/edit fallback for older descriptors.

Chains pass the same run id, comment id and exact lock SHA and retain ownership through handoffs. Before each phase/mutation/publication re-read ownership and reset history. At completion, clean only owned labels/assignments, mark the original comment released, then **release-lock** last. Git hosts delete through an explicit expected-SHA Git lease, so delayed cleanup cannot delete a successor. This is metadata housekeeping, not publication of staged project work.

**Recover in the GitHub UI:** stop the stalled runner and delegated workers, then add the human-only `claim-reset` label. The next invocation audits the human label event and conditionally retires only the exact old lock whose server creation time predates it. Recovery still competes for a new create-only lock; a changed SHA stops recovery. Removing `in-progress` alone does not clear a lock. The label may remain as a breadcrumb; remove/reapply for a later reset. Historical resets survive label removal. Reset/stale/force recovery never waives live local leases, QA or merge gates and cannot cancel a command already executing. Non-GitHub issue providers without an audit report unsupported UI recovery.

GitHub/Forgejo reserve `refs/om-locks/{kind}-{number}`; GitLab reserves `refs/heads/om-locks/{kind}-{number}`. GitLab/Forgejo have no authenticated ref-creation timestamp (`createdAt: null`); client `metadataCreatedAt` never authorizes time-based/UI recovery. Those paths block without a server audit; explicit force still requires stopped workers and exact-SHA deletion. Lock pushes may trigger CI/hooks; reserve/filter their namespaces through reviewed repository policy.

Normal Git-host acquisition is atomic; recovery relies on correct liveness decisions and cooperative boundary checks. Comment fallback retains an eventual-visibility race that can duplicate work. See the tracker contracts for **get-lock**, **acquire-lock**, **release-lock**, **get-claim-reset**, **claim-winner** and **withdraw-claim**.

`in-progress` means **actively working**. Once an agent's work is finished and fully reported — labels applied, review submitted, comments posted — it swaps `in-progress` for `ci-monitoring` if it still intends to report the CI outcome. `ci-monitoring` is **not** a claim and blocks nobody: it says only that the CI-result follow-up comment is still owed, so another agent or a human may act on the PR freely. That distinction matters because CI runs long: an agent that reported its work and then died while watching a run leaves an honest, self-describing state instead of a lock nobody holds. The label comes off when the follow-up lands, or when the agent gives up waiting at `ci.maxWaitMinutes` and says so.

The claim is released when the work finishes — on success and on failure alike. A stale `in-progress` with no recent activity may be cleared by the maintainer.

### Reporting is decoupled from CI

Agents apply labels, submit reviews, and post comments **as soon as their work is done**, without waiting for CI to go green. A review submitted while checks are still running says so in its body: branch protection plus the QA-approval gate hold the actual merge, and the approval covers the code, not a green run. The CI outcome arrives afterwards as a follow-up comment, which also corrects the pipeline label if the result changes the verdict.

The wait for that outcome is bounded by `ci.maxWaitMinutes` (default 40). When it expires with checks still running, the agent stops waiting, runs the local validation gate as its own evidence, posts that together with the still-pending check names and an explicit statement that no further follow-up is coming, drops `ci-monitoring`, and finishes.

A red signal does not short-circuit the review either. A failing required check or a conflicted head is collected as a **blocker finding** and reported together with the full code review, never instead of it: one review cycle gives the author the failing check, the conflict, and every code finding at once, rather than the cheapest red flag first and another cycle to discover the rest. Such a verdict is still `changes-requested` — completeness changed, the gate did not.

None of this touches the merge gates. Reporting early is safe; merging early is not — required checks still gate every merge, and the merge tooling refuses until they are genuinely green.

## The automation contract

The `om-auto-*` skills run this process unattended and are chainable: each accepts the artifact the previous one produced (an issue id, a spec path, or a PR number from the `PR: #<number> (link: <url>)` reference line every PR-producing skill emits), and each detects work already started — an open PR referencing the issue or plan — and continues on it rather than opening a duplicate. A completed autonomous run leaves a **ready** (non-draft), fully labeled PR — one pipeline label, category, QA meta, one priority, one risk — with a run-summary comment and, for user-facing changes, screenshots from the working app attached as PR evidence. Draft PRs are reserved for explicitly incomplete states: spec-only design PRs, interrupted hand-offs, or autonomous defaults flagged for human confirmation. Automation applies `qa-approved` only through the self-QA exception (`om-auto-qa-pr --self-qa-signoff`, always paired with `qa-self-verified`, on `risk-high` only under the explicit invocation-scoped risk override below); no authoring, review, or merge skill ever applies it.

## Validation gate

Every PR passes the full validation gate before review sign-off, in this order:

- `node -e "JSON.parse(require('fs').readFileSync('.ai/agentic.config.json','utf8'))"` — the pipeline config parses as JSON (docs-only repository; extend when code lands)

Any non-zero exit fails the gate and blocks the PR. The implementing skills run the gate before opening a PR, and `om-check-and-commit` runs it before pushing a hand-worked branch. The command list lives in `.ai/agentic.config.json`; when it changes, update it there and in this section together.

## Amending this process

This document and `.ai/agentic.config.json` describe the same process: change them together, and re-run the `om-setup-agent-pipeline` skill when the toolchain or label taxonomy changes.

The design contract the Design and Review stages read is set up once: `om-ux-setup` extracts it from the repository and is re-run when the design system changes.

Per-skill deviations — extra review rules, a different PR body template, an added gate step — belong in a repo-local skill of the same name at `.ai/skills/<skill-name>/SKILL.md`, which takes precedence over the installed skill (and can `@`-import or reference it to extend rather than replace it); local rules win, but a repo-local skill cannot grant what the installed skill's safety rules forbid.

## Human-confirmed issue autofix queue

`om-auto-issue-triage` proposes useful open issues with decided scope and bounded
work. It applies `autofix.label` (default `cez-autofix`) only to issues a human
confirms after seeing evidence. It skips active/uncertain claims, preserves
assignees, rechecks current state and verifies label read-back. The label may
trigger the repository's existing worker; this skill does not install or invoke
one. Implementation remains `om-auto-fix-issue` or the existing worker, with all
normal specification, code-review, QA and CI gates unchanged.
