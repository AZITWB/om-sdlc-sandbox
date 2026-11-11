# Issue-First SDLC Adaptation (OM): Feature Brief

## Problem Statement

The team has no clear, agreed distinction between four things:

- capturing an incomplete need,
- authorizing the next activity,
- accepting a design, and
- implementing bounded work.

Today, every change tends to get the same heavy specification and backlog process, whatever its type or risk. No verified route exists for each issue type.

## Feature

Adapt SDLC intake and controlled delivery using existing OM skills. Each issue category gets its own route. Required information, human decisions, and next activities are explicit. There is no one-size-fits-all workflow.

## Requirements

### Functional

1. **Categorization:** Classify each issue as idea, feature, bug, refactor, documentation, or chore.
2. **Readiness baseline:** Each category defines the minimum information needed before the next activity. Readiness never triggers automated work. It needs an explicit human command.
3. **Proportionate routing:**
   - **Feature:** specification → human design acceptance → backlog proposal → implementation.
   - **Bug, refactor, chore, documentation:** short, bounded routes with no mandatory full spec or backlog hierarchy.
4. **Design gates (before implementation):**
   - **Browser UI:** new or changed screens or flows need a mock (default, empty, error, 360px) and human approval.
   - **Workbook usability:** changes to navigation, layout, or protected cells need a representative mock and human approval.
5. **Traceability:** Every PR links back to its source issue and specification.

### Non-Functional

- **Tooling:** Use only existing OM capabilities, configuration, and scoped local extensions. No external pipelines or non-OM skills.
- **Role independence:** Keep the roles separate (issue owner, author, reviewer, designer, QA reviewer, maintainer). Automation does not replace human QA or design approval.
- **Safety:** Merge authority, protected workbook behavior, and client-data controls stay unchanged.

## Scope

- **In:** idea intake, triage, readiness, design acceptance, backlog handoff, proportionate delivery routes.
- **Out:** rollout planning, skill-install cleanup, lockfile changes, event-driven execution, autonomous merging, product implementation (migration, deployment, client distribution).

## Constraints

- Do not modify vendored skills to override safety restrictions.
- Implementation cannot start until the design gates are met.
- Backlog publication and readiness are separate human decisions.
- Specification acceptance is not implementation authorization.

## Success Criteria

- Contributors can identify the right route and readiness information for any issue category.
- Incomplete needs can be captured without forcing spec or implementation work.
- Allowed and refused readiness paths are explicit.
- Design is accepted before implementation starts.
- Design acceptance, child-item completion, and source Feature completion are defined as separate milestones.
