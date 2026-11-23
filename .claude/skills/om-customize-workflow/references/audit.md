# Overlay audit (step 5 and `--audit`)

Checks that every overlay still fits its installed base. Loaded by `om-customize-workflow` step 5 (for the overlays it just wrote) and by `--audit` (for all of them). Runs after the overlay gate in `om-create-skill/references/overlay-contract.md`, which covers banner, frontmatter, and size.

## Script

```bash
SKILLS_ROOT=${SKILLS_ROOT:-.agents/skills}
for ov in .ai/skills/*/SKILL.md; do
  [ -f "$ov" ] || { echo "no overlays"; break; }
  name=$(basename "$(dirname "$ov")")
  base="$SKILLS_ROOT/$name/SKILL.md"
  [ -f "$base" ] || { echo "orphan       $name: no installed base"; continue; }
  [ "$(head -n 1 "$ov")" = "---" ] && echo "frontmatter  $name"
  ov_lines=$(wc -l < "$ov"); base_lines=$(wc -l < "$base")
  [ $((ov_lines * 2)) -lt "$base_lines" ] || echo "fork         $name: $ov_lines of $base_lines lines"
  grep -n '^Base: ' "$ov" | while IFS= read -r line; do
    heading=${line#*Base: }
    grep -rqF -- "$heading" "$SKILLS_ROOT/$name" || echo "stale-anchor $name: '$heading' not found in base"
  done
  grep -q '^Base: ' "$ov" || echo "no-anchors   $name: add Base: lines to each delta section"
done
```

Anchors resolve against the whole installed skill directory, so a step that moved into `references/` still counts.

## Manual checks (read each overlay)

- **unsafe** — any directive that weakens a gate in `references/routing.md` § Protected gates, expands tool or network access, or redirects outputs. Quote the line; the fix is to delete it and, when a config key controls the gate, use the key.
- **dead delta** — a section whose `replace`/`extend` target exists but whose content now duplicates the base (upstream absorbed it). Fix: delete the section and note the upstream change.
- **conflict** — two overlays in one chain that state contradicting rules for the same stage. Fix: align them in one change.

## Status values

| Status | Meaning | Fix |
|---|---|---|
| `ok` | all checks pass | none |
| `stale-anchor` | a `Base:` heading no longer exists | re-anchor to the renamed step, or drop the section if the step is gone |
| `no-anchors` | older overlay without `Base:` lines | add them from the current base headings |
| `fork` | overlay ≥ 50% of base | push into config/upstream, or rename as its own skill |
| `orphan` | base skill not installed | install it or delete the overlay |
| `frontmatter` | overlay starts with `---` | normalize to the banner shape |
| `unsafe` | weakens a protected gate | delete the directive |
