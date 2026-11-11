# Issue-First SDLC Adaptation (OM)

Status: Draft
Source issue: #1
Source brief: `.ai/specs/briefs/2026-11-11-issue-first-sdlc.md` (decisions D1–D18)
Analysis: `.ai/analysis/2026-11-11-issue-first-sdlc-analysis.md`
Reviews:
- `.ai/analysis/2026-11-11-issue-first-sdlc-spec-review.md` (gate-enforcing draft);
- `-spec-review-2.md` (v2);
- `-spec-review-3.md` (v3, addressed here).

Backlog-readiness check: `.ai/analysis/2026-11-11-om-backlog-dry-run.md`

## 📝 TLDR

Contributors need one clear route for each issue category (idea, feature, bug, refactor, documentation, chore), so that not every change goes through the same heavy spec-and-backlog process.

**Proposed (future behavior):** `SDLC.md` documents every category: its readiness minimum, its route, and its milestones. Each route is written as the **native OM commands a human runs**, in order, with the human decisions between them.

OM stays native. Three small changes only add rules or native filter values:
- (A) intake and triage learn the categories `idea` and `chore`;
- (B) the next-step hints OM prints follow the route table instead of always naming `om-auto-fix-issue`;
- (C) the autofix queue excludes every category except bugs, through its native filter.

Issue-first is the default: work starts from a categorized issue, except for trivial changes.

## 📝 Problem Statement

The team does not separate four things: capturing a need, authorizing the next activity, accepting a design, and implementing bounded work (brief, Problem Statement). For this repository specifically:

- `SDLC.md` names categories, but it has no route per category and no Definition of Ready. Readiness is therefore never checked: `om-auto-manage-issues` reports `READY_STATUS = n/a` (`om-auto-manage-issues/references/enrich-existing-issue.md:108-112`). `[PRODUCT]`
- `idea` and `chore` exist as labels but are unknown to OM. Intake and triage infer a category only from a fixed six-item list (`om-prepare-issue/SKILL.md:64`, `enrich-existing-issue.md:30-31`). `[PRODUCT]`
- No document maps a category to a native command. For some categories, the entry point that OM itself advertises, `om-auto-fix-issue`, is the wrong one. `[PRODUCT]`
  - For a feature, it chains spec writing straight into implementation (`om-auto-fix-issue/SKILL.md:49`).
  - For refactor, documentation, and chore, it runs the bug chain (`SKILL.md:40-43`).
  - On a backlog story, it implements the whole parent spec.
  - It is suggested in five places:
    - the issue body (`om-prepare-issue/SKILL.md:56`);
    - `om-backlog`'s `Next:` line (`om-backlog/SKILL.md:45`);
    - the not-ready comment (`enrich-existing-issue.md:139`);
    - the implementation-prep comment (`om-auto-manage-issues/references/implementation-prep.md:60`);
    - `om-brainstorm` ramp 6 (`om-brainstorm/SKILL.md:49`).
  - The autofix queue admits features and maintenance work (`om-auto-issue-triage/SKILL.md:15`).

**Who has it:** two groups.
- The OM team's contributors, who choose a command for an issue.
- Its maintainers, who review the result.

Sources: the team's own brief (`[DOCUMENT]`) and the repository files above (`[PRODUCT]`). No incident is recorded yet. The cost is inferred from the native behavior cited above.

**Out of scope** (owner: Maintainer):
- rollout planning;
- skill-install cleanup and `skills-lock.json` changes;
- event-driven execution;
- merging without a human-applied `automerge` label;
- product implementation;
- workbooks;
- changes to how spec corrections are handled during a backlog (native);
- routes for `security` and `dependencies` beyond the default mapping in § Routes.

## 📝 Proposed Solution

**Principle: minimal intervention in OM (D12).** There are no new gates and no change to how OM skills chain. Routes are conventions a human follows by choosing the native command. The extensions only add rules, as the override contract allows (`om-setup-agent-pipeline/references/agentic-setup.md:69`).

1. **`SDLC.md`: process contract.**
   - § Categories;
   - § Routes;
   - § Definition of Ready, with per-category minimums;
   - § Design acceptance;
   - § Milestones;
   - § Trivial changes;
   - reconciliation of the existing passages that contradict these sections (Phase 1, step 4).
2. **Extension A: categories.** In `.ai/skills/om-prepare-issue/SKILL.md` and `.ai/skills/om-auto-manage-issues/SKILL.md`.
3. **Extension B: next-step hints (D13, D18).** In the same two files, plus `.ai/skills/om-backlog/SKILL.md` and `.ai/skills/om-brainstorm/SKILL.md`.
4. **Config C: autofix queue (D17).** Add `idea`, `feature`, `refactor`, `documentation`, and `chore` to `autofix.eligibility.excludeLabels`, by re-running `om-setup-agent-pipeline`.
5. **`CODE_REVIEW.md`: three repo-specific checks.**
   - A spec's status is changed only by a human.
   - A spec PR references its issue (`Refs`) and does not close it.
   - A backlog-item PR closes its item.
