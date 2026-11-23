# om-sdlc-sandbox

Pracownia do budowania workflow SDLC na skillach [open-mercato/skills](https://github.com/open-mercato/skills), przed przeniesieniem go do repo produktowego. Zasady pracy dla agentów są w [AGENTS.md](AGENTS.md).

## Zawartość

| Ścieżka | Co to jest |
|---|---|
| [SDLC.md](SDLC.md), [SDLC-routes.md](SDLC-routes.md) | proces: kategorie, trasy, Definition of Ready, bramki |
| [.ai/agentic.config.json](.ai/agentic.config.json) | config pipeline'u czytany przez skille |
| `.ai/skills/<skill>/SKILL.md` | overlaye: zmiany zainstalowanych skilli specyficzne dla tego repo |
| `.ai/specs/` | specki i briefy, w tym [brief Issue-First](.ai/specs/briefs/2026-11-11-issue-first-sdlc.md) |
| `.agents/skills/om-*` | skille z `open-mercato/skills` (wersje w `skills-lock.json`); `.claude/skills/om-*` to te same skille dla Claude Code (lokalnie junctions) |
| `.agents/skills/om-customize-workflow/` | własny skill (dozwolony przez decyzję D21): zmiany workflow przez config i overlaye, audyt overlayów po aktualizacji skilli. Design: [specka](.ai/specs/2026-11-23-om-customize-workflow.md), zachowanie: [capability](.ai/specs/capabilities/workflow-customization.md) |
| [docs/om-customize-workflow-example.md](docs/om-customize-workflow-example.md) | instalacja `om-customize-workflow` w innym repo, walidacja istniejących overlayów i przykład zmiany (design gate dla UI) |

## Szybki start w repo produktowym

1. `npx skills add open-mercato/skills`, potem `/om-setup-agent-pipeline`.
2. Skopiuj `.agents/skills/om-customize-workflow/` i dodaj go w `.claude/skills/` (polecenia w przykładzie, sekcja 1).
3. `/om-customize-workflow --audit`, czyli sprawdzenie istniejących overlayów.
4. `/om-customize-workflow <zmiana>`, czyli zaplanowanie i zapisanie zmiany workflow.

Po każdej aktualizacji skilli: `/om-apply-upgrade-notes`, a potem `/om-customize-workflow --audit`.
