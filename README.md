# om-sdlc-sandbox

A process sandbox for the Open Mercato agent skills, the pipeline configuration that drives them, and the design documents for the team's issue-first SDLC.

## Contributing

Work here is issue-first: every issue takes a route chosen by its category.

- [§ Routes](SDLC.md#routes): which commands each issue category goes through, and what must be ready before each one.
- [§ Categories](SDLC.md#categories): which category label fits your issue.

### Where to start

Find what you want to do, then follow the named row in [§ Routes](SDLC.md#routes). The category is provisional until a human confirms it in triage.

| I want to… | Category | Route row in § Routes |
|---|---|---|
| raise an idea whose outcome or approach is not decided yet | `idea` | [idea](SDLC.md#routes) |
| add a new capability with a decided outcome | `feature` | [feature](SDLC.md#routes) |
| report behavior that differs from what was intended | `bug` | [bug (and security)](SDLC.md#routes) |
| restructure code or skills without changing behavior | `refactor` | [refactor / documentation / chore, small or large](SDLC.md#routes) |
| change documentation only | `documentation` | [refactor / documentation / chore, small or large](SDLC.md#routes) |
| do maintenance: tooling, configuration, CI, housekeeping | `chore` | [refactor / documentation / chore, small or large](SDLC.md#routes) |
| report a vulnerability or propose hardening | `security` | [bug (and security)](SDLC.md#routes) |
| bump a third-party version | `dependencies` | [refactor / documentation / chore (and dependencies), small](SDLC.md#routes) |
