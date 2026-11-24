# SDLC Canvas for the GitHub Copilot app

Extends: .ai/specs/2026-11-11-issue-first-sdlc-adaptation.md

## 📝 TLDR

Proposed: a canvas extension for the GitHub Copilot app that shows every open issue and PR of this repository at its position on the routes in `SDLC.md` § Routes, and offers the next allowed command for it. Today, a person works out the route, the readiness, and the next command by reading `SDLC.md`, the issue labels, and the triage comments, and then types the command by hand. The canvas would make that position visible and turn each move to the next activity into one explicit click by a human. It never starts work on its own, because readiness never triggers automated work.

## ❓ Open Questions

Answer each before the design goes further. Each answer changes the architecture or the scope.

- **Q1 — Process entry.** The SDLC is issue-first: a `feature` needs an issue and triage before its spec. Do we (a) file a `feature` issue now with `om-prepare-issue --no-spec` and treat this file as the draft for its spec PR, or (b) treat this as an `idea` and run `om-brainstorm` first?
- **Q2 — What the canvas may do.** (a) Read-only board: it shows the position and the next command, and the human copies the command into chat. (b) Launcher: a button sends the next command to the agent session after a confirmation. (c) (a) first, (b) in a later phase.
- **Q3 — Split.** The board (Q2 a) and the launcher (Q2 b) work without each other. One spec with two phases, or two specs?
- **Q4 — Which part of the SDLC is in scope for the MVP.** (a) Issue routes only: category, triage, readiness, and the next command. (b) Also PRs: the label state machine, review, the QA gate, and merge readiness. (c) Also milestones: spec acceptance, backlog epics, and source-issue completion.
- **Q5 — Where the route rules come from.** (a) Parse the `SDLC.md` § Routes table at runtime. (b) Hard-code them in the extension and add a drift check. (c) Add a machine-readable route map to `.ai/agentic.config.json`. This is a process change and goes through `om-customize-workflow`.
- **Q6 — How the canvas reads GitHub.** (a) Through agent actions that run the read-only operations in `.ai/trackers/github.md`. (b) Directly from the extension's Node side, with `gh` or the REST API under the user's own login. In both cases the canvas writes nothing except through OM commands.
- **Q7 — Scope and location.** (a) Project scope in `.github/extensions/sdlc-canvas/`, committed and shared with the team. This makes it a process surface: no `automerge`, and a human merge. (b) User scope in `~/.copilot/extensions/` for now, with the source kept in this repository.

## 📝 Problem Statement

{To fill after the gate. Seed: who, meaning the Author and the Maintainer from `SDLC.md` § Roles; the pain, which is that the route, readiness, and next command are spread across `SDLC.md`, the labels, and the triage comments; and the evidence, which is two drift reviews (#35, #37) that found hints out of step with § Routes.}

## 📝 Proposed Solution

{To fill after the gate. Fixed constraints, whatever the answers are:}

- Every move to the next activity is a click by a human, meaning **[H]** in § Routes. The canvas never chains commands and never polls readiness into an action.
- The canvas shows only the commands that § Routes allows for the category, and it shows the "Do not use" column as a warning.
- The canvas never sets `Status: Accepted`, `qa-approved`, `qa`, `automerge`, `blocked`, `do-not-merge`, or `claim-reset`. Those labels and statuses belong to humans or to the skills named in `SDLC.md`.
- The canvas stores no secrets and no identities in the repository or in its state files.

## 📝 Background: the canvas runtime (research, to confirm against the official docs)

- A canvas is an HTML/JS view in an iframe in the Copilot app's side panel. Its behavior is a Node `extension.mjs` module, which declares agent-callable actions through `joinSession` and `createCanvas(...)` (the `github/copilot-sdk` package).
- The data flows both ways. The agent calls canvas actions to update the shared state, and a click in the UI either triggers an action or is handled locally.
- There are two scopes, `.github/extensions/<name>/` for the project and `~/.copilot/extensions/<name>/` for the user, and state is stored per session or per extension.
- Not yet confirmed: the permission model for actions, shell and `gh` access from the extension, and the default action timeout, which may be about 60 s. Check them in docs.github.com: "Working with canvas extensions".
