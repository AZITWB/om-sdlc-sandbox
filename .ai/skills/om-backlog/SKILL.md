# om-backlog: repo-local extension

Installed skill: `.claude/skills/om-backlog/SKILL.md`. Read it and apply it unchanged. This file only adds the rules below. Where they do not apply, the installed skill's behavior stands.

Source: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (Extension B) and `SDLC.md` § Routes.

## Next-step hints (route-correct)

Shared rules:
- Change only the suggested next step. Chaining, gates, label rules, the `Issue:`/`Spec:`/`PR:` lines, and output formats stay as in the installed skill.
- Never run a suggested command.
- A `Next:` line is one line, either `Next: none` or a command that can be run exactly as written, with every `<n>` replaced by a real number. Never emit a placeholder or a multi-line brief in a `Next:` line.
- An issue is a **backlog item** when its body has `Backlog source:` and an `Epic:` or `Story:` line. This rule wins over the category label. An issue with `Backlog source:` and neither line is an **epic**: it gets no command.
- `bug`, `security`, and `dependencies` keep the native hint.

### om-backlog

**Story and task bodies.** The brief handed to `om-prepare-issue` ends with a `## ▶️ Start` section. That section holds the backlog-item brief template from `SDLC.md` § Routes, filled in with this item's number, id, title, and acceptance criteria. It never contains a spec path. Epic bodies get no Start section.

**`Next:` lines.**
- On a real run, the line is `Next: none`. The report adds: "Start each item with the command in its body, in `Depends on` order."
- On a dry run or a readiness stop, the `Next:` line stays native.
