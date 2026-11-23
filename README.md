# om-sdlc-sandbox

Pracownia do budowania workflow SDLC na skillach [open-mercato/skills](https://github.com/open-mercato/skills), przed przeniesieniem go do repo produktowego.

## Zawartość

| Ścieżka | Co to jest |
|---|---|
| `.agents/skills/om-*` | skille z `open-mercato/skills` (wersje w `skills-lock.json`); `.claude/skills/om-*` to junctions do nich |
| `.agents/skills/om-customize-workflow/` | własny skill: zmiany workflow przez config i overlaye w `.ai/skills/`, audyt overlayów po aktualizacji |
| `.claude/skills/` (bez `om-`) | skille z `mattpocock/skills` |
| `docs/issue_first_sdlc_feature_brief.md` | brief adaptacji Issue-First |
| `docs/om-customize-workflow-example.md` | instalacja `om-customize-workflow` w repo produktowym, walidacja istniejących overlayów i przykład zmiany (design gate dla UI) |

## Szybki start w repo produktowym

1. `npx skills add open-mercato/skills`, potem `/om-setup-agent-pipeline`.
2. Skopiuj `.agents/skills/om-customize-workflow/` i dodaj junction w `.claude/skills/` (polecenia w `docs/om-customize-workflow-example.md`, sekcja 1).
3. `/om-customize-workflow --audit`, czyli sprawdzenie istniejących overlayów.
4. `/om-customize-workflow <zmiana>`, czyli zaplanowanie i zapisanie zmiany workflow.

Po każdej aktualizacji skilli: `/om-apply-upgrade-notes`, a potem `/om-customize-workflow --audit`.