6. **`AGENTS.md`:** a pointer to § Routes, and the note that non-OM skills are not used for SDLC work. The `jq` prerequisite is already there.
7. **Unchanged:**
   - vendored skills, `skills-lock.json`, chaining, stop tokens, and output formats;
   - labels;
   - merge authority and automerge (D3);
   - the QA gate;
   - who may approve and merge (GitHub);
   - PR category labels: `chore` work gets `refactor`, or `documentation` for a docs-only change (D14).

### Extension files: common header

Each of the four files starts with:

```markdown
# <skill name>: repo-local extension

Installed skill: `.claude/skills/<skill name>/SKILL.md`. Read it and apply it unchanged. This file only adds the rules below; where they do not apply, the installed skill's behavior stands.
```

### Extension A: exact text

Both files carry this block. In `om-auto-manage-issues` it extends the **Category** bullet of `enrich-existing-issue.md` § 2. In `om-prepare-issue` it extends the category bullet of step 5.

```markdown
## Category list (adds two values)

The category list is `idea`, `feature`, `bug`, `refactor`, `documentation`, `chore`, `security`, `dependencies`. Every native rule still applies: add exactly one category label when none is present, never replace an existing one, and keep the label guards of `.ai/trackers/github.md`.

- `idea`: an incomplete need whose outcome or approach is not decided ("maybe we need…", "explore whether…"). If the expected outcome is stated, it is a `feature`.
- `chore`: maintenance with no behavior change, such as tooling, configuration, CI, or repository housekeeping. Tie-breakers: a version bump of a third-party package is `dependencies`; a docs-only change is `documentation`; a restructuring of code or skills is `refactor`.
- When unsure between `idea` and another category, prefer `idea`, because it starts no work. The category is provisional until a human confirms it in triage (`SDLC.md` § Routes).
```

### Extension B: exact text

Each file carries the shared rules and only its own location rules.

```markdown
## Next-step hints (route-correct)

Shared rules:
- Change only the suggested next step. Chaining, gates, label rules, the `Issue:`/`Spec:`/`PR:` lines, and output formats stay as in the installed skill.
- Never run a suggested command.
- A `Next:` line is one line, either `Next: none` or a command that can be run exactly as written, with every `<n>` replaced by a real number. Never emit a placeholder or a multi-line brief in a `Next:` line.
- An issue is a **backlog item** when its body has `Backlog source:` and an `Epic:` or `Story:` line. This rule wins over the category label. An issue with `Backlog source:` and neither line is an **epic**: it gets no command.
- `bug`, `security`, and `dependencies` keep the native hint.
```

Location rules, one block per file:

```markdown
### om-prepare-issue
- Issue body: where the native body suggests `om-auto-fix-issue <n>`, write: "Next: triage (`om-auto-manage-issues <n>`), then the `<category>` route in `SDLC.md` § Routes."
- Report `Next:` line: `Next: om-auto-manage-issues <n>`.
- When filing a backlog item for `om-backlog`, the body is the brief `om-backlog` handed over. Add no hint.

### om-auto-manage-issues
- Not-ready comment: replace the native ⛔ line with: "⛔ The next step for this issue (`SDLC.md` § Routes) waits until these are on the ticket. Add them here, or write "ready as is" to waive."
- Implementation-prep comment, `Next:` line, by category:
  - `feature`: `Next: om-auto-write-spec <n>`. The prose adds: "or `om-spec-writing` for a co-designed spec".
  - `refactor`/`documentation`/`chore`: `Next: none`. The prose adds: "Small: `om-auto-create-pr` with the task brief template in `SDLC.md` § Routes. Large: comment 'needs a spec (large)' and follow the feature route."
  - `idea`: `Next: none`. The prose adds: "A human re-categorizes or closes this idea."
  - Backlog item: `Next: none`. The prose adds: "Start it with the command in its body."

### om-backlog
- Story and task bodies: the brief handed to `om-prepare-issue` ends with a `## ▶️ Start` section holding the filled-in backlog-item brief template from `SDLC.md` § Routes. It contains this item's number, id, title, and acceptance criteria, and no spec path. Epic bodies get no Start section.
- Real-run `Next:` line: `Next: none`. The report adds: "Start each item with the command in its body, in `Depends on` order."
- Dry-run and readiness-stop `Next:` lines stay native.

