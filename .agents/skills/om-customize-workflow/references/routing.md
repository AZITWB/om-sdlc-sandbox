# Routing a workflow change (steps 1–2)

Decides which mechanism carries a change and which skills it touches. Loaded by `om-customize-workflow` steps 1 and 2.

## Mechanism

| The change… | Mechanism | Example |
|---|---|---|
| weakens a protected gate (below) | refuse; point at the config key if one controls it, else propose upstream | "merge without QA on UI changes" |
| is a value the config already has | edit `.ai/agentic.config.json` | different validation commands, `qaGate`, `ci.maxWaitMinutes`, `automerge.mode`, label names |
| is listed in `om-setup-agent-pipeline/references/config-capabilities.md` | edit that config key | security checklist path, spec template path |
| adds repo specifics to existing steps | overlay per affected skill | extra checklist item, category-specific readiness fields, routing per issue type |
| would make sense in any repository | overlay now, plus an upstream slot proposal in the report | a new optional gate many teams want |
| has its own goal and trigger | hand off to `om-create-skill` | "a skill that drafts release emails" |

Stricter is always allowed: an overlay may add a gate, a required field, a blocker rule, or a confirmation point.

## Protected gates

An overlay never weakens these; only the listed config key (or a maintainer-owned `SDLC.md` change backed by it) may.

| Gate | Only control |
|---|---|
| `needs-qa` blocks merge until `qa-approved` | `qaGate` |
| `qa-approved` pinned to the tested head (`QA head:`) | none |
| no self-QA on `risk-high`; risk-high evidence table | none (automerge `--force` is invocation-only; Maintainer-only where `SDLC.md` says so) |
| review verdict rule: blocker or unwaived major → request changes | none |
| validation gate: any non-zero exit blocks | `validation.commands` (the list, not the rule) |
| claim protocol, lock release, `claim-reset` | none |
| skills never set `qa` or `qa-approved` from a diff | none |
| untrusted-content boundary, secrets hygiene | none |
| `do-not-merge`, `blocked`, `qa-failed` are hard blocks | none |

## Active decisions

A workflow change is checked against every active decision (`references/agentic-setup.md` step 5) before any mechanism is chosen.

- A change that builds what a decision or non-goal excludes, or reverses a decision, is refused. Quote the entry and its id. Example: a UI design gate contradicts a decision that dropped design gates (D4 in this repository's Issue-First brief).
- The way forward is never a quieter overlay. The plan proposes a superseding entry: new id, the entry it supersedes, and the owner who must approve it. Nothing is written until that owner confirms. The skill never writes the decision table itself, because D21 limits it to extensions, config and `SDLC.md`: the plan hands the entry text to the owner, who records it.
- A decision may limit the overlays themselves. D12 in this repository lists the allowed extensions and treats later additions case by case. Under such a decision, a new overlay or a new rule in an existing one is itself a new entry: the plan proposes it, and nothing is written before the owner confirms.
- An entry past its review-by date is flagged in the plan, never enforced blindly.

## Chains

A change to one stage usually needs the same rule wherever that stage is entered. Include every skill on the path.

| Stage changed | Skills to cover |
|---|---|
| Intake / readiness | `om-prepare-issue`, `om-backlog`, `om-auto-manage-issues`, `om-auto-fix-issue` (feature route readiness stop) |
| Issue routing by type | `om-auto-fix-issue`, `om-auto-issue-triage`, `om-prepare-issue` (spec-when-missing) |
| Spec | `om-spec-writing`, `om-auto-write-spec`, `om-auto-implement-spec`, `om-pre-implement-spec` |
| Design / mock gate | `om-auto-write-spec` (mockups), `om-auto-review-pr` (blocker when missing), `om-auto-qa-pr` (state matrix), `om-ux-review-pr` |
| Implementation | `om-fix`, `om-auto-create-pr`, `om-auto-create-pr-loop`, `om-auto-continue-pr`, `om-auto-continue-pr-loop` |
| Review | `om-code-review` (checklist engine), `om-auto-review-pr`, `om-review-prs`, `om-auto-fix-pr` |
| QA | `om-auto-qa-pr`, `om-qa-buddy`, `om-approve-merge-pr` (gate), `om-merge-buddy`, `om-auto-merge-buddy` |
| Merge | `om-approve-merge-pr`, `om-merge-buddy`, `om-auto-merge-buddy`, `om-auto-merge-triage` |
| Post-merge | `om-close-fixed-issues`, `om-followup-issue-from-pr`, `om-auto-update-changelog` |

Before writing, confirm each listed skill is installed (`$SKILLS_ROOT/<name>/SKILL.md`) and grep the exact heading to anchor. A skill that is not installed is reported, not overlaid.

Prefer the engine over its callers: a review rule goes into `om-code-review` once, not into every review skill.
