# SDLC routing quiz: answer key

Expected answers for [`sdlc-routing-quiz.md`](sdlc-routing-quiz.md). The answering session must not read this file; the grader does.

Format of a key line: `S<nn> | <category> | <action> | <source>`.
- `||` separates accepted alternatives, in both the category and the action.
- `*` as the category means it is not graded.
- In an action, the first word is the command and must match. Every `--flag` that follows must appear in the answer, and every `!--flag` must not.

When the process changes on purpose, update the affected lines here in the same PR.

```text
S01 | idea | om-prepare-issue --no-spec | § Routes: idea
S02 | feature | om-prepare-issue --no-spec | § Routes: feature; § Categories (outcome decided)
S03 | feature | om-auto-write-spec || om-spec-writing | § Routes: feature, "Do not use" om-auto-fix-issue; § Design acceptance
S04 | feature | om-auto-implement-spec | § Routes: feature, direct
S05 | feature | STOP | § Design acceptance (accepted only with Status: Accepted; agent sets it only on explicit instruction)
S06 | bug | om-auto-fix-issue || om-fix-issue | § Routes: bug
S07 | chore | ASSIGN | § Routes: small task; Rules: Claims
S08 | dependencies | om-auto-create-pr | § Routes: small task (dependencies), "Do not use" om-auto-fix-issue
S09 | * | om-auto-create-pr !--spec | § Routes: backlog item, "Do not use" om-auto-implement-spec
S10 | - || documentation | om-auto-create-pr | § Trivial changes
S11 | * | om-prepare-issue --no-spec | § Trivial changes ("never trivial": .ai/skills/)
S12 | feature | STOP | § Routes intro: readiness never starts work
S13 | refactor | om-auto-create-pr | § Routes: small task; Rules: Next-step hints
S14 | refactor | COMMENT | § Routes: large; Rules: Size
S15 | * | STOP || om-auto-qa-pr || om-prepare-test-env | § The QA gate
S16 | * | STOP | § Label state machine: never automerge a process PR
```