### om-brainstorm
- Ramp 2: `om-prepare-issue --no-spec "<goal> — brief: <path>"`.
- Ramp 6: for a `bug`, `security`, or `dependencies` issue, keep the native line. Otherwise use `Next: om-auto-manage-issues <n>`. The `Issue:` line stays.
- Ramps 3 and 5 stay native. `SDLC.md` § Routes requires an issue first unless the change is trivial (D18).
```

### Alternatives considered

- **Gate extensions in five skills** (the first draft). Rejected: gates without a producer, ungated entry points, and collisions with vendored contracts. This option also contradicts D12.
- **Native hints plus a precedence rule** (review 2, Decision 2). Rejected by the human (D13).
- **Literal briefs in `Next:` lines.** Rejected. A brief that cannot carry the acceptance criteria either gets inferred from the parent spec or breaks the one-line contract (review 3). The filled-in brief goes into the story body instead.
- **Rewriting brainstorm ramps 3 and 5 to file an issue first.** Rejected (D18). These ramps are deliberate shortcuts, so a documented rule suffices.
- **A `SDLC.md`-only rule for the autofix queue.** Rejected (D17). The config would contradict the docs.
- **`om-setup-discovery-pipeline` for the Definition of Ready.** Rejected. It brings in the whole product layer.
- **Size labels, a backlog label, `chore` on PRs.** Rejected (D9, D10, D14).

### Research: how comparable processes split decisions

- **Rust and Python RFC processes:** a team decision accepts an RFC, and implementation is started and tracked separately (D1, D10).
- **Shape Up:** an explicit "bet" decides what gets built, and small fixes bypass shaping (D9, D7).
- **Linear and GitHub triage:** new issues get a category and priority in triage before anything else (D8, D15).

## 📝 Delta

### Capability: issue-categories

#### ADDED Requirement: Intake and triage recognize idea and chore
`om-prepare-issue` and `om-auto-manage-issues` SHALL be able to infer the categories `idea` and `chore`, in addition to the native categories. They SHALL still apply exactly one category label when none is present.

##### Scenario: Incomplete need filed
- WHEN `om-prepare-issue --no-spec` files "we probably need some way to track X, not sure how"
- THEN the issue is created with the `idea` category label

##### Scenario: Maintenance issue triaged
- WHEN `om-auto-manage-issues` processes an issue "tidy .gitignore and the agent-browser descriptor" with no category label
- THEN it applies `chore`, with the reason in its label-rationale comment

##### Scenario: Package bump is not a chore
- WHEN `om-prepare-issue --no-spec` files "bump agent-browser to the latest version"
- THEN the issue is created with `dependencies`, not `chore`

#### MODIFIED Requirement: Readiness is checked against the Definition of Ready
Once `SDLC.md` has `## Definition of Ready`, the native readiness behaviors SHALL turn on:
- `om-auto-manage-issues` records `READY_STATUS` `ready` or `not-ready` and posts the not-ready comment;
- the feature route of `om-auto-fix-issue` stops with `NOT_READY` on a ticket that fails the ticket-level tier;
- `om-backlog` checks its source against the ticket-level tier.

Today all three skip the check: `READY_STATUS = n/a`, no stop, and readiness is "skipped".

##### Scenario: Idea triaged
- WHEN `om-auto-manage-issues` processes an `idea` issue that has a problem and who has it, but no expected outcome
- THEN `READY_STATUS = not-ready`, and the not-ready comment names the missing outcome and its check

##### Scenario: Maintainer waiver
- WHEN a maintainer comments "ready as is" on a not-ready issue
- THEN triage records `READY_STATUS = ready`

##### Scenario: Backlog source checked
- WHEN `om-backlog <spec> --dry-run` runs on a spec whose out-of-scope items have no owner
- THEN it stops with a readiness list naming that item

Frozen by: none. This is agent-interpreted prose, not executable code. The baseline is `enrich-existing-issue.md:108-112`, `om-auto-fix-issue/SKILL.md:49`, and `om-backlog/SKILL.md:28` at the current `skills-lock.json` revision, plus the recorded dry-run (`.ai/analysis/2026-11-11-om-backlog-dry-run.md`). Fixtures F3 and F6 capture the behavior. Under the Delta format this is a Medium finding.

### Capability: next-step-hints

#### MODIFIED Requirement: Suggested next commands follow the route table
Before: native output suggests `om-auto-fix-issue` for every issue, at the five locations in the Problem Statement.

After: `om-prepare-issue`, `om-auto-manage-issues`, `om-backlog`, and `om-brainstorm` SHALL suggest the step from `SDLC.md` § Routes for the issue's kind, per Extension B. Every `Next:` line SHALL be `none` or runnable as written. They SHALL NOT run the suggestion.

