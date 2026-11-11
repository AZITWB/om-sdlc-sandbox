# Analiza: wdrożenie Issue-First SDLC (OM)

Źródło: `.ai/specs/briefs/2026-11-11-issue-first-sdlc.md` (przeniesiony z `docs/`; decyzje D1–D12 w briefie).

> **Aktualizacja (D12, 2026-11-11):** przyjęliśmy minimalną ingerencję w OM. Rozdział 3 (repo-lokalne rozszerzenia egzekwujące bramki) jest nieaktualny. Obowiązujący projekt to spec `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md`: trasy jako udokumentowane konwencje i jedno mini-rozszerzenie dla kategorii `idea` i `chore`.

Stan bazowy: pipeline OM skonfigurowany 2026-11-11 (`c0c8f6e`, gałąź `chore/agent-pipeline-setup`).

## 1. Co OM już daje, a czego brakuje

| Wymaganie z briefu | Co już jest w OM | Luka |
|---|---|---|
| Kategoryzacja: idea, feature, bug, refactor, documentation, chore | Etykiety kategorii (wszystkie 6 są w configu i na GitHubie). `om-prepare-issue` i `om-auto-manage-issues` nadają etykiety SDLC. | `om-auto-fix-issue` rozpoznaje tylko **bug** i **feature**. Refactor, docs i chore trafiają domyślnie do ścieżki bugowej, gdzie `om-verify-in-repo` pyta „czy defekt jest prawdziwy?”, więc może je błędnie zamknąć jako `NO_ACTION_NEEDED`. `idea` nie ma żadnej obsługi. |
| Minimalna gotowość dla każdej kategorii | Skille czytają sekcję **`## Definition of Ready`** z `SDLC.md` (`om-prepare-issue`, `om-auto-manage-issues` → `READY_STATUS`, `om-auto-fix-issue` → `NOT_READY`, `om-backlog`). | Nasz `SDLC.md` **nie ma tej sekcji**, bo szablon dodaje ją tylko z włączonym discovery. Bez niej skille sprawdzają `READY_STATUS = n/a`, czyli nie sprawdzają gotowości wcale. Lista sprawdzanych pozycji jest jedna dla wszystkich kategorii. |
| Gotowość nigdy nie uruchamia pracy automatycznie | `READY_STATUS` jest tylko raportowany. `om-auto-issue-triage` nadaje `cez-autofix` dopiero po potwierdzeniu przez człowieka. W repo nie ma workera ani CI. | Spełnione. Trzeba to tylko zapisać jako regułę i nie dodawać workera reagującego na etykiety. |
| Feature: spec → akceptacja designu → propozycja backlogu → implementacja | `om-spec-writing` / `om-auto-write-spec` tworzą PR ze specem (tylko design). `om-backlog --dry-run` daje propozycję, a zwykłe `om-backlog` ma twardy stop na potwierdzenie przed zapisem. | **Główna luka.** `om-auto-fix-issue` na ścieżce feature po napisaniu specu od razu uruchamia `om-auto-implement-spec`. `om-auto-implement-spec` przyjmuje też niezmergowany PR ze specem. Nigdzie nie ma bramki „design zaakceptowany przez człowieka”. |
| Krótkie ścieżki dla bug, refactor, chore i docs | Bug: `om-verify-in-repo` → `om-root-cause` → `om-fix` → `om-open-pr`. Pozostałe: `om-auto-create-pr` z briefu albo `om-fix-issue` / `om-implement-feature` (zostawiają staged, bez PR). | Brakuje tylko routingu (patrz kategoryzacja). Spec nie jest tu wymuszany. |
| Osobne kamienie milowe: akceptacja designu, ukończenie elementów podrzędnych, ukończenie Feature | `om-backlog` tworzy epiki i stories z checklistą i linkami `Epic: #N`. `om-close-fixed-issues` respektuje `do-not-close`. | Brak reguły, że PR implementacyjny zamyka tylko element podrzędny (`Closes #child`, `Refs #feature`), a Feature zamyka człowiek po ukończeniu checklisty. |
| Rozdzielenie ról, bez autonomicznego merge | Bramka QA (`qaGate: true`, `qa-approved` zostaje przy człowieku). Role opisane w `SDLC.md`. | ⚠️ `automerge.mode = prepare-and-merge` pozwala `om-auto-merge-buddy` mergować samodzielnie, a brief wyłącza autonomiczny merge z zakresu i zostawia uprawnienia do merge bez zmian. |
| Tylko skille OM | 74 skille OM | W `.claude/skills` jest 10 skilli spoza OM (`mattpocock/skills`: `to-spec`, `to-tickets`, `implement`, `tdd`…). Ich sprzątanie jest poza zakresem, więc wystarczy zakaz użycia w `AGENTS.md`. |

