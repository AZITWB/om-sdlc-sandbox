# Overlay audit (step 5 and `--audit`)

Checks that every overlay still fits its installed base. Loaded by `om-customize-workflow` step 5, for the overlays it just wrote, and by `--audit`, for all of them. Runs after the size and frontmatter rules of the overlay gate in `om-create-skill/references/overlay-contract.md`. Its banner rule is widened here to accept two header shapes.

## Accepted headers

An overlay's first line is one of these:

- the upstream banner, `> **Repo-local override.** <one sentence>`;
- a repository's accepted extension header, `# <skill-name>: repo-local extension`, followed by an `Installed skill: …` line. This is the shape `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` § Extension files: common header defines for this repository.

New overlays use whichever header the repository's existing overlays use. With none yet, they use the upstream banner.

## Script

```bash
: "${SKILLS_ROOT:?set SKILLS_ROOT per references/agentic-setup.md}"
for ov in .ai/skills/*/SKILL.md; do
  [ -f "$ov" ] || { echo "no overlays"; break; }
  name=$(basename "$(dirname "$ov")")
  base="$SKILLS_ROOT/$name/SKILL.md"
  [ -f "$base" ] || { echo "orphan       $name: no installed base"; continue; }
  first=$(head -n 1 "$ov" | tr -d '\r')
  if [ "$first" = "---" ]; then echo "frontmatter  $name"
  else
    case "$first" in
      "> **Repo-local override.** "*|"# $name: repo-local extension") ;;
      *) echo "unbannered   $name: first line is neither accepted header" ;;
    esac
  fi
  ov_lines=$(wc -l < "$ov"); base_lines=$(wc -l < "$base")
  [ $((ov_lines * 2)) -lt "$base_lines" ] || echo "fork         $name: $ov_lines of $base_lines lines"
  grep -n '^Base: ' "$ov" | while IFS= read -r line; do
    heading=$(printf '%s' "${line#*Base: }" | tr -d '\r' | sed 's/[[:space:]]*$//')
    case "$heading" in \#*) ;; *) echo "bad-anchor   $name: '$heading' is not a markdown heading"; continue ;; esac
    grep -rqxF --include='*.md' -- "$heading" "$SKILLS_ROOT/$name" || echo "stale-anchor $name: '$heading' not found in base"
  done
  grep -q '^Base: ' "$ov" || echo "no-anchors   $name: add Base: lines to each delta section"
done
```

An anchor must equal a whole heading line, level included (for example `## Rules`). A heading that was renamed, demoted, or merged therefore fails. The heading may live anywhere in the installed skill directory, so a step that moved into `references/` still counts. A numbered workflow step without its own heading is anchored by its nearest enclosing heading (usually `## Workflow`), and the overlay's section title names the step. Prose pointers ("extends the **Category** bullet of …") may stay next to the `Base:` line.

## Manual checks (read each overlay)

- **unsafe**: any directive that weakens a check in `references/routing.md` § Protected gates, expands tool or network access, or redirects outputs. Quote the line. The fix is to delete it, and to use the config key when one controls the check.
- **conflict**: two overlays in one chain that state contradicting rules for the same stage. Fix: align them in one change.
- **dead delta**: a section whose target exists but whose content now duplicates the base, because upstream absorbed it. Fix: delete the section and note the upstream change.

## Status values

| Status | Meaning | Fix |
|---|---|---|
| `ok` | all checks pass | none |
| `stale-anchor` | a `Base:` heading no longer exists | re-anchor to the renamed heading, or drop the section if the step is gone |
| `no-anchors` | overlay without `Base:` lines | add them from the current base headings |
| `bad-anchor` | `Base:` value is not a heading line | anchor to the nearest enclosing heading |
| `fork` | overlay ≥ 50% of base | move shared text to config or upstream, or split the overlay's concerns |
| `orphan` | base skill not installed | install it or delete the overlay |
| `frontmatter` | overlay starts with `---` | replace it with an accepted header |
| `unbannered` | first line is neither accepted header | add the header the repository uses |
| `unsafe` | weakens a protected check | delete the directive |
| `conflict` | two overlays contradict each other | align them in one change |
