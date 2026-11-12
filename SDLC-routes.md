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

The diagrams connect: the **PR** node of diagram 1 is where diagram 2 starts, and the **Spec PR** step of a user-facing feature is where diagram 3 happens.

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

Sources: [`SDLC.md` § Ticket lifecycle](SDLC.md#ticket-lifecycle) (rows Implement, Review loop, QA) and [§ The QA gate](SDLC.md#the-qa-gate).

```mermaid
flowchart TD
    start([PR from a route in diagram 1]) --> impl["Implement with regression tests<br/>om-auto-create-pr or om-fix"]
    impl --> vgate[/"Validation gate: validation.commands"/]
    vgate -- red --> impl
    vgate -- green --> review["Review: om-auto-review-pr<br/>om-code-review checklist + CODE_REVIEW.md"]
    review -- changes requested --> impl
    review -- approved --> qaQ{"PR label: needs-qa or skip-qa?<br/>set by the skill when the PR opens"}

    qaQ -- "skip-qa: docs, deps, CI, tests" --> merge
    qaQ -- needs-qa --> env("om-prepare-test-env: boot the app once")
    env --> qaRun("om-auto-qa-pr: real browser,<br/>screenshots, pass/fail report")
    qaRun -.- keep["A flow worth keeping becomes<br/>om-integration-tests coverage"]
    qaRun --> signoff{{"QA reviewer decides<br/>self-QA only on risk-low or risk-medium"}}
    signoff -- fail --> failed["qa-failed: back to the author"]
    failed --> impl
    signoff -- pass --> approved["qa-approved + QA head: sha<br/>a later push stales it"]
    approved --> qaGate[/"QA gate: needs-qa merges only with qa-approved"/]
    qaGate --> merge{{"Merge: om-approve-merge-pr or a human<br/>blocked by qa-failed, blocked, do-not-merge"}}
    merge --> after("Optional after merge: om-auto-qa-scenarios<br/>manual QA scenarios for testers")

    classDef human fill:#fff3cd,stroke:#b8860b,color:#000
    classDef cmd fill:#e7f1ff,stroke:#3b6fb6,color:#000
    classDef gate fill:#fde2e1,stroke:#b42318,color:#000
    class signoff,merge human
    class env,qaRun,after cmd
    class vgate,qaGate gate
```

## 3. Design for user-facing changes

Sources: [`SDLC.md` § Ticket lifecycle](SDLC.md#ticket-lifecycle) (rows Design, Review loop), [§ The QA gate](SDLC.md#the-qa-gate) (the UI bullet), and [§ Amending this process](SDLC.md#amending-this-process) (`om-ux-setup`).

```mermaid
flowchart TD
    uiQ{{"Does the change touch UI?"}} -- no --> skipD["Skip the Design stage"]
    uiQ -- yes --> shape("om-ux-shape: flow and states<br/>empty, loading, error, no permission")
    shape --> detailQ{{"Detailed screens wanted?"}}
    detailQ -- yes --> uxd("om-ux-design from the spec,<br/>or om-figma-design-with-ds")
    uxd --> acceptD{{"Accept one design version"}}
    acceptD --> proto["The accepted version becomes<br/>Prototype: in the spec"]
    detailQ -- no --> flowOnly["The flow and its states are recorded in the spec"]
    proto --> implD["Implement: diagram 2"]
    flowOnly --> implD
    implD --> uxReview("om-ux-review-pr: design pass on changed screens<br/>advisory, does not hold the merge")
    uxReview --> qaD[/"QA: state matrix and design contract (.uxproof/)<br/>a missing state fails QA"/]

    setup("Once per repo: om-ux-setup<br/>extracts the design contract") -.-> shape
    setup -.-> qaD

    classDef human fill:#fff3cd,stroke:#b8860b,color:#000
    classDef cmd fill:#e7f1ff,stroke:#3b6fb6,color:#000
    classDef gate fill:#fde2e1,stroke:#b42318,color:#000
    class uiQ,detailQ,acceptD human
    class shape,uxd,uxReview,setup cmd
    class qaD gate
```
