---
title: "Plan an Epic's Stories"
description: Talk to Sofia to refine an epic, plan its stories in build order, decide which stories need human oversight or unattended runs, and see what is ready.
sidebar:
  order: 5
---

Use Sofia, the Product Owner (`bmad-agent-po`), to run **epic inception**: the just-in-time planning pass right before you start building an epic, turning its thin outline into a refined spec, any epic-specific UX or technical design it needs, and a few complete stories that coding agents can build and a person can verify. Run epic inception only on the epic you will build next; later epics stay as thin outlines until their turn arrives, so what the first epic teaches you can still reshape them.

- The initiative is split into epics and you are ready to start one
- An epic's stories have not been planned yet, or a mid-flight change made them stale
- You want to decide which stories run interactively and which can run unattended

## Steps

### 1. Refine the Epic

Name the epic you want to prepare:

```text wrap
/bmad-agent-po refine the door check-in epic
```

Sofia reads the epic outline and the initiative requirements it covers. When the epic still has open product questions, such as how the flow behaves for users, business rules, or how to measure success, she stops and recommends opening a fresh chat with John (`bmad-agent-pm`) to write an epic PRD inside that epic's folder. She never runs John inside her own chat. When everything is already settled, or when you tell her to proceed without an epic PRD, she derives the epic's requirements directly from the initiative and any notes saved for that epic.

Before slicing stories, Sofia also checks whether the epic needs design or technical alignment and offers specialist runs automatically:

- If the epic includes user-facing screens or flows without an epic UX design yet, she recommends a fresh chat with Sally (`bmad-agent-ux-designer`) to settle screen states, flows, and mockups.
- If the epic introduces non-trivial API contracts, schemas, migrations, or state flows without an epic architecture doc yet, she recommends a fresh chat with Winston (`bmad-agent-architect`) to design them against your live codebase.

For open technical or domain questions, you can also run `bmad-deep-recon`. Each finished document lands inside the epic's folder so Sofia can link it into the stories. Once the epic's requirements are settled with no blocking open questions, Sofia marks the epic refined.

### 2. Plan the Stories

Ask Sofia to plan the epic's stories:

```text wrap
/bmad-agent-po plan the door check-in epic's stories
```

If John wrote an epic PRD with a chunky story slice map, Sofia adopts its story boundaries and coverage directly and shows the list once for your confirmation. Otherwise, she drafts the whole epic, brings you any unknowns that must be settled first, and presents each story with what it delivers, how you will verify it, which requirements it covers, and which earlier stories it waits on. Before asking for your approval, fresh check agents verify that every requirement is covered, that dependencies have no cycles, and that no shared setup or handoff prerequisite is missing. You can adjust story sizes, order, and dependencies until the plan looks right; the checks run again whenever you change the breakdown.

Each story is one complete user capability a person can see working end to end and verify in one sitting. Stories are intentionally chunky: most epics hold one to three stories rather than a long list of tiny tasks. Implementation steps stay inside the build session's own plan and never become separate tickets. Sofia merges slices that cannot be verified on their own, and splits a story rather than leaving placeholders wired up later. Initial setup belongs in the first story that needs it, tests go in every story, and production rollout belongs in the final story unless you specifically ask for a separate end-to-end test suite.

The first story proves the riskiest end-to-end path early. Inside a large story, `bmad-build` often starts with a thin vertical slice across every layer the story touches and expands from there; that sequencing lives in the build plan rather than separate tickets. Cleanup work deferred during builds is not turned into a story either, because the retrospective you run when the epic finishes collects it.

Once you approve the breakdown, Sofia writes the ordered story list into the epic's `tickets/tickets.toml` linking any UX or architecture files. By default, she then immediately writes a full refined story file (`tickets/story-<slug>.md`) for every story in the epic, complete with Given/When/Then acceptance criteria, measurement checks, boundaries, and verified references, so coding agents have clear checks from the start. If you prefer to keep later stories light until you reach them, tell Sofia to detail only the next story now and leave the rest as lightweight entries until pickup.

### 3. Decide Who Builds What

Build the risky and foundational stories interactively with `bmad-build` so you can guide the patterns that later stories follow. Stories whose behavior and contracts are already settled can run unattended with `bmad-build-auto`, where nobody answers questions mid-run.

- Tell Sofia when a story includes manual or real-world human steps (such as pairing physical hardware or requesting vendor access) so she marks it as needing a human and keeps unattended loops from picking it up.
- Set unattended checkpoints with Sofia when you plan to run stories unattended. She asks whether any story should pause for your approval before coding starts or pause after it finishes before the next story begins, proposing a pre-coding approval pause on risky stories. You can adjust default workflow behavior anytime with `bmad-customize`; see [Build and Verify](../build/build-and-verify.md#run-stories-unattended).

Before starting an unattended run, have Sofia double-check the story set with you:

```text wrap
/bmad-agent-po review the stories
```

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app:

**You:**

```text wrap
/bmad-agent-po refine the door check-in epic, then plan its stories
```

**Sofia:** I mapped 3 stories in build order with every requirement covered and no open unknowns. Story 1.1 includes a manual step because facilities mounts and pairs each door tablet, so I marked it as needing a human. Approve this breakdown so I can write the refined story files?

**You:** Approve.

Sofia writes the ordered entries to `tickets/tickets.toml` and creates the three refined story files beside it: `tickets/story-show-each-room-on-its-door-tablet.md`, `tickets/story-check-in-at-the-door.md`, and `tickets/story-show-todays-bookings-and-next-free-slot.md`. Each story file holds concrete acceptance criteria ready for `bmad-build`, while Story 1.1's entry notes the manual pairing step so unattended runners skip it.
:::

### 4. Refine or Refresh a Story Later

Stories detailed when the epic was planned already carry their full acceptance criteria in their story files. If you opted to leave later entries light, or if scope changed mid-flight, ask Sofia to refine or refresh a specific story before building it:

```text wrap
/bmad-agent-po refine story 2.3
```

Sofia writes or updates the story file (`tickets/story-<slug>.md`) from its entry and the epic spec; from then on, that story file is the source of truth for the build. Standalone bugs and tickets without an epic always get full acceptance criteria up front.

## What You Get

Ask Sofia what is ready across the current epic or the whole initiative:

```text wrap
/bmad-agent-po what's next?
```

Sofia lists what is ready to refine, ready to start, in progress, and blocked, along with why. From there, continue to [Build and Verify](../build/build-and-verify.md).

Epic planning leaves behind:

- The refined epic file with its settled requirements and completion checks
- `epic-<slug>/tickets/tickets.toml`, listing every story in build order with its permanent ID, outcome summary, verification check, requirement coverage, and prerequisites
- A refined story file (`tickets/story-<slug>.md`) with detailed acceptance criteria for every story by default (or only for the stories you chose to detail if you opted to keep later ones light)

For exact file layouts, entry fields, and status rules, see [The Ticket Tree](../reference/ticket-tree.md).