##### Scenario: Feature filed
- WHEN `om-prepare-issue --no-spec` files a `feature`
- THEN the body suggests triage and the feature route, and the report ends `Next: om-auto-manage-issues <n>`

##### Scenario: Bug prepared
- WHEN `om-auto-manage-issues <n>` posts implementation-prep notes on a `bug`
- THEN they end `Next: om-auto-fix-issue <n>` (unchanged)

##### Scenario: Backlog filed
- WHEN a real `om-backlog <spec>` run files a tree
- THEN each story and task body has a `## ▶️ Start` section with its filled-in brief, epics have none, and the report ends `Next: none`

##### Scenario: Backlog dry-run unchanged
- WHEN `om-backlog <spec> --dry-run` runs
- THEN it ends `Next: om-backlog <spec>` (native)

Frozen by: none. This is agent-interpreted prose. The baseline is the five cited lines at the current `skills-lock.json` revision. Fixtures F1, F2, F5, F7a, and F8 capture the behavior.

## 📝 Architecture

| Component | Status | Content |
|---|---|---|
| `SDLC.md` § Categories | new | The eight category labels and the `idea`/`chore` hints, matching Extension A. `chore` is an issue category only (D14). |
| `SDLC.md` § Routes | new | The route table, the rules below it, and the two brief templates. |
| `SDLC.md` § Definition of Ready | new | The native two-tier text (`om-setup-agent-pipeline/references/sdlc-template.md:87-108`), plus the per-category table and a precedence note. Waiver: "ready as is", on issues only (D16). |
| `SDLC.md` § Design acceptance, § Milestones, § Trivial changes | new | As below. |
| `SDLC.md` existing passages | modified | Line 9, the Triage row (line 25), and § Human-confirmed issue autofix queue (lines 204-212). |
| `.ai/skills/om-prepare-issue/SKILL.md`, `.ai/skills/om-auto-manage-issues/SKILL.md` | new | Header, Extension A, and Extension B (shared rules plus their location blocks). |
| `.ai/skills/om-backlog/SKILL.md`, `.ai/skills/om-brainstorm/SKILL.md` | new | Header and Extension B (shared rules plus their location block). |
| `.ai/agentic.config.json` `autofix.eligibility.excludeLabels` | modified | Adds `idea`, `feature`, `refactor`, `documentation`, and `chore` (D17), via `om-setup-agent-pipeline`. |
| `CODE_REVIEW.md` § Repo-specific checks | modified | The three checks in Proposed Solution item 5. |
| `AGENTS.md` | modified | A pointer to § Routes and the non-OM-skills note. |

### Route table (to be written into `SDLC.md`)

**[H]** marks a human decision or a command a human runs. Readiness never starts work; a human command does (D2). "Triage" always means `om-auto-manage-issues <n>`: implementation-prep notes are on by default for a single issue, and `--no-prep` turns them off.

| Category | Route (native commands) | Readiness before the next command | Do not use |
|---|---|---|---|
| **idea** | **[H]** optional `om-brainstorm` → **[H]** `om-prepare-issue --no-spec "<goal> — brief: <path>"` → triage with `--no-prep` → **[H]** re-categorize (then re-run triage) or close | not checked for start: an idea starts no work. The not-ready comment lists what it needs to become actionable. | any spec or implementation command |
| **feature** | **[H]** `om-prepare-issue --no-spec` → triage → **[H]** spec PR (§ Design acceptance) → **[H]** `Status: Accepted` + merge (D1) → **[H]** choice (D10): **backlog** (`om-backlog <spec> --dry-run`, confirm, `om-backlog <spec>`, commit `backlog.md`, then items) **or direct** (comment `Accepted spec: <path>` on the issue, then `om-auto-implement-spec <n>`) | issue `ready` before the spec step; spec backlog-ready (D16) before `om-backlog` | `om-auto-fix-issue` (chains spec into implementation); `om-prepare-issue` without `--no-spec`; triage with `--write-missing-specs` |
| **backlog item** (story or task from `om-backlog`) | **[H]** assign yourself → **[H]** run the command in the item's `## ▶️ Start` section (the backlog-item brief), in `Depends on` order → review → **[H]** merge. GitHub closes the item through `Closes #<item>`. | the item carries acceptance criteria and its parent spec (D11) | `om-auto-fix-issue`, `om-auto-implement-spec`, `om-auto-create-pr --spec`, or any brief naming the parent spec (each would implement the whole parent spec) |
| **bug** (and **security**) | **[H]** `om-prepare-issue --no-spec` → triage → **[H]** `om-auto-fix-issue <n>` (native bug chain, opens the PR), or `om-fix-issue <n>` (staged), then **[H]** `om-open-pr <n> bug` in the emitted `WORKTREE` | reproducible: `om-verify-in-repo` inside the chain | — |
| **refactor / documentation / chore** (and **dependencies**), small | **[H]** `om-prepare-issue --no-spec` → triage → **[H]** assign yourself → **[H]** `om-auto-create-pr` with the task brief template | issue `ready` | `om-auto-fix-issue` (runs the bug chain) |
| **refactor / documentation / chore**, large | triage → **[H]** comment "needs a spec (large)" on the issue → as feature, from the spec PR onwards (D9) | as feature | as feature |
| **trivial change** | **[H]** `om-auto-create-pr "<task>"` with no issue. The PR carries `documentation` or `refactor`, plus `skip-qa` (D7, D14). | — | — |

