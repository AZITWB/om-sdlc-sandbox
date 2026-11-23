---
name: om-customize-workflow
description: Change this repository's SDLC workflow without forking skills — maps a process change to config keys first, then to minimal repo-local overlays (.ai/skills/<name>/SKILL.md) across every affected skill, keeps SDLC.md in sync, and audits overlays for drift after a skills upgrade. Use for "change our workflow", "bugs skip spec", "add a gate", "customize skill X here", "check our overlays".
---

# Customize Workflow

Turn one workflow change into the smallest set of config edits and repo-local overlays, consistent across every skill it touches and with `SDLC.md`. Never edits installed skills or application code.

## Arguments

- `{change}` (required unless `--audit`) — the workflow change in plain words.
- `--audit` — check every `.ai/skills/*/SKILL.md` against its installed base; change nothing.
- `--dry-run` — show the plan and diffs; write nothing.

## Workflow

**ALWAYS check first:** Apply `.ai/skills/om-customize-workflow/SKILL.md` when present; safety rules still win.

0. **Agentic setup** — follow `references/agentic-setup.md`: load `.ai/agentic.config.json` (missing → stop, point at `/om-setup-agent-pipeline`), `SDLC.md`, the installed skills root, and every existing overlay. This skill uses no tracker operations and no label guards.
1. **Classify the change** with `references/routing.md`; stop at the first match:
   - weakens a protected gate → refuse, unless a config key controls it; name the key or the upstream proposal;
   - a config key covers it → config edit only;
   - repository specifics for existing skill steps → overlays;
   - new behavior with its own goal and trigger → stop and hand off to `om-create-skill`.
2. **Map impact.** List every affected skill, chain skills included (`references/routing.md` § Chains), and the exact base heading each overlay changes — grep the installed `SKILL.md`, never guess. One row per skill: base heading, action (`add | replace | extend`), reason.
3. **Show the plan and stop.** Present the step-2 table, the config diff, and the `SDLC.md` diff; wait for explicit confirmation. `--dry-run` ends here.
4. **Write.** Start each new overlay from `om-create-skill/references/templates/repo-local-stub.md`; extend an existing overlay instead of adding a second. Every delta section's first line is `Base: <exact base heading>` so drift stays detectable. Update the affected `SDLC.md` sections in the same change. Config edits are additive and `jq . .ai/agentic.config.json` must parse.
5. **Gate.** Per overlay, run the overlay gate in `om-create-skill/references/overlay-contract.md`, then the anchor and safety checks in `references/audit.md`. Fix and re-run until clean.
6. **Report** with `references/report-templates.md`. Leave changes uncommitted, or deliver through `om-auto-create-pr` when asked.

## Audit mode (`--audit`)

Run `references/audit.md` over every overlay and report each as `ok`, `stale-anchor`, `fork`, `orphan`, `frontmatter`, or `unsafe`, with the fix. Recommend it after every `om-apply-upgrade-notes` run.

## Rules

- Shared rules: `references/rules.md`. They always apply.
- Preference order: config → overlay → upstream proposal → new skill. Report every overlay as a missing upstream slot.
- Write only `.ai/skills/**`, `.ai/agentic.config.json`, and `SDLC.md`.
- One workflow change keeps every affected overlay and `SDLC.md` consistent in the same change; never leave the process half-applied.
- Overlays never relax safety or quality rules, expand tool or network access, or redirect outputs (`references/routing.md` § Protected gates).
- Idempotent: re-running an applied change reports "already applied" and writes nothing.
