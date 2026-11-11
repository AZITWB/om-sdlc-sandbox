# Issue routes: flow diagram

This diagram illustrates [`SDLC.md` § Routes](SDLC.md#routes). The table there is the source of truth: when the diagram and the table disagree, the table wins. Update this file whenever § Routes changes.

**Legend.** Each node shape has one meaning:
- **Hexagon:** a human decision.
- **Rounded box:** a command a human runs. All **[H]** steps in § Routes are one of these two shapes.
- **Plain box:** what a skill or GitHub does on its own.

Readiness never starts work. Before each human command, check the readiness column of § Routes.

```mermaid
flowchart TD
    need([Need or change]) --> trivialQ{{"Trivial?<br/>see Trivial changes"}}
    trivialQ -- yes --> trivialRun("om-auto-create-pr with the task, no issue")
    trivialRun --> trivialPR["PR: documentation or refactor + skip-qa"]
    trivialPR --> merge

    trivialQ -- no --> brainstorm("optional: om-brainstorm")
    brainstorm --> intake("om-prepare-issue --no-spec")
    intake --> triage["Triage: om-auto-manage-issues<br/>labels, readiness, prep notes"]
    triage --> confirm{{"Confirm the category,<br/>or re-categorize in GitHub and re-run triage"}}
    triage -.- prepNote["For an idea, run triage with --no-prep"]

    confirm -- idea --> ideaQ{{"Re-categorize or close"}}
    ideaQ -- re-categorize --> confirm
    ideaQ -- close --> closed([Closed])

    confirm -- "bug or security" --> bugRun("om-auto-fix-issue n<br/>or om-fix-issue n, then om-open-pr n bug")
    bugRun --> pr

    confirm -- "refactor, documentation,<br/>chore, dependencies" --> sizeQ{{"Size?<br/>small = small, local, obvious"}}
    sizeQ -- small --> assignTask("Assign yourself")
    assignTask --> taskRun("om-auto-create-pr with the task brief template")
    taskRun --> pr
    sizeQ -- "large (not dependencies)" --> largeNote("Comment: needs a spec (large)")
    largeNote --> specPR

    confirm -- feature --> specPR("Spec PR: om-auto-write-spec n,<br/>or om-spec-writing + om-open-pr, with Refs")
    specPR --> accept{{"Set Status: Accepted and merge the spec PR"}}
    accept --> deliveryQ{{"Delivery: backlog, direct, or phased direct?"}}

    deliveryQ -- backlog --> backlogDry("om-backlog spec --dry-run")
    backlogDry --> backlogOk{{"Confirm the tree"}}
    backlogOk --> backlogRun("om-backlog spec, then commit backlog.md")
    backlogRun --> item

    deliveryQ -- direct --> directComment("Comment Accepted spec: path on the issue")
    directComment --> directRun("om-auto-implement-spec n")
    directRun --> pr

    deliveryQ -- "phased direct" --> phaseRun("om-auto-create-pr per phase, no --spec<br/>intermediate PRs Refs, last PR Closes")
    phaseRun --> pr

    item["Backlog item: story or task"] --> assignItem("Assign yourself")
    assignItem --> startRun("Run the command in the item's Start section,<br/>in Depends on order")
    startRun --> pr

    pr["PR: review and labels by the skills"] --> merge{{"Merge<br/>never automerge on spec or process PRs"}}
    merge --> done([Issue closed by the PR's closing keyword])

    classDef human fill:#fff3cd,stroke:#b8860b,color:#000
    classDef cmd fill:#e7f1ff,stroke:#3b6fb6,color:#000
    class trivialQ,confirm,ideaQ,sizeQ,accept,deliveryQ,backlogOk,merge human
    class trivialRun,brainstorm,intake,bugRun,assignTask,taskRun,largeNote,specPR,backlogDry,backlogRun,directComment,directRun,phaseRun,assignItem,startRun cmd
```

**Do not use** (from § Routes):

| Route | Do not use |
|---|---|
| idea | any spec or implementation command |
| feature | `om-auto-fix-issue`, `om-prepare-issue` without `--no-spec`, triage with `--write-missing-specs` |
| backlog item | `om-auto-fix-issue`, `om-auto-implement-spec`, `om-auto-create-pr --spec`, or any brief naming the parent spec |
| refactor, documentation, chore | `om-auto-fix-issue` |