**Rules under the table:**
- **Category at intake (D15).** `om-prepare-issue` labels the issue at creation, and triage never changes an existing label. The intake category is therefore provisional. In triage, the human confirms it, or re-categorizes in the GitHub UI by removing the label and adding the new one. Then re-run triage.
- **Size (D9).** Small or large is the human's call in triage, using the OM-native criterion: the change is not small, local, and obvious from its description. The command they run records the decision. A large refactor, documentation, or chore gets no native spec-required comment, so the human writes one.
- **Direct route means one PR.** `om-auto-implement-spec` ships the whole spec on one PR. A spec whose phases must merge one after another uses the backlog route.
- **Brainstorm shortcuts (D18).** Ramps 3 and 5 of `om-brainstorm` start a spec or a PR without an issue. Use them only for trivial changes. Otherwise file the issue first with ramp 2.
- **Claims.** `om-auto-create-pr` claims only its PR. Before starting a backlog item or a small task, the human assigns the issue to themselves, so that two runs do not take the same item.
- **Autofix queue (D17).** The queue takes bugs only. The other categories are excluded by `autofix.eligibility.excludeLabels`.
- **`backlog.md`.** `om-backlog` updates `.ai/specs/backlog.md` and does not commit it. The human commits it through the trivial path, or by hand on a docs branch.

**Backlog-item brief template.** `om-auto-create-pr` takes only a brief and has no **get-issue** operation (`om-auto-create-pr/SKILL.md:12,29`). A brief that names a spec makes it resolve that spec (`SKILL.md:13`). The brief therefore carries everything and never names the parent spec:

```text
om-auto-create-pr "Implement backlog item #<n> (<id> — <title>) and only this item.
Acceptance criteria (from #<n>):
<criteria>
Scope: this item only. Do not implement other items or the rest of the parent design, and do not set a Source doc.
The PR body must contain: Closes #<n>"
```

**Task brief template** (small refactor/documentation/chore):

```text
om-auto-create-pr "Implement #<n> (<title>), small change, no spec.
What is wanted and how it is checked (from #<n>):
<problem, expected outcome, check>
Out of scope: <from #<n>>
The PR body must contain: Closes #<n>"
```

### Definition of Ready: per-category minimums (to be written into `SDLC.md`)

The native ticket-level tier applies to every category. The notes say what each item means for the category. They never remove an item.

The native text names the `om-auto-fix-issue` feature-route stop as enforcement. A note under it adds: "This describes native enforcement. Which command to run is decided by § Routes."

| Category | Ticket-level minimum (in addition to the native tier) |
|---|---|
| idea | Problem and who has it. An expected outcome is not needed to file, but it is what makes the idea actionable. |
| feature | The native tier in full. The spec supplies the spec-level tier. |
| bug, security | Reproducible (`om-verify-in-repo`). The rest of the native tier applies only to its ticket-level items (native). |
| refactor, documentation, chore, dependencies | The native tier in full. The expected outcome includes the size the human chose. |
| spec, as an `om-backlog` source | The Problem Statement names who has the problem, with its source tier. Out-of-scope items name an owner role. The decisions it relies on are recorded (D16). |

### Design acceptance (to be written into `SDLC.md`)

- A spec is accepted when a human sets `Status: Accepted` in it and merges the design-only spec PR into `main` (D1).
- **Spec PR by agent:** `om-auto-write-spec <n>`. It opens a **ready** PR labeled `review`, `documentation`, and `skip-qa`, with `Refs #<n>` (`om-auto-write-spec/SKILL.md:42,54`).
- **Spec PR by hand** (after `om-spec-writing`):
  1. Create a branch `docs/spec-<slug>` from `main`.
  2. Keep only the spec, and its brief when there is one, in the working tree. `om-open-pr` runs `git add -A` (`om-open-pr/SKILL.md:65`).
  3. Run `om-open-pr <n> documentation --draft` in the same session, so that its previous-step summary exists (`:60`). For a spec-only PR it writes `Refs #<n>` (`om-open-pr/references/pr-body-template.md:51-52`).
  4. Mark the PR ready before merge.