## 2. Docelowe ścieżki dla kategorii

Każde przejście oznaczone **[H]** to jawna komenda albo decyzja człowieka. Automatyzacja nie przechodzi dalej sama.

| Kategoria | Minimalna gotowość (DoR) | Ścieżka |
|---|---|---|
| **idea** | Problem lub potrzeba i kto ją ma. Nic więcej nie jest wymagane. | `om-brainstorm` lub `om-prepare-issue` z etykietą `idea` → stop. **[H]** decyzja o zmianie na `feature`/`bug`/… albo zamknięcie. Żadnego specu ani implementacji. |
| **feature** | Problem i kto go ma, oczekiwany wynik i sposób sprawdzenia, poza zakresem, otwarte pytania oznaczone jako blokujące lub nie | **[H]** `om-spec-writing` (interaktywnie) lub `om-auto-write-spec` → PR ze specem → **[H] akceptacja designu** (merge PR ze specem; *milestone 1*) → **[H] decyzja (D10): implementacja wprost** (`om-auto-implement-spec` na cały spec, issue zamyka PR implementacyjny) **albo backlog**: **[H]** `om-backlog --dry-run` (propozycja) → **[H]** `om-backlog` (publikacja) → **[H]** gotowość dziecka → **[H]** `om-auto-implement-spec` / `om-auto-create-pr` na dziecko (*milestone 2*, osobno dla każdego dziecka) → **[H]** zamknięcie Feature po ukończeniu checklisty (*milestone 3*). |
| **bug** | Kroki reprodukcji, wynik oczekiwany vs rzeczywisty | **[H]** `om-auto-fix-issue` (ścieżka bugowa) lub `om-fix-issue` (staged). `om-verify-in-repo` jest bramką reprodukowalności. |
| **refactor** | Cel, granica zmiany, „brak zmiany zachowania” i jak to sprawdzić | Rozmiar proponuje triage, rozstrzyga **[H]** (D9). **Mały:** **[H]** `om-auto-create-pr` z issue lub `om-fix-issue`, bez specu i bez `om-verify-in-repo`. **Duży:** **[H]** spec → **[H]** akceptacja (D1) → **[H]** implementacja, backlog opcjonalny. |
| **documentation** | Który dokument, co jest nieaktualne lub czego brakuje | Rozmiar jak wyżej (D9). **Mały:** **[H]** `om-auto-create-pr`, etykieta `skip-qa`. **Duży:** spec → akceptacja → implementacja. |
| **chore** | Co i dlaczego, granica zmiany | Rozmiar jak wyżej (D9). **Mały:** **[H]** `om-auto-create-pr`. **Duży:** spec → akceptacja → implementacja. Zmiany w lockfile lub instalacji skilli wymagają osobnego ticketu. |
| **zmiana trywialna** (bez issue) | Kryterium trywialności z `SDLC.md` | **[H]** `om-auto-create-pr "<zadanie>"`, `skip-qa` (D7). Gdy nie jest wyraźnie trywialna, potrzebne jest issue. |

Intake dla wszystkich kategorii: `om-prepare-issue --no-spec` → triage `om-auto-manage-issues`, który ustala kategorię, priorytet, ryzyko, `SPEC_STATUS`, `READY_STATUS` i propozycję rozmiaru (D8). Bez `--write-missing-specs`, chyba że człowiek o to poprosi.

Ścieżki odmowne trzeba zapisać jawnie (kryterium sukcesu z briefu):
- implementacja `idea`;
- implementacja `feature` bez zaakceptowanego specu;
- `om-backlog` z niezaakceptowanego specu;
- zamknięcie Feature przez PR dziecka;
- uruchomienie pracy przez samą gotowość.

## 3. Jak to wdrożyć (tylko konfiguracja OM i lokalne rozszerzenia)

Skille vendorowane zostają nietknięte. Wszystko idzie przez dokumenty repo i repo-lokalne rozszerzenia `.ai/skills/<skill>/SKILL.md`. Rozszerzenie może **dodawać** bramki, ale nie może ich luzować, więc jest zgodne z ograniczeniem briefu.

