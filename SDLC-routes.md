# SDLC flow diagrams

Three small diagrams, each answering one question:
1. **Routes:** which route does an issue take?
2. **PR path:** where do tests and QA happen, from code to merge?
3. **Design:** how does a user-facing change get designed?

They illustrate [`SDLC.md`](SDLC.md), which is the source of truth. When a diagram and `SDLC.md` disagree, `SDLC.md` wins. Update this file whenever the sections each diagram cites change.

**Legend** (shared by all three):
- **Hexagon (yellow):** a human decision.
- **Rounded box (blue):** a command a human runs. All **[H]** steps in § Routes are one of these two shapes.
- **Plain box:** what a skill or GitHub does on its own.
- **Slanted box (red):** a gate that blocks the merge until it passes.
- **Diamond:** a branch that follows a label, not a new decision.
- **Pill:** a start or an end.

The diagrams connect: the commands that lead into the **PR** node of diagram 1 expand into diagram 2, and diagram 3 is the Design stage, which comes before implementation for any user-facing change; for a feature, `om-ux-design` works from the spec.

## 1. Routes

Source: [`SDLC.md` § Routes](SDLC.md#routes). Readiness never starts work: before each human command, check the readiness column of § Routes.

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
    accept --> deliveryQ{{"Delivery: backlog or direct?"}}

    deliveryQ -- backlog --> backlogDry("om-backlog spec --dry-run")
    backlogDry --> backlogOk{{"Confirm the tree"}}
    backlogOk --> backlogRun("om-backlog spec, then commit backlog.md")
    backlogRun --> item

    deliveryQ -- direct --> directComment("Comment Accepted spec: path on the issue")
    directComment --> directRun("om-auto-implement-spec n")
    directRun --> pr

    item["Backlog item: story or task"] --> assignItem("Assign yourself")
    assignItem --> startRun("Run the command in the item's Start section,<br/>in Depends on order")
    startRun --> pr

    pr["PR: review and labels by the skills"] --> merge{{"Merge<br/>never automerge on spec or process PRs"}}
    merge --> done([Issue closed by the PR's closing keyword])

    classDef human fill:#fff3cd,stroke:#b8860b,color:#000
    classDef cmd fill:#e7f1ff,stroke:#3b6fb6,color:#000
    class trivialQ,confirm,ideaQ,sizeQ,accept,deliveryQ,backlogOk,merge human
    class trivialRun,brainstorm,intake,bugRun,assignTask,taskRun,largeNote,specPR,backlogDry,backlogRun,directComment,directRun,assignItem,startRun cmd
```

**Do not use** (from § Routes):

| Route | Do not use |
|---|---|
| idea | any spec or implementation command |
| feature | `om-auto-fix-issue`, `om-prepare-issue` without `--no-spec`, triage with `--write-missing-specs` |
| backlog item | `om-auto-fix-issue`, `om-auto-implement-spec`, `om-auto-create-pr --spec`, or any brief naming the parent spec |
| refactor, documentation, chore | `om-auto-fix-issue` |

## 2. PR path: tests and QA

Sources: [`SDLC.md` § Ticket lifecycle](SDLC.md#ticket-lifecycle) (rows Implement, PR, Review loop, QA, Merge), [§ Label state machine](SDLC.md#label-state-machine), [§ The QA gate](SDLC.md#the-qa-gate), and [§ Validation gate](SDLC.md#validation-gate).

```mermaid
flowchart TD
    start([Route command from diagram 1]) --> impl["Implement with regression tests<br/>om-auto-create-pr, or om-fix"]
    impl --> vgate[/"Validation gate: validation.commands"/]
    vgate -- red --> impl
    vgate -- green --> open["PR opened with labels: review + needs-qa or skip-qa<br/>om-auto-create-pr or om-open-pr"]
    open --> review["Review: om-auto-review-pr<br/>om-code-review checklist + CODE_REVIEW.md"]
    review -- "changes requested" --> impl
    review -- approved --> qaQ{"PR label: needs-qa or skip-qa?"}

    qaQ -- "skip-qa: docs, deps, CI, tests" --> merge
    qaQ -- "needs-qa" --> env("om-prepare-test-env: boot the app once")
    env --> qaRun("om-auto-qa-pr: real browser,<br/>screenshots, pass/fail report, no labels")
    qaRun -.- keep["A flow worth keeping becomes<br/>om-integration-tests coverage"]
    qaRun --> signoff{{"QA reviewer decides pass or fail<br/>self-QA (no reviewer capacity): risk-low or risk-medium only"}}
    signoff -- fail --> failed("QA reviewer applies qa-failed:<br/>back to the author")
    failed --> impl
    signoff -- pass --> approved("QA reviewer applies qa-approved<br/>+ comment with QA head: sha<br/>self-QA also adds qa-self-verified")
    approved -.- stale["Push after QA head: the label stays but is stale;<br/>om-approve-merge-pr asks to confirm, or QA re-tests"]
    approved --> qaGate[/"QA gate: needs-qa merges only with qa-approved"/]
    qaGate --> merge{{"Merge: om-approve-merge-pr or a human<br/>blocked by qa-failed, blocked, do-not-merge, or an active qa label"}}
    merge --> mergedEnd([Merged: the process stops here])
    mergedEnd -.-> after("Optional, per window of merged PRs: om-auto-qa-scenarios<br/>installed skill, not in SDLC.md")

    classDef human fill:#fff3cd,stroke:#b8860b,color:#000
    classDef cmd fill:#e7f1ff,stroke:#3b6fb6,color:#000
    classDef gate fill:#fde2e1,stroke:#b42318,color:#000
    class signoff,merge human
    class env,qaRun,failed,approved,after cmd
    class vgate,qaGate gate
```

## 3. Design for user-facing changes

Sources: [`SDLC.md` § Ticket lifecycle](SDLC.md#ticket-lifecycle) (rows Design, Review loop), [§ The QA gate](SDLC.md#the-qa-gate) (the UI bullet), and [§ Amending this process](SDLC.md#amending-this-process) (`om-ux-setup`). The Design stage applies to any user-facing change, whether or not it has a spec.

```mermaid
flowchart TD
    uiQ{{"Does the change touch UI?"}} -- no --> skipD([Skip the Design stage])
    skipD --> implD
    uiQ -- yes --> shape("om-ux-shape: flow and states<br/>empty, loading, error, no permission<br/>or a human designer")
    shape --> detailQ{{"Detailed screens wanted?"}}
    detailQ -- yes --> uxd("om-ux-design: detailed screens and prototype<br/>from the spec, with repository components")
    uxd --> acceptD{{"Accept one design version"}}
    acceptD --> proto["The accepted version becomes<br/>Prototype: in the spec"]
    detailQ -- no --> flowOnly["The flow and its states are decided<br/>om-ux-shape handoff"]
    detailQ -.- figma("Design-tool path: om-figma-design-with-ds<br/>writes a brief or audits a design against .uxproof/<br/>installed skill, not in SDLC.md")
    proto --> implD["Implement: diagram 2"]
    flowOnly --> implD
    implD --> uxReview("om-ux-review-pr: design pass on changed screens<br/>advisory, does not hold the merge")
    uxReview --> qaD[/"QA on needs-qa: state matrix, plus the design contract when .uxproof/ exists<br/>a missing state fails QA"/]

    setup("Once per repo: om-ux-setup<br/>extracts the design contract") -.-> shape
    setup -.-> uxd
    setup -.-> uxReview
    setup -.-> qaD
    setup -.-> figma

    classDef human fill:#fff3cd,stroke:#b8860b,color:#000
    classDef cmd fill:#e7f1ff,stroke:#3b6fb6,color:#000
    classDef gate fill:#fde2e1,stroke:#b42318,color:#000
    class uiQ,detailQ,acceptD human
    class shape,uxd,uxReview,setup,figma cmd
    class qaD gate
```
