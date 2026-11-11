# AGENTS.md

## Project overview

`om-sdlc-sandbox` is a process sandbox, not a product codebase. It holds the Open Mercato (OM) agent skills, the pipeline configuration that drives them, and the design documents for adapting the team's SDLC. The first planned change is the Issue-First SDLC adaptation in `.ai/specs/briefs/2026-11-11-issue-first-sdlc.md`. Under it, each issue category gets its own proportionate route, and every move to the next activity needs an explicit human decision. There is no application code, build, or test suite yet.

## Task routing

| When the task involves… | Read first | Key rules |
|---|---|---|
| The SDLC process (routes, readiness, gates, roles) | `SDLC.md`, `.ai/specs/briefs/2026-11-11-issue-first-sdlc.md` | `SDLC.md` and `.ai/agentic.config.json` describe the same process: change them together. Readiness never triggers automated work, and specification acceptance is not implementation authorization. |
| Pipeline configuration | `.ai/agentic.config.json`, `.claude/skills/om-setup-agent-pipeline/SKILL.md` | Re-run `om-setup-agent-pipeline` to change the config. Never store secrets or identities in it. Keep it valid JSON (validation gate). |
| Tracker or browser behavior | `.ai/trackers/github.md`, `.ai/browsers/agent-browser.md` | These are the committed override points for tracker and browser operations. Never improvise `gh` calls outside the descriptor's label guards. |
| Per-skill customization | `.ai/skills/<skill-name>/SKILL.md` (none yet), `.claude/skills/om-setup-agent-pipeline/references/agentic-setup.md` | Customize through repo-local extensions only. Never edit vendored skills under `.claude/skills/` or `.agents/skills/` to relax safety rules. |
| Installed skills and lockfile | `skills-lock.json`, `.claude/skills/`, `.agents/skills/` | Out of scope for SDLC work: no skill-install cleanup or lockfile changes without a dedicated ticket. |
| Design documents and specs | `.ai/specs/` (`{YYYY-MM-DD}-{kebab-case-title}.md`, briefs under `.ai/specs/briefs/`) | A spec is accepted by a human before backlog or implementation. Specs and briefs live only under `.ai/specs/` (brief decision D5). |
| Agent run artifacts | `.ai/runs/`, `.ai/analysis/`, `.ai/qa/` | Generated per run. QA artifacts and `test-env.*` are git-ignored. |

## Validation commands

Run in order. Any non-zero exit fails the gate:

```bash
node -e "JSON.parse(require('fs').readFileSync('.ai/agentic.config.json','utf8'))"
```

The OM skills' config loader also requires `jq` on `PATH`.

## Pointers

- Process: `SDLC.md`
- Review rules: `CODE_REVIEW.md`
- Protected surfaces: `BACKWARD_COMPATIBILITY.md`
- Pipeline config: `.ai/agentic.config.json`
