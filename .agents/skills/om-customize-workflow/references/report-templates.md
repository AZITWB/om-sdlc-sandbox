# Reports (steps 3 and 6, `--audit`)

Templates for `om-customize-workflow`. This skill emits no `PR:` or `Issue:` chaining lines unless it delivered through `om-auto-create-pr`, which then emits them.

## Plan (step 3)

```markdown
📋 `om-customize-workflow` plan: {the change in one sentence}.
Mechanism: {config | overlays | config + overlays | refused — reason}.

| Skill | Base heading | Action | Why |
|---|---|---|---|
| `om-…` | `## …` | add/replace/extend | {one clause} |

Config: {key → new value, or "no change"}.
SDLC.md: {sections updated, or "no change"}.
Upstream slot: {what a base-skill config key would replace these overlays, or omit}.
**Confirm to write.**
```

## Result (step 6)

```markdown
✅ `om-customize-workflow`: {applied, left uncommitted | already applied | refused | dry-run}.
{N} overlays, {config keys}, SDLC.md {sections} — {what now behaves differently, for whom}.
Checked: overlay gate and anchors {pass | failures named}.
**Next:** {review and commit the diff | re-run `--audit` after the next upgrade | propose the upstream slot}.
```

## Audit

```markdown
🔍 `om-customize-workflow --audit`: {all ok | N need attention}.

| Overlay | Status | Fix |
|---|---|---|
```

List only overlays that need attention; give the `ok` count in the first line.