1. **`SDLC.md`: sekcja `## Definition of Ready`** o strukturze zgodnej z tym, czego oczekują skille (poziom ticketu + poziom specu), z tabelą DoR dla każdej kategorii. Do tego tabela ścieżek z rozdz. 2 i lista ścieżek odmownych. Pisana ręcznie, bez `om-setup-discovery-pipeline`, który wnosi całą warstwę produktową (product owner, `product-brief.md`).
2. **`.ai/skills/om-auto-fix-issue/SKILL.md`**:
   - routing `refactor`/`documentation`/`chore` do krótkiej ścieżki bez `om-verify-in-repo`;
   - odmowa dla `idea`;
   - ścieżka feature **kończy się na PR ze specem**, bez automatycznego wywołania `om-auto-implement-spec`.
3. **`.ai/skills/om-auto-implement-spec/SKILL.md`**: odmowa, gdy spec nie jest zaakceptowany (np. nie jest zmergowany na `main` albo nie ma akceptacji człowieka). Ta sama reguła w **`.ai/skills/om-backlog/SKILL.md`**.
4. **`.ai/skills/om-auto-manage-issues/SKILL.md` + `.ai/skills/om-prepare-issue/SKILL.md`**:
   - DoR zależne od kategorii;
   - `idea` nie dostaje komentarza o brakującym specu;
   - Feature źródłowy dostaje `do-not-close`.
5. **Reguła powiązań** (w rozszerzeniach `om-open-pr` / `om-auto-create-pr`): PR implementacyjny ma `Closes #<dziecko>` i `Refs #<feature>`. Spec PR ma `Refs`.
6. **Config**: bez zmian. `automerge.mode` zostaje `prepare-and-merge` (D3).
7. **`AGENTS.md`**: zakaz używania skilli spoza OM. Instalacja `jq` (wymagana przez loader configu OM).

### Kolejność: wdrażamy zmianę jej własnym procesem

1. `om-prepare-issue` → issue `feature` z briefu.
2. `om-spec-writing` **interaktywnie**. Otwarte pytania są decyzjami ludzi, więc nie `--autonomous`. Spec trafia do `.ai/specs/`, a PR zawiera tylko design.
3. **[H]** akceptacja specu (merge).
4. `om-backlog --dry-run` z sekcji Phasing specu → **[H]** potwierdzenie → `om-backlog`. Dzieci to mniej więcej punkty 1–7 powyżej, typowo `documentation`/`chore`.
5. Każde dziecko: `om-auto-create-pr` → `om-auto-review-pr` → **[H]** merge.
6. Weryfikacja: w sandboksie po jednym testowym issue na kategorię. Sprawdzamy dozwolone i odmowne ścieżki, m.in. `om-auto-fix-issue` na `idea` → odmowa, `om-auto-implement-spec` na niezmergowanym specu → odmowa, `om-auto-manage-issues --dry-run` → poprawne `READY_STATUS`.

Paradoks startowy: dopóki bramek nie ma, kroki 2–5 trzeba prowadzić ręcznie z dyscypliną (bez `om-auto-fix-issue` na tym issue).

## 4. Decyzje (2026-11-11)

Zasada nadrzędna: **wszędzie, gdzie się da, używamy natywnego mechanizmu OM.** Lokalne rozszerzenia tylko wymuszają to, co OM już definiuje.

