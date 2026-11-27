---
title: 'Plan Inside an Organization'
description: How the full planning path works when several people must agree on the product, several engineers build it in parallel, and someone must sign off. Covers document ownership, approvals, and change flow.
sidebar:
  order: 6
---

Use this page when your work belongs to an organization rather than a solo builder: multiple stakeholders must agree on what the product is, several engineers will build parts in parallel, or leadership must sign off before funding or launch. In that setting, planning documents are contracts between people first and inputs to BMad skills second.

## The Scaled-Down Version First

A solo builder or a small team that already agrees does not need most of what follows. A forged idea, a PRFAQ, a brainstorm summary, or a clear issue goes straight to Sofia, the Product Owner (`bmad-agent-po`), who writes the requirements into the initiative or epic and slices the work. [How BMad Works](../start/how-bmad-works.md) covers that lighter path. Sofia tells you if your input is too thin; until she does, no PRD is required.

Use the full organizational path when any of these apply:

- Stakeholders who did not shape the idea must approve what gets built.
- Several epics, teams, or coding agents will build against shared technical decisions and must stay compatible.
- A regulator, steering committee, or enterprise governance process requires formal written deliverables as evidence.

## The PRD Is What the Organization Owns

The PRD is the product contract the organization owns. John, the Product Manager (`bmad-agent-pm`), writes, validates, and updates it; no downstream file claims to redefine what the product is. Brainstorming, Forge Idea, Deep Recon, a product brief, and a PRFAQ exist to get the PRD right. When governance also requires a program charter or a formal requirements specification for audited or contracted delivery, John writes those as well, while Mary (`bmad-agent-analyst`) writes a business case or business requirements document (BRD). Everything downstream derives from the PRD:

- Sally (`bmad-agent-ux-designer`) writes `DESIGN.md` and `EXPERIENCE.md` beside the PRD for shared product UX, and adds epic-level `EXPERIENCE.md` (plus local `DESIGN.md` overrides only when needed) for specific epics.
- Winston (`bmad-agent-architect`) writes the shared architecture: the technical decisions that keep independently built epics compatible.
- Sofia writes the initiative's requirements from the PRD and each epic's requirements from the initiative, linking to the shared architecture and UX files instead of duplicating them.
- Sofia slices the epics into ordered stories and tracks each story's local build plan and run log.

Nothing downstream reinterprets the PRD silently. If a story or epic needs a product answer the PRD does not cover, add the answer to the PRD first and re-run Sofia afterward. If the PRD and a ticket's requirements ever disagree, Sofia flags the contradiction so you decide how to reconcile them.

## Bring the Documents You Have

BMad does not ask you to abandon the tools your organization already runs. If your company writes PRDs in Confluence or Notion, tracks work in Jira or Linear, and holds regular review meetings, all of those stay in place.

- Your existing PRD can serve directly as John's input, because he reads any files you point him at. Ask him to validate it for a findings report without modifying the file, or ask him to create a structured PRD from it with `[ASSUMPTION]` tags marking anything he had to fill in. When reviewers update your external copy later, ask John to update his PRD from the revised version rather than editing his file by hand.
- Sally and Winston start from your existing design system, architecture docs, and live repositories in the same way. On an existing codebase, Winston reads the code first and ratifies the conventions already working in production instead of proposing new ones.
- Jira, Linear, or GitHub Issues stays where the team plans, reports, and reviews. Sofia publishes ticket files to your tracker when needed while local build plans and run logs stay in the repository, and tracker board status is mirrored separately so dragging a card never causes a build to skip planning. See [Map Your Tracker to the Ticket Tree](../reference/map-your-tracker.md).
- Your existing reviews stay in place, because the five sign-off points below produce concrete written outputs you can attach directly to your team's current approval meetings.

The one habit that changes is where edits happen: apply product changes to the PRD rather than patching a downstream story, so every derived document stays consistent.

## Who Owns What

| Role | Runs | Owns |
| --- | --- | --- |
| Product manager | Brainstorming, Forge Idea, Deep Recon, PRFAQ or brief with Mary (`bmad-agent-analyst`), and PRDs with John (`bmad-agent-pm`) | The PRD and its update cycle; executive one-pagers |
| Designer | Sally (`bmad-agent-ux-designer`) | `DESIGN.md`, `EXPERIENCE.md`, brand kits, and mockups |
| Tech lead or architect | Winston (`bmad-agent-architect`) | Shared architecture and technical decision records |
| Engineer (per epic) | Sofia (`bmad-agent-po`), `bmad-build` per story, `bmad-retrospective` | That epic's stories, build plans, and retrospective verdict |
| Delivery lead or PO | Sofia (`bmad-agent-po`) | The ticket tree, dependencies, and status rollups |

