# om-customize-workflow: usage example

Step by step: install `om-customize-workflow` in a product repository, validate what is already there, and make a first workflow change. Design authority: `.ai/specs/2026-11-23-om-customize-workflow.md` (accepted).

The examples use the real headings of the installed skills (versions in `skills-lock.json`) and this repository's real extensions and decisions. The audit output in section 2 is the actual result on `main` after the spec was accepted. The proposed extension in section 4 passed the audit against the installed skills. Sections 3–5 are walkthroughs of the plan stage, not recorded runs.

## 1. Installation in a target repository

The skill is not in any collection yet, so you copy it by hand into the same place as here: the files go in `.agents/skills/`, with a junction in `.claude/skills/`.

```powershell
$src = "C:\DEV\om-sdlc-sandbox\.agents\skills\om-customize-workflow"
Copy-Item $src -Destination .agents\skills\ -Recurse
New-Item -ItemType Junction -Path .claude\skills\om-customize-workflow -Target "$PWD\.agents\skills\om-customize-workflow"
```

It needs these alongside it (usually present after `npx skills add open-mercato/skills`):
- `om-create-skill`, for the overlay template and gate;
- `om-setup-agent-pipeline`, for the config key list and `skill-coverage.md`.

If the target repository has a decision that limits skill changes (D12 here), adding this skill needs its own entry there too. In this repository that entry is D21.

## 2. Validating what already exists

```
/om-customize-workflow --audit
```

The audit only reads, and it also runs without config. For each `.ai/skills/*/SKILL.md` it reports the status against the installed skill of the same name. It accepts two header shapes: the upstream banner `> **Repo-local override.** …` and this repository's `# <skill>: repo-local extension`.

Result on `main` (four Issue-First extensions):

```markdown
🔍 `om-customize-workflow --audit`: 4 need attention, 0 ok.

| Overlay | Status | Fix |
|---|---|---|
| `om-auto-manage-issues` | `fork` (50 of 84 lines), `no-anchors` | move the shared "Category list" / "Next-step hints" rules to one source; add `Base:` lines |
| `om-prepare-issue` | `no-anchors` | add `Base: ## Workflow` to each delta section |
| `om-backlog` | `no-anchors` | add `Base:` lines |
| `om-brainstorm` | `no-anchors` | add `Base:` lines |
```

What to do with each status:

| Status | Meaning | Fix |
|---|---|---|
| `ok` | everything fits | nothing |
| `no-anchors` | overlay without `Base:` lines | add `Base: <base heading>` at the start of each section |
| `stale-anchor` | the base heading changed or disappeared | point at the new heading, or remove the section |
| `bad-anchor` | `Base:` is not a markdown heading | point at the nearest heading above the step |
| `fork` | overlay is at least 50% of the base's length | move shared text to config or upstream, or split it |
| `orphan` | no installed base skill | install the skill or remove the overlay |
| `frontmatter` | overlay starts with `---` | replace it with an accepted header |
| `unbannered` | first line is neither accepted header | add the header the repository uses |
| `unsafe` | weakens a protected check | remove the directive; use the config key if one exists |
| `conflict` | two overlays contradict each other | align them in one change |

Overlays that existed before this skill will almost always get `no-anchors`. That is expected. Add the anchors in one change and run the audit again.

## 3. Example A: a change that is not needed

```
/om-customize-workflow Bugs do not require a specification, only features do.
```

Classification checks how it works today. `SDLC.md` § Routes already routes bugs through `om-auto-fix-issue` with no spec, and features always go through a spec (D6). Result:

```markdown
✅ `om-customize-workflow`: already applied.
Bugs already skip the spec (`SDLC.md` § Routes, D6). No extension or config change needed.
**Next:** no action needed.
```

## 4. Example B: a new rule that needs a decision first

```
/om-customize-workflow Issues filed by om-prepare-issue list the active decisions (D-entries) the ticket relies on.
```

### Step 1: classification

- It weakens no check; it adds one body line.
- No config key covers it.
- **Active decisions:** D12 limits extensions to two, categories and next-step hints, and says later additions are decided case by case. A new rule is therefore a new entry.

Verdict: overlay, plus a proposed decision for the Maintainer.

### Step 2: impact map

The stage is intake. `om-backlog` already passes "Decisions in play" from the spec, so only `om-prepare-issue` needs the rule. `om-auto-manage-issues` is not touched, which matters because its overlay is a `fork`.

### Step 3: plan (the skill stops here and waits)

```markdown
📋 `om-customize-workflow` plan: issues filed by `om-prepare-issue` list the decisions they rely on.
Mechanism: overlay, plus a new decision.

| Skill | Base heading | Action | Why |
|---|---|---|---|
| `om-prepare-issue` | `## Workflow` | extend | step 5 adds a `Decisions touched:` body line |

Decision: propose D22 — "`om-prepare-issue` adds a `Decisions touched:` line" — extending D12, owner Maintainer.
Config: no change.
SDLC.md: no change (the Definition of Ready is unchanged).
Upstream slot: `om-prepare-issue` already cites ids from `product-brief.md`; reading decision tables from briefs would replace this overlay.
**Confirm to write.**
```

### Step 4: written after confirmation

The new section is appended to `.ai/skills/om-prepare-issue/SKILL.md`. The overlay grows from 37 to 43 lines, against a base of 91:

```markdown
## Decisions touched (adds a body line)

Base: ## Workflow

- In step 5, when `.ai/specs/briefs/*.md` holds a decision table, add one line `Decisions touched: D<n>, …` to the issue body, naming the active entries the ticket relies on, or `none`.
```

The Maintainer records D22 in the brief's decision table. The skill only proposes the text, because D21 does not let it write under `.ai/specs/`.

### Steps 5–6: gate and report

The extended overlay passes the audit: the header is accepted, it is 43 of 91 lines, and the anchor resolves. The report lists the changes and leaves them uncommitted. Deliver them through the repository's normal route: an issue, then `om-auto-create-pr`, because `.ai/skills/` is never a trivial change.

## 5. Example C: a refused change

```
/om-customize-workflow A UI change needs an accepted mock (default, empty, error, 360px) before implementation; review blocks without it.
```

```markdown
⛔ `om-customize-workflow`: refused — contradicts D4.
D4 dropped UI design gates because native mechanisms cover them (Design stage, `Prototype:`, QA state matrix).
To pursue it, propose a decision that supersedes D4, with the Maintainer as owner; the skill then plans the overlays against the new entry.
**Next:** none.
```

## 6. After updating skills

```
/om-apply-upgrade-notes
/om-customize-workflow --audit
```

`om-apply-upgrade-notes` updates descriptors and config, but not overlays. The audit catches base headings that were renamed or removed (`stale-anchor`).

## 7. Checklist before committing a workflow change

- [ ] `--audit` reports nothing for the changed overlays.
- [ ] Every rule of the requested change lands in a specific overlay or config key.
- [ ] The rule sits in the engine skill, not in every skill that calls it.
- [ ] `SDLC.md` and the decision table say the same as the overlays.
- [ ] Nothing weakens a protected check, and nothing contradicts an active decision without a superseding entry.
- [ ] The report proposes an upstream slot when the change would make sense in another repository.
