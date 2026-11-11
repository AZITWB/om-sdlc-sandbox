# Issue-First SDLC: Phase 2 verification

- **Spec:** `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (accepted). Phase 1 merged in #6.
- **Source issue:** #1.
- **Date:** 2026-11-11.
- **Fixtures:** test issues prefixed `[test]` (#7–#15), and test PRs #16 and #17, which were closed without merging.

**Outcome:** all ten fixtures match their expected artifacts. F10 first failed in part. The fix shipped on this PR (`dependencies` excluded from the autofix queue), and F10 passed on re-run.

## Results

| Id | Fixture | Run by | Result | Artifact |
|---|---|---|---|---|
| F1 | "we probably need some way to track X, not sure how" via `om-prepare-issue --no-spec` | this session | pass | #7: `idea` label. The body hint names triage and the idea route. The report says `Next: om-auto-manage-issues 7`. |
| F2 | Feature with problem, users, and outcome; `om-prepare-issue --no-spec`, then `om-auto-manage-issues 8` | this session | pass | #8: `feature` label, and no `om-auto-fix-issue` hint. Triage posted the native spec-required comment and set `READY_STATUS=ready`. The prep notes end `Next: om-auto-write-spec 8`. |
| F3 | Hand-filed, unlabeled "tidy .gitignore"; `om-auto-manage-issues 10 --dry-run` | this session | pass | Would apply `chore`. `READY_STATUS=not-ready`, not `n/a`; missing: who has it, the outcome and its check, out of scope, and the open questions. The prep notes would end `Next: none`. |
| F4 | "bump agent-browser to the latest version" | this session | pass | #9: `dependencies`, not `chore`. |
| F5 | Hand-filed bug with no expected outcome; `om-auto-manage-issues 11` | this session | pass (with a deviation) | #11: labels `bug`, `priority-medium`, `risk-medium`. The not-ready comment ends with the Extension B ⛔ line. The prep notes end `Next: om-auto-fix-issue 11`, the native hint kept for a bug. Deviation: the analysis ran inline, not through `om-root-cause`. The defect did not reproduce. |
| F6 | `om-backlog <this spec> --dry-run` | fresh-context agent | pass | Readiness met. The draft tree has 2 epics, 11 stories, and 3 tasks. Story bodies end with `## ▶️ Start`; epics have none. `Next: om-backlog .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md`. |
| F7 | Throwaway two-story spec; real `om-backlog` after the human confirmed the tree | this session | pass | Epics #12 and #13 have checklists and no Start section. Stories #14 and #15 have `## ▶️ Start` with filled briefs; the spec path appears only in the native `Backlog source:` line. The report says `Next: none`. |
| F7a | Story #14's Start command | fresh-context agent | pass | PR #16 carries `Closes #14` (`closingIssuesReferences` is `[14]`) and no `Source doc:`. It changes `README.md` and its run plan only. |
| F8 | Two `om-brainstorm` conversations with the human | this session | pass (with a deviation) | A, ramp 6: `Next: om-auto-manage-issues 8` (natively `om-auto-fix-issue 8`), plus `Issue: #8`. B, ramp 2: `Next: om-prepare-issue --no-spec "… — brief: .ai/specs/briefs/2026-11-11-route-flow-diagram.md"`. Deviation: the challenger subagent (step 4) was skipped. |
| F9 | `[test]` feature #8 with the comment `Accepted spec: <path>`; `om-auto-implement-spec 8` | fresh-context agent | pass | Resolution step 3 found the issue comment and recorded `ISSUE_ID=8`. PR #17 carries `Closes #8` and `Source doc: <test spec>`. The whole spec shipped on one PR. |
| F10 | `om-auto-issue-triage`, proposal only | this session | first run: partial fail. After the fix: pass | First run: the gate rejected `feature` and `idea`, but `dependencies` (#9) and the untriaged #10 reached the shortlist. After the fix, the gate also rejects #9. Evidence judgment rejects #10 as untriaged and #11 as not reproduced, so no category other than bug is proposed. |

## Limits

- **Not independent for all fixtures.** F1–F5, F7, F8, and F10 ran in the session that wrote the extensions. They followed the skill text, but they are not independent agent runs. F6, F7a, and F9 ran as fresh-context agents that were given only the command.
- **Self-approval.** Approvals in #16 and #17 were posted as comments, because the author and reviewer are the same account.
- **`jq` is still missing.** Agents read the config with node and reimplemented the descriptor's lock helpers, which use `jq`.

## Follow-ups (not in this PR)

1. **`om-backlog` ignores the chosen route.** It does not read D20 (phased direct) or which phases already shipped. A real run on this spec would file Phase 1 as open work. Possible rule: no `om-backlog` on a spec whose route is phased direct, or on phases already merged. (F6)
2. **The stale Problem Statement bullet** in the spec. Phase 1 added routes and the Definition of Ready to `SDLC.md`, and the capability specs now hold the current truth. (F6)
3. **Closing keywords in prose.** PR #6 closed #1 through the sentence "…which closes #1". The `CODE_REVIEW.md` check looks for a `Closes` line. Add: "no closing keyword anywhere in the body of a PR that must not close its issue".
4. **The trivial route also via `om-open-pr`.** A hand edit plus `om-open-pr` was used for #4 and #5. § Routes names only `om-auto-create-pr`.
5. **The claim step for backlog items and small tasks** (the human assigns themself) was skipped in F7a and F9, because the convention has no prompt. Consider making the Start brief's first line "assign yourself to #<n>".
6. **The Dependabot route,** already set aside by the human as a separate feature.
