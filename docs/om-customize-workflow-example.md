# om-customize-workflow: przykład użycia w repo produktowym

Instrukcja krok po kroku: jak zainstalować `om-customize-workflow` w docelowym repo, zwalidować to, co już tam jest, i wprowadzić pierwszą zmianę workflow.

Przykłady oparte są na prawdziwych nagłówkach zainstalowanych skilli (stan z `skills-lock.json` w `om-sdlc-sandbox`). Przykładowe overlaye z sekcji 4 przeszły bramkę overlay i audyt kotwic na tej wersji skilli. To nie jest zapis przebiegu na prawdziwym repo: wyniki u ciebie będą zależeć od jego configu i istniejących plików.

## 1. Instalacja w docelowym repo

Skill nie jest jeszcze w żadnej kolekcji, więc na razie kopiujesz go ręcznie, tak samo jak w sandboxie: pliki w `.agents/skills/`, junction w `.claude/skills/`.

```powershell
$src = "C:\DEV\om-sdlc-sandbox\.agents\skills\om-customize-workflow"
Copy-Item $src -Destination .agents\skills\ -Recurse
New-Item -ItemType Junction -Path .claude\skills\om-customize-workflow -Target "$PWD\.agents\skills\om-customize-workflow"
```

Wymagane obok niego (zwykle już są po `npx skills add open-mercato/skills`): `om-create-skill` (szablon i bramka overlay) oraz `om-setup-agent-pipeline` (lista kluczy configu, `skill-coverage.md`).

Jeśli repo nie ma jeszcze `.ai/agentic.config.json`, najpierw:

```
/om-setup-agent-pipeline
```

## 2. Walidacja tego, co już istnieje

```
/om-customize-workflow --audit
```

Audyt tylko czyta. Działa też bez configu: wtedy w raporcie jest ostrzeżenie. Sprawdza każdy plik `.ai/skills/*/SKILL.md` względem zainstalowanego skilla o tej samej nazwie.

Przykładowy raport dla repo z dwoma starszymi overlayami:

```markdown
🔍 `om-customize-workflow --audit`: 2 need attention, 0 ok.

| Overlay | Status | Fix |
|---|---|---|
| `om-code-review` | `no-anchors` | add `Base: ## Severity and Verdict` to the severity section |
| `om-prepare-test-env` | `frontmatter`, `fork` (148 of 210 lines) | drop frontmatter; move ports and seeded accounts to config or keep only the delta |
```

Co zrobić z każdym statusem:

| Status | Znaczenie | Poprawka |
|---|---|---|
| `ok` | wszystko pasuje | nic |
| `no-anchors` | starszy overlay bez linii `Base:` | dopisać `Base: <nagłówek bazy>` na początku każdej sekcji |
| `stale-anchor` | nagłówek bazy zmienił się lub zniknął | wskazać nowy nagłówek albo usunąć sekcję |
| `bad-anchor` | `Base:` nie jest nagłówkiem markdown | wskazać najbliższy nagłówek nad krokiem, zwykle `## Workflow` |
| `fork` | overlay ma co najmniej 50% długości bazy | przenieść do configu, upstream albo osobnego skilla |
| `orphan` | brak zainstalowanego skilla bazowego | doinstalować skill albo usunąć overlay |
| `frontmatter` | overlay zaczyna się od `---` | zamienić na baner `> **Repo-local override.** …` |
| `unsafe` | osłabia chronioną bramkę | usunąć dyrektywę; jeśli bramkę kontroluje klucz configu, użyć klucza |

Overlaye, które istniały przed tym skillem, prawie zawsze dostaną `no-anchors`. To normalne. Dopisz kotwice w jednym commicie i uruchom audyt jeszcze raz.

## 3. Przykład A: zmiana, której nie trzeba robić

```
/om-customize-workflow Bugi nie wymagają specyfikacji, tylko featury.
```

Krok 1 (klasyfikacja) sprawdza, jak to działa dziś. `om-auto-fix-issue` już teraz prowadzi bugi trasą verify → root-cause → fix → open-pr i speckę pisze tylko na trasie feature (krok 3, `references/feature-route.md`). Wynik:

```markdown
✅ `om-customize-workflow`: already applied.
Bugs already skip the spec: `om-auto-fix-issue` routes bugs through the autofix chain and writes a spec only on the feature route. No overlay or config change needed.
**Next:** no action needed.
```

Wniosek: zanim napiszesz overlay, warto zapytać, czy upstream już tak nie działa. Część punktów briefu Issue-First prawdopodobnie jest już domyślna.

## 4. Przykład B: design gate dla zmian w UI

```
/om-customize-workflow Zmiana w UI wymaga zaakceptowanego mocka (stany: default, empty, error, 360px) przed implementacją. Review blokuje PR bez akceptacji.
```

### Krok 1: klasyfikacja

- Nie osłabia bramek, tylko dodaje nową. To dozwolone.
- Config nie ma na to klucza. `SDLC.md` ma etap Design, ale nic go nie egzekwuje, a 360px nie jest nigdzie zapisane.
- Werdykt: overlaye plus zmiana w `SDLC.md`.

### Krok 2: mapa wpływu

