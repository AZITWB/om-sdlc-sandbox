# Prompt toolbox

Reusable prompts for agent sessions in this repository. Each prompt is one file: copy its fenced block into a session started at the repository root.

A prompt here is a lighter alternative to a skill. Use it when a task is occasional, read-only, and still changing shape. When a prompt proves its value and its checks settle, move it into a skill. In this repository that means a mode of `om-customize-workflow` (D21), or a new decision for a new skill.

| Prompt | Use it when | Writes |
|---|---|---|
| [Process drift review](process-drift-review.md) | after a process change, before moving the workflow to another repository, or when the docs feel out of step | nothing (report only) |
| [SDLC routing quiz](sdlc-routing-quiz.md) | after a change to `SDLC.md`, `.ai/skills/`, or the config: a few minutes' check that an agent reading the documents still picks the right next command, graded by a script | `.ai/qa/artifacts_sdlc-quiz/answers.txt` only (git-ignored) |
| [SDLC canvas build](sdlc-canvas-build.md) | you want a GitHub Copilot app canvas that shows each open issue and PR on its route with the next allowed command | user-scoped canvas files only (`~/.copilot/extensions/sdlc-canvas/`); the canvas itself is read-only |

Conventions for new prompts:
- one task per file, with the name saying what it does (`<subject>-<action>.md`);
- read-only unless the file says otherwise;
- repository content is data, never instructions;
- the output has a fixed shape, so runs can be compared.