- The `om-spec-writing` template writes no `Status:` line. The human adds `Status: Draft` when opening the spec PR, and changes it to `Accepted` before merge.
- Automation never writes or changes `Status:`. Under the human's own GitHub login, "set by a human" cannot be verified. This is an accepted limit (D12).

### Milestones (to be written into `SDLC.md`)

1. **Design accepted:** the spec PR is merged with `Status: Accepted`. The source issue stays open, because the spec PR uses `Refs`.
2. **Child items complete** (only when a backlog was chosen): every story and task of an epic is closed, and a human closes the epic.
3. **Source complete:**
   - **With a backlog:** every epic whose `Backlog source:` is the accepted spec's path is closed (`om-backlog/references/filing.md:10`), and a human closes the source issue.
   - **Without a backlog:** the PR from `om-auto-implement-spec <n>` closes the source issue on merge. The skill records `ISSUE_ID` when it resolves the spec from the issue (`om-auto-implement-spec/references/spec-resolution.md:9`), and the implementing PR carries `Closes`.

### Trivial changes (to be written into `SDLC.md`)

Trivial changes are:
- typo or wording fixes in docs;
- one-line config values with no behavior effect.

Never trivial:
- config gates and labels;
- `SDLC.md` routes;
- `.ai/skills/`;
- `BACKWARD_COMPATIBILITY.md` surfaces (D7).

## 📝 Data Model

No new label, field, or stored state. One existing config value changes: `autofix.eligibility.excludeLabels` (D17). Story and task bodies gain a `## ▶️ Start` section (Extension B).

## 📝 Edge Cases & Failure Scenarios

| Case | What happens (native) | Mitigation |
|---|---|---|
| `om-auto-fix-issue` on a feature | Spec and implementation in one run, skipping design acceptance. | "Do not use". Extension B removes the hint. The implementation PR's review is the human backstop (D12). |
| `om-auto-fix-issue` on an `idea` or `chore` phrased "add…" | It takes the feature route (`om-auto-fix-issue/SKILL.md:40`). | "Do not use" for both. No hint points there. |
| `om-auto-fix-issue` on refactor, documentation, or chore | Bug chain; non-bugs reach it through the "when unsure" default (`SKILL.md:43`). `om-verify-in-repo` may stop with `NO_ACTION_NEEDED`. | "Do not use". A stop is harmless. |
| Whole-spec implementation from a backlog story | Any of `om-auto-fix-issue`, `om-auto-implement-spec`, `--spec`, or a brief naming the parent spec resolves the parent spec. | The Start brief names no spec. Extension B, and "do not use". This is the costliest misuse. |
| A backlog-item or task PR lacks `Closes #<n>` | The item stays open, and the epic checklist never completes. | The templates require it. A `CODE_REVIEW.md` check catches it. Adding it is a safe fix. |
| Direct route: the issue lists several `.ai/specs/` paths (a brief, a spec) | Resolution scans the issue body and comments (`spec-resolution.md:9`). It may pick the brief and stop with "no implementation breakdown" (`:12`), or stop as ambiguous. | The `Accepted spec: <path>` comment. Fallback: `om-auto-implement-spec <path>`, then add `Closes #<n>` by hand. |
| Hand-written spec PR opened from a dirty tree or from `main` | `om-open-pr` runs `git add -A` and pushes the current branch. | § Design acceptance: a `docs/spec-<slug>` branch and a clean tree. |
| `om-backlog` on a spec source once the Definition of Ready exists | It applies the whole ticket-level tier and has no waiver (`om-backlog/SKILL.md:28`). | D16. This spec complies. F6 re-runs the check in a fresh context. |
| `om-backlog` on a `Draft` spec | It does not read `Status:` and would file the tree. | Convention (D10): backlog only after acceptance. |
| A spec PR merges without `Status: Accepted` | Nothing enforces it (D12). | `CODE_REVIEW.md`: "awaiting human acceptance". |
| The review autofix writes `Status: Accepted` | `om-auto-review-pr` autofixes PRs by `$CURRENT_USER` (`SKILL.md:73`) and edits spec documents (`:80`). | The check is worded as human-only and never fixable. An agent commit that adds or changes `Status:` is a Blocker. |
| `automerge` on a spec or process PR | With `prepare-and-merge`, the label is the only human act before merge. | Convention: never on spec or process PRs. |
| A two-run race on one item | `om-auto-create-pr` claims only its PR. | The human assigns the issue to themselves first. |
| `jq` missing | Every OM skill fails at config loading. | Prerequisite in `AGENTS.md`. |
| A vendored update moves the cited text | The extensions name behavior, not line numbers. A renamed category list or hint could stop matching. | Re-check the extensions when `skills-lock.json` changes (`om-apply-upgrade-notes`). |