Z `routing.md` § Chains, etap „Design / mock gate”. Zasada „silnik przed wywołującymi”: blokada implementacji idzie do `om-auto-implement-spec`, bo `om-auto-fix-issue` na trasie feature i tak go woła. Reguła review idzie do `om-code-review`, którego używają `om-auto-review-pr` i `om-review-prs`.

### Krok 3: plan (skill zatrzymuje się tutaj i czeka na potwierdzenie)

```markdown
📋 `om-customize-workflow` plan: UI changes need an accepted mock (default, empty, error, 360px) before implementation; review blocks without it.
Mechanism: overlays.

| Skill | Base heading | Action | Why |
|---|---|---|---|
| `om-auto-implement-spec` | `## Workflow` | extend | stop before implementing a UI spec without an accepted prototype |
| `om-code-review` | `## Severity and Verdict` | add | missing accepted design on a UI PR is a blocker |
| `om-auto-qa-pr` | `## Workflow` | extend | narrow-viewport state runs at 360px |

Config: no change.
SDLC.md: Design stage row — accepted mock with the four states is required; done when acceptance is recorded next to `Prototype:`.
Upstream slot: a `design.requiredStates` config key read by these three skills would replace all three overlays.
**Confirm to write.**
```

Odpowiedz „tak” albo popraw plan. Z `--dry-run` skill kończy w tym miejscu.

### Krok 4: zapisane pliki

`.ai/skills/om-auto-implement-spec/SKILL.md` (8 linii, baza ma 60):

```markdown
> **Repo-local override.** Adds a design-acceptance stop before implementing a user-facing spec.

## Workflow — step 1, resolve the spec (extend)

Base: ## Workflow

- After the spec resolves, when it describes a user-facing change, require a `Prototype:` line pointing at an accepted design that covers the default, empty, error, and 360px-wide states, with the acceptance evidence named next to it.
- Missing, unaccepted, or incomplete → stop before step 2 with `Status: blocked` and `⚠ NEEDS HUMAN CONFIRMATION: design not accepted`, naming the missing states. Never implement around it.
```

`.ai/skills/om-code-review/SKILL.md` (7 linii, baza ma 167):

```markdown
> **Repo-local override.** Makes a missing accepted design a blocker on user-facing PRs.

## Severity and Verdict (add)

Base: ## Severity and Verdict

- A PR that changes a user-facing screen or flow without a linked spec `Prototype:` covering the default, empty, error, and 360px states, with recorded acceptance, is a **blocker** ("design not accepted"). Docs-only, test-only, and non-UI changes are exempt.
```

`.ai/skills/om-auto-qa-pr/SKILL.md` (7 linii, baza ma 283):

```markdown
> **Repo-local override.** Pins this repository's narrow viewport to 360px.

## Workflow — state matrix (extend)

Base: ## Workflow

- Exercise the narrow-viewport state of the state matrix at 360px width and record the width in the evidence.
```

`SDLC.md`, wiersz Design w tabeli Ticket lifecycle, kolumna „Done when”: dopisane „zaakceptowany mock ze stanami default, empty, error i 360px, akceptacja zapisana obok `Prototype:`”.

Zwróć uwagę na kształt każdego overlaya:
- pierwsza linia to baner;
- tytuł sekcji mówi, którą część bazy zmienia i jak (`add`, `extend`, `replace`);
- pierwsza linia sekcji to `Base:` z dokładnym nagłówkiem bazy;
- nic z bazy nie jest przepisane.

### Krok 5: bramka

Skill uruchamia bramkę overlay z `om-create-skill/references/overlay-contract.md` (baner, brak frontmattera, poniżej 50% bazy) i skrypt z `references/audit.md` (kotwice). Dla tych trzech plików: zero zgłoszeń.

### Krok 6: raport

```markdown
✅ `om-customize-workflow`: applied, left uncommitted.
3 overlays and the SDLC.md Design stage — UI specs now stop before implementation without an accepted 360px-ready mock, and review blocks UI PRs that lack one.
Checked: overlay gate and anchors pass.
**Next:** review and commit the diff; propose `design.requiredStates` upstream.
```

Zmiany zostają niezacommitowane. Przejrzyj diff i zacommituj sam albo poproś o dostarczenie przez `om-auto-create-pr`. Wtedy zmiana procesu przejdzie przez zwykłe review PR.

## 5. Po aktualizacji skilli

```
/om-apply-upgrade-notes
/om-customize-workflow --audit
```

`om-apply-upgrade-notes` aktualizuje deskryptory i config, ale nie sprawdza overlayów. Drugi krok wyłapuje nagłówki bazy, które zmieniły nazwę albo zniknęły (`stale-anchor`).

## 6. Checklista przed commitem zmiany workflow

- [ ] `--audit` bez zgłoszeń dla zmienionych overlayów.
- [ ] Każda reguła z zamówionej zmiany ląduje w konkretnym overlayu albo kluczu configu.
- [ ] Reguła jest w silniku (`om-code-review`, `om-auto-implement-spec`), a nie w każdym skillu, który go woła.
- [ ] `SDLC.md` mówi to samo co overlaye.
- [ ] Nic nie osłabia chronionych bramek (`routing.md` § Protected gates).
- [ ] W raporcie jest propozycja slotu upstream, jeśli zmiana miałaby sens w innym repo.