| # | Temat | Decyzja | Konsekwencja dla wdrożenia |
|---|---|---|---|
| D1 | Akceptacja designu Feature | Natywnie: człowiek inny niż autor ustawia **`Status: Accepted`** w specu i **merguje PR ze specem** na `main`. | `SDLC.md` definiuje `Accepted` jako jedyny status gotowy do implementacji (`Draft`, `Proposed`, `In review` nie są gotowe). Rozszerzenia `om-auto-implement-spec` i `om-backlog` uruchamiają bramkę R1 z `om-pre-implement-spec` (status, brak blokujących pytań, spec na `main`) i przy no-go odmawiają. `om-auto-fix-issue` na ścieżce feature kończy się na PR ze specem. |
| D2 | Gotowość | Natywnie: `READY_STATUS` liczony z DoR dla kategorii w `SDLC.md` plus waiver maintainera „ready as is”. **Bez nowej etykiety.** Start pracy to zawsze osobna komenda człowieka. | `SDLC.md` dostaje sekcję `## Definition of Ready` z tabelą dla kategorii. Reguła: `cez-autofix` nie służy do uruchamiania pracy na podstawie samej gotowości. |
| D3 | Automerge | Zostaje domyślne OM: `prepare-and-merge`. Uprawnienie do merge zostaje przy człowieku, bo bot działa wyłącznie na PR-ach, którym człowiek nadał etykietę `automerge`. | Config bez zmian. W briefie (Safety, Scope/Out) doprecyzować, że „autonomous merging” oznacza merge bez ludzkiej etykiety `automerge`. |
| D4 | Usunięte wymagania 4–5 i workbook | Usunięcie wymagań 4–5 jest ostateczne: bramki designu UI i traceability pokrywa natywne OM (etap Design, `Prototype:`, macierz stanów QA, `Closes`/`Refs`, R3). **Workbooki całkowicie pomijamy w tym repo** (wymaganie trafiło do briefu przez pomyłkę). Usunięte razem z nimi „client-data controls”. | Brak odwołań do workbook i client-data w briefie. Żadnego osobnego issue. |
| D5 | Lokalizacja specyfikacji | Natywnie `.ai/specs/`, briefy w `.ai/specs/briefs/`. | Brief przenosimy z `docs/` do `.ai/specs/briefs/`. |
| D6 | Mały feature | Każdy feature idzie przez spec. Coś, co nie potrzebuje specu, nie jest feature. | `SDLC.md` w tabeli ścieżek. W triage niepotrzebny spec oznacza przekwalifikowanie na chore, refactor albo docs. |
| D7 | Zmiany trywialne | Mogą iść bez issue, przez `om-auto-create-pr` ze `skip-qa`. | `SDLC.md` dostaje kryterium trywialności (literówka, jednolinijkowa poprawka docs lub configu, bez zmiany zachowania). |
| D8 | Intake a spec | `om-prepare-issue` zawsze z `--no-spec`. Klasyfikacja, `SPEC_STATUS` i `READY_STATUS` w triage (`om-auto-manage-issues`). | Rozszerzenie `om-prepare-issue`: domyślnie `--no-spec`. Rozszerzenie `om-auto-manage-issues`: dla documentation, refactor i chore dodatkowo propozycja rozmiaru. |
| D9 | Rozmiar dla documentation, refactor i chore | Mała zmiana idzie przez `om-auto-create-pr` bez specu. Duża przez spec → akceptacja (D1) → implementację, backlog opcjonalny. Kryterium natywne OM, propozycja w triage, decyzja człowieka. | Rozszerzenie `om-auto-fix-issue`: routing według kategorii i rozmiaru. Bramka D1 obejmuje też duże documentation, refactor i chore. |
| D10 | Backlog po specu | Po akceptacji specu człowiek decyduje: backlog (`om-backlog`) albo implementacja wprost (`om-auto-implement-spec`). Dotyczy feature i dużych documentation, refactor i chore. | `SDLC.md` opisuje obie gałęzie. Bez backlogu nie ma milestone'u elementów podrzędnych, a issue źródłowe zamyka PR implementacyjny (`Closes`). `do-not-close` na Feature tylko przy backlogu. |
| D11 | Ścieżka elementów backlogu | Elementy z `om-backlog` są już sklasyfikowane i mają design przez spec rodzica (`Design authority:`). Bez ponownej klasyfikacji i bez własnego specu, triage sprawdza tylko gotowość. Start: **[H]** `om-auto-fix-issue <nr>`. Zakres to wyłącznie kryteria akceptacji elementu, w kolejności `Depends on`. | Rozszerzenie `om-auto-fix-issue`: rozpoznaje element backlogu (`Backlog source:` + `Epic:`/`Story:`) i **nie** wywołuje `om-auto-implement-spec` na cały spec. Zamiast tego idzie przez `om-auto-create-pr --spec <rodzic>` z briefem zawężonym do elementu, z `Closes #element` i `Refs #epik #źródło`. Natywnie story z etykietą `feature` poszłaby ścieżką feature i zaimplementowała cały spec. |

## 5. Następne kroki

1. Doprecyzować brief według D3–D5 i przenieść go do `.ai/specs/briefs/`.
2. `om-prepare-issue --no-spec` → issue `feature` z briefu.
3. `om-spec-writing` (interaktywnie) → PR ze specem → **[H]** `Status: Accepted` + merge.
4. `om-backlog --dry-run` → **[H]** potwierdzenie → `om-backlog`.
5. Dzieci kolejno przez `om-auto-create-pr` → review → **[H]** merge. Na koniec scenariusze weryfikacyjne z rozdz. 3.