## 📝 Risks & Impact Review

- **Conventions, not enforcement.** The process relies on humans choosing the right command (D12). Failure modes are visible and reversible.
- **Native readiness checks turn on** in four skills at once:
  - `om-auto-manage-issues`;
  - the `om-auto-fix-issue` feature-route stop;
  - `om-prepare-issue` body sections, which it already applies as hygiene (`SKILL.md:58`);
  - the `om-backlog` source check.

  The brief asks for this (requirement 2).
- **Protected surfaces.** The change touches two protected surfaces in `BACKWARD_COMPATIBILITY.md`: the `SDLC.md` sections and the issue-route contract. The Phase 1 PR records the maintainer's approval.
- **Upgrade coupling.** Extensions A and B depend on the vendored category list and on where hints are printed. Deleting them restores native behavior.
- **Parsed lines.** Every `Next:` line stays `none` or a runnable `om-…` command, so it matches `^Next: (none|om-[a-z-]+.*)$` (`om-backlog/SKILL.md:48`) and stays safe for orchestrators that run it (`om-brainstorm/SKILL.md:8,57`).
- **Direction call (product, not a defect).** D6 adds weight to small features. The escape hatch is re-categorization in triage.

## 📋 Phasing

The phases must merge in order: Phase 2 needs Phase 1 in place. Per § Routes, this spec therefore uses the backlog route.

1. **Phase 1: process contract, categories, hints, and config.**
   - Content: `SDLC.md`, Extensions A and B, Config C, `CODE_REVIEW.md`, `AGENTS.md`, and the Delta archive.
   - Exit gate:
     - every category's route, readiness minimum, and milestones can be found in `SDLC.md`;
     - the validation gate is green;
     - the maintainer's approval for the protected surfaces is recorded on the PR.
2. **Phase 2: verification.**
   - Content: fixtures F1–F10 below.
   - Delivery: one PR that adds `.ai/analysis/scenarios/<date>-issue-first-verification.md`.
   - Depends on: Phase 1 merged.
   - Exit gate: every fixture matches its expected artifact, and the test issues, branches, and PRs are closed or removed.

## 📋 Implementation Plan

**Bootstrap (this spec).**

0. **Prerequisite:** the pipeline setup (`c0c8f6e`, branch `chore/agent-pipeline-setup`) is merged into `main`. `om-auto-create-pr` worktrees branch from `origin/main`, and Phase 1 edits those files.
1. A human files the source issue with `om-prepare-issue --no-spec`.
2. The spec PR is opened by hand, per § Design acceptance. A human reviews it, sets `Status: Accepted`, and merges it.
3. `om-backlog .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md --dry-run` runs, then the human confirms, then the real run. This also serves as F6.
   - Extension B is not in place yet, so these bodies carry native hints and no Start section.
   - The human writes each item's brief from the backlog-item template.
4. Items follow the backlog-item route in `Depends on` order:
   - the Phase 1 PRs reference their items with `Closes`;
   - the Phase 2 PR closes the last item;
   - the human then closes the epics and the source issue (§ Milestones).

### Phase 1: process contract, categories, hints, and config

1. **`SDLC.md` § Categories and § Routes.** Write the route table, the rules under it, and both brief templates. *Check:* every category from brief requirement 1, plus backlog items and trivial changes, has a row, and each **[H]** names its command.
2. **`SDLC.md` § Definition of Ready, § Design acceptance, § Milestones.** Write:
   - the native two-tier text word for word, with its precedence note;
   - the per-category table and the waiver scope (D16);
   - the spec-PR steps and the `Status:` rules;
   - the three milestones.

   *Check:* the heading is exactly `## Definition of Ready`, both tiers are present, and no note removes a native item.
3. **`SDLC.md` § Trivial changes.** *Check:* it matches the trivial row.
4. **Reconcile the existing `SDLC.md` text.**
   - Line 9: spec work happens after intake and triage.
   - Triage row (line 25): `om-verify-in-repo` confirms bugs, while `om-auto-manage-issues` plus the human's category confirmation triage every issue.
   - § Human-confirmed issue autofix queue: bugs only, matching D17.

   *Check:* no passage contradicts § Routes.
