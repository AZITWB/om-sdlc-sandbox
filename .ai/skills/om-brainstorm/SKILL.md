# om-brainstorm: repo-local extension

Installed skill: `.claude/skills/om-brainstorm/SKILL.md`. Read it and apply it unchanged. This file only adds the rules below. Where they do not apply, the installed skill's behavior stands.

Source: `.ai/specs/2026-11-11-issue-first-sdlc-adaptation.md` (Extension B) and `SDLC.md` § Routes.

## Next-step hints (route-correct)

Shared rules:
- Change only the suggested next step. Chaining, gates, label rules, the `Issue:`/`Spec:`/`PR:` lines, and output formats stay as in the installed skill.
- Never run a suggested command.
- A `Next:` line is one line. It is either `Next: none`, or a command that can be run exactly as written, with every `<n>` replaced by a real number. Never emit a placeholder or a multi-line brief in a `Next:` line.
- An issue is a **backlog item** when its body has `Backlog source:` and an `Epic:` or `Story:` line. This rule wins over the category label.
- An issue with `Backlog source:` and neither line is an **epic**. It gets no command.
- `bug`, `security`, and `dependencies` keep the native hint.

### om-brainstorm

- **Ramp 2:** suggest `om-prepare-issue --no-spec "<goal> — brief: <path>"`.
- **Ramp 6:**
  - For a `bug`, `security`, or `dependencies` issue, keep the native line.
  - Otherwise, use `Next: om-auto-manage-issues <n>`.
  - The `Issue:` line stays either way.
- **Ramps 3 and 5:** these stay native. `SDLC.md` § Routes requires an issue first unless the change is trivial.