These rows are roles, not required headcount. One person can wear several hats; what matters is that each document has one clear owner and one agent that updates it. An epic is usually a handful of coding sessions for one engineer. Organizational alignment lives in the PRD and shared architecture, so individual epics never need committee oversight.

## Where Sign-Off Happens

BMad gives you five natural checkpoints where a human decision gates the next phase. Place organizational sign-offs here rather than inventing parallel approval steps:

| Moment | What is judged | What it blocks |
| --- | --- | --- |
| PRFAQ verdict | Whether the product concept is strong enough to fund | Writing the PRD |
| PRD validation | Findings report on the PRD before committing design effort | UX design and architecture work |
| Shared architecture review | Technical decisions every epic must follow, with trade-offs weighed | Writing detailed epic requirements |
| Story breakdown approval | Ordered stories, requirement coverage, and checked dependencies | Starting implementation |
| Retrospective verdict | Whether the finished epic met its own acceptance criteria | Starting the next epic or closing |

Each checkpoint produces a written artifact you can attach to a ticket, PR, or governance record. In regulated or enterprise settings, those files form your audit trail. Both PRFAQ and retrospective also support non-interactive mode when you want an evidence-only check without a live discussion.

:::note[Reviewers read copies; change the source]
Stakeholders will comment on whichever document they happen to open: the PRD, the shared architecture, or an epic's stories. Apply each change at its source: update the PRD for product scope, update the shared architecture for cross-epic technical rules, and update an epic directly only when the change belongs to that epic alone. Then re-run the downstream skills so nothing drifts out of sync.
:::

## Several Epics at Once

With one PRD, one shared architecture, and one ticket folder per epic, several engineers can build different epics in parallel safely. The shared architecture prevents collisions by settling API style, state ownership, and shared schemas before coding starts. When an individual epic adds its own technical design, it inherits the initiative's decisions and records only what the parent left open. Run integration checks and a retrospective at every epic boundary rather than waiting until the entire project finishes. See [Design UX and Architecture](./design-ux-and-architecture.md) for how shared design and architecture stay aligned.

Sofia splits epics by user outcome, deployment boundaries, and slice size rather than org-chart ownership. If your organization uses its own slicing conventions, use `bmad-customize` to record those team rules for Sofia so every initiative follows them.

Each epic begins as a lightweight outline and gets refined right before coding starts. When you ask Sofia to refine an epic, she tells you what is already settled, flags open product questions for John, and offers Sally for new UI flows or Winston for new contracts, schemas, or migrations, plus `bmad-deep-recon` when research is needed. Every specialist document lands inside the epic's folder as a linked companion so whoever builds the epic finds everything in one place.

## More Than One Initiative

When work spans multiple initiatives serving a larger strategic goal or delivery portfolio, organize them inside a top-level program folder (`program-<slug>/`). Match the documentation to how tightly coupled the initiatives are: use a strategy narrative or program charter from Mary and John plus Sofia's program rollup when initiatives run mostly independently, or add a program PRD and enterprise architecture when initiatives share cross-domain contracts and rules. Each child initiative lives under `tickets/initiative-<slug>/` with its own epics and stories while citing shared program rules and objectives. Ask the `bmad` skill to switch your active initiative to a specific child when building, or point it at `program-<slug>` to view progress rolled up across the entire program.

## When Requirements Change Mid-Flight

Requirements will change during delivery. Route every mid-flight change through the same chain that created the plan:

1. Ask John to update the PRD with the new requirement or constraint. He highlights any conflicts with earlier decisions before editing the file.
2. Tell Sofia what changed. She updates the affected requirements in place while keeping existing requirement IDs stable, leaves unaffected stories untouched, and lists which stories are now stale.
3. If the change affects a cross-epic technical decision, ask Winston to update the shared architecture. He reads the updated requirements and updates the affected contracts.
4. For the affected epics, Sofia adjusts or re-slices the remaining unstarted stories while preserving completed plans and build history as the record.

## What You Get

You end up with planning documents that stay aligned because each has one owner and one writer, five clear sign-off points backed by written evidence, and a predictable change flow that starts at the source instead of ad-hoc ticket edits. Engineering still builds one focused session at a time, using the exact same `bmad-build` workflow a solo developer uses.
