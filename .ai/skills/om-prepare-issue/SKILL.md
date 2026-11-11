# om-prepare-issue: repo-local extension

Installed skill: `.claude/skills/om-prepare-issue/SKILL.md`. Read it and apply it unchanged. This file only adds the rules below. Where they do not apply, the installed skill's behavior stands.

Source: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (Extensions A and B), `SDLC.md` § Categories and § Routes.

## Category list (adds two values)

The category list is `idea`, `feature`, `bug`, `refactor`, `documentation`, `chore`, `security`, `dependencies`. Every native rule still applies:
- add exactly one category label when none is present;
- never replace an existing one;
- keep the label guards of `.ai/trackers/github.md`.

The two added values:
- `idea`: an incomplete need whose outcome or approach is not decided ("maybe we need…", "explore whether…"). If the expected outcome is stated, it is a `feature`.
- `chore`: maintenance with no behavior change, such as tooling, configuration, CI, or repository housekeeping.

Tie-breakers for `chore`:
- a version bump of a third-party package is `dependencies`;
- a docs-only change is `documentation`;
- a restructuring of code or skills is `refactor`.

When unsure between `idea` and another category, prefer `idea`, because it starts no work. The category is provisional until a human confirms it in triage (`SDLC.md` § Routes).

## Next-step hints (route-correct)

Shared rules:
- Change only the suggested next step. Chaining, gates, label rules, the `Issue:`/`Spec:`/`PR:` lines, and output formats stay as in the installed skill.
- Never run a suggested command.
- A `Next:` line is one line: either `Next: none`, or a command that can be run exactly as written, with every `<n>` replaced by a real number. Never emit a placeholder or a multi-line brief in a `Next:` line.
- An issue is a **backlog item** when its body has `Backlog source:` and an `Epic:` or `Story:` line. This rule wins over the category label. An issue with `Backlog source:` and neither line is an **epic**, and gets no command.
- `bug`, `security`, and `dependencies` keep the native hint.

### om-prepare-issue
- **Issue body:** where the native body suggests `om-auto-fix-issue <n>`, write instead: "Next: triage (`om-auto-manage-issues <n>`), then the `<category>` route in `SDLC.md` § Routes."
- **Report `Next:` line:** `Next: om-auto-manage-issues <n>`.
- **Backlog items filed for `om-backlog`:** the body is the brief `om-backlog` handed over. Add no hint.