5. **Extensions.** Write the four `.ai/skills/<skill>/SKILL.md` files: the common header, then Extension A (`om-prepare-issue` and `om-auto-manage-issues` only), then the Extension B shared rules and that file's location block. *Check:* each file contains only those blocks, and none relaxes a native rule (review against `CODE_REVIEW.md`).
6. **Config C.** Re-run `om-setup-agent-pipeline` and add the five labels to `autofix.eligibility.excludeLabels`. *Check:* the validation gate is green, and the config matches § Routes.
7. **`CODE_REVIEW.md` § Repo-specific checks:**
   - "A spec PR without `Status: Accepted` is awaiting human acceptance. That is never a fixable finding. Automation never adds or changes the line. An agent commit that adds or changes `Status:` is a Blocker."
   - "A spec PR uses `Refs #<n>`, never a closing keyword."
   - "A PR implementing a backlog item or a small task contains `Closes #<n>` and changes only that issue's scope."

   *Check:* there are three checks, worded as above.
8. **`AGENTS.md`:** the routes pointer and the non-OM-skills note.
9. **Archive the Delta** into `.ai/specs/capabilities/issue-categories.md` and `.ai/specs/capabilities/next-step-hints.md`, each with `Source:` pointing at this spec. *Check:* every requirement and scenario is present.

### Phase 2: verification

Test issues are filed by a human, prefixed `[test]`, and closed afterwards. Test PRs are closed without merging, and their branches are deleted. Each fixture records the artifact it produced.

| Id | Fixture | Command | Expected artifact |
|---|---|---|---|
| F1 | "we probably need some way to track X, not sure how" | `om-prepare-issue --no-spec` | `idea` label; the body suggests triage and the idea route; the report says `Next: om-auto-manage-issues <n>` |
| F2 | A feature with a problem, users, and an outcome | `om-prepare-issue --no-spec`, then `om-auto-manage-issues <n>` | `feature` label; the body suggests no `om-auto-fix-issue`; the prep notes say `Next: om-auto-write-spec <n>` |
| F3 | An issue filed by hand without labels: "tidy .gitignore" | `om-auto-manage-issues <n> --dry-run` | category `chore`; `READY_STATUS` `ready` or `not-ready`, never `n/a` |
| F4 | "bump agent-browser to the latest version" | `om-prepare-issue --no-spec` | `dependencies`, not `chore` |
| F5 | A bug issue with no expected outcome | `om-auto-manage-issues <n>` | the not-ready comment names the outcome and ends with the Extension B ⛔ line; the prep notes say `Next: om-auto-fix-issue <n>` |
| F6 | This spec | `om-backlog <this spec> --dry-run`, in a fresh context (bootstrap step 3) | readiness met; `Next: om-backlog <spec>` |
| F7 | A throwaway two-story spec meeting D16 (`.ai/specs/<date>-test-backlog.md`, deleted afterwards) | `om-backlog <spec>` (real run) | story and task bodies have `## ▶️ Start` with no spec path; the epic has none; `Next: none` |
| F7a | Story 1 of F7 | its Start command | the PR contains `Closes #<story>`, touches only that story's scope, and has no `Source doc:` |
| F8 | A brainstorm on a topic with an open `feature` issue, then one with no issue ("worth capturing, not now") | `om-brainstorm` | ramp 6 says `Next: om-auto-manage-issues <n>`; ramp 2 says `om-prepare-issue --no-spec …` |
| F9 | A `[test]` feature issue with an accepted throwaway spec, commented `Accepted spec: <path>` | `om-auto-implement-spec <n>` | the PR body contains `Closes #<n>` and `Source doc: <path>` |
| F10 | One open `[test]` issue per category, each with decided scope | `om-auto-issue-triage` (proposal only; the human declines) | only the bug is proposed; no label is applied |

## 📝 Resolved questions

Answered by a human on 2026-11-11 in interactive mode:

| Q | Answer |
|---|---|
| Scope | One spec, two phases (contract, then verification). |
| Intervention level | Minimal (D12). Repo-local extensions only add rules: categories (A) and next-step hints (B, D13). Native config values only (C, D17). |
| Definition of Ready | The native `SDLC.md` section, accepting that native readiness checks turn on. |
| DoR vs the backlog path | Checked by dry-run: specs must be backlog-ready (D16). |
| Native hints pointing at `om-auto-fix-issue` | Extend four skills (D13). `Next:` lines stay one line and runnable. Backlog items carry their own Start brief. |
| `chore` on PRs | Native: `refactor` or `documentation` (D14). |
| Who sets the category | Intake proposes; the human confirms in triage (D15). |
| Autofix queue | Bugs only, via `excludeLabels` (D17). |
| Brainstorm exits | `--no-spec` on ramp 2; ramps 3 and 5 only for trivial changes (D18). |
| Size and backlog decisions | No labels. The human's choice of command records them. |
| Who accepts a spec | Natively, any human GitHub lets approve and merge. Automation never accepts. |
| Branch protection | Nothing changes. GitHub policies apply, if the maintainer sets them. |
| Verification | Fixtures F1–F10 on `[test]` issues, recorded on the Phase 2 PR. |
