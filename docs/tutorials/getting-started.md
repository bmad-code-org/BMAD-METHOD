---
title: 'Getting Started'
description: Install BMad and build your first project
---

Build software faster using AI-powered workflows with specialized agents that guide you through planning, architecture, and implementation.

## What You'll Learn

- Install and initialize BMad Method for a new project
- Use **BMad-Help** — your intelligent guide that knows what to do next
- Choose the right planning depth for your project
- Progress through phases from requirements to working code
- Use agents and workflows effectively

:::note[Prerequisites]

- **Node.js 20.12+** — Required for the installer
- **Git** — Recommended for version control
- **AI-powered IDE** — Claude Code, Cursor, or similar
- **A project idea** — Even a simple one works for learning
  :::

:::tip[The Easiest Path]
**Install** → `npx bmad-method install`
**Ask** → `bmad-help what should I do first?`
**Build** → Let BMad-Help guide you workflow by workflow
:::

## Meet BMad-Help: Your Intelligent Guide

**BMad-Help is the fastest way to get started with BMad.** You don't need to memorize workflows or phases — just ask, and BMad-Help will:

- **Inspect your project** to see what's already been done
- **Show your options** based on which modules you have installed
- **Recommend what's next** — including the first required task
- **Answer questions** like "I have a SaaS idea, where do I start?"

### How to Use BMad-Help

Run it in your AI IDE by invoking the skill:

```
bmad-help
```

Or combine it with a question for context-aware guidance:

```
bmad-help I have an idea for a SaaS product, I already know all the features I want. where do I get started?
```

BMad-Help will respond with:

- What's recommended for your situation
- What the first required task is
- What the rest of the process looks like

### It Powers Workflows Too

BMad-Help doesn't just answer questions — **it automatically runs at the end of every workflow** to tell you exactly what to do next. No guessing, no searching docs — just clear guidance on the next required workflow.

:::tip[Start Here]
After installing BMad, invoke the `bmad-help` skill immediately. It will detect what modules you have installed and guide you to the right starting point for your project.
:::

## Understanding BMad

BMad helps you build software through guided workflows with specialized AI agents. The process follows four phases:

| Phase | Name           | What Happens                                                 |
| ----- | -------------- | ------------------------------------------------------------ |
| 1     | Analysis       | Brainstorming, research, forge idea, product brief or PRFAQ _(optional)_ |
| 2     | Planning       | Create requirements and design PRD, UX, SPEC                 |
| 3     | Solutioning    | Design architecture spine or detailed project or system architectures          |
| 4     | Implementation | Implement every change or planned story, optionally through automated orchestration |

**[Open the Workflow Map](../reference/workflow-map.md)** to explore phases, workflows, and context management.

Planning depth is flexible. Start implementation directly when the intent is already clear, or add the planning artifacts that reduce risk for larger work:

| Planning depth | Best For | Context Available Before Implementation |
| --- | --- | --- |
| **Direct** | Clear fixes, features, issues, or existing specifications | User intent, issue, or spec |
| **Product planning** | Products, platforms, and complex features | PRD and optional UX design |
| **Full solutioning** | Cross-system, high-risk, or coordinated initiatives | PRD, UX, architecture, epics, stories, and sprint plan |

:::note
These are entry points, not separate implementation tracks. Every path converges on `bmad-build`; planning only changes how much context the workflow receives.
:::

## Installation

Open a terminal in your project directory and run:

```bash
npx bmad-method install
```

If you want the newest prerelease build instead of the default release channel, use `npx bmad-method@next install`.

When prompted to select modules, choose **BMad Method**.

The installer creates two folders:

- `_bmad/` — agents, workflows, tasks, and configuration
- `_bmad-output/` — empty for now, but this is where your artifacts will be saved

:::tip[Your Next Step]
Open your AI IDE in the project folder and run:

```
bmad-help
```

BMad-Help will detect what you've completed and recommend exactly what to do next. You can also ask it questions like "What are my options?" or "I have a SaaS idea, where should I start?"
:::

:::note[How to Load Agents and Run Workflows]
Each workflow has a **skill** you invoke by name in your IDE (e.g., `bmad-prd`). Your AI tool will recognize the `bmad-*` name and run it — you don't need to load agents separately. You can also invoke an agent skill directly for general conversation (e.g., `bmad-agent-pm` for the PM agent).
:::

:::caution[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 1: Choose Your Planning Depth

Use as much of phases 1-3 as the work needs. For clear, bounded work, you can proceed directly to [Step 2](#step-2-build-your-project). **Use fresh chats for each workflow.**

:::tip[Project Context (Optional)]
Before starting, consider creating `project-context.md` to document your technical preferences and implementation rules. This ensures all AI agents follow your conventions throughout the project.

Create it manually at `_bmad-output/project-context.md` or generate it after architecture using `bmad-generate-project-context`. [Learn more](../explanation/project-context.md).
:::

### Phase 1: Analysis (Optional)

All workflows in this phase are optional. [**Not sure which to use?**](../explanation/analysis-phase.md)

- **brainstorming** (`bmad-brainstorming`) — Guided ideation
- **forge-idea** (`bmad-forge-idea`) — Pressure-test an idea until it hardens or dies cheaply
- **research** (`bmad-deep-recon`) — Draft a deep-research prompt for your own AI tool, process a finished report into a downstream-ready summary, or run the research here, with claim verification and a refresh lifecycle. [Learn more](../explanation/deep-recon.md)
- **product-brief** (`bmad-product-brief`) — Recommended foundation document when your concept is clear
- **prfaq** (`bmad-prfaq`) — Working Backwards challenge to stress-test your product concept customer-first

### Phase 2: Planning (As Needed)

For work that benefits from product planning:

1. Run `bmad-prd` in a new chat — state your intent (Create / Update / Validate) or let the skill ask
2. Output: `prd.md`, `addendum.md`, `.memlog.md`

:::note[`bmad-prd` intents]

- **Create** — coached discovery from scratch; the skill names the workspace folder and guides you to a PRD you're proud of
- **Update** — point it at an existing PRD and a change signal; it surfaces conflicts before applying changes
- **Validate** — critique a finished PRD against a checklist and produce an HTML findings report
  :::

:::note[UX Design (Optional)]
If your project has a user interface, invoke the **UX-Designer agent** (`bmad-agent-ux-designer`) and run the UX design workflow (`bmad-ux`) after creating your PRD.
:::

### Phase 3: Solutioning (As Needed)

**Create Architecture**

1. Invoke the **Architect agent** (`bmad-agent-architect`) in a new chat
2. Run `bmad-architecture` (`bmad-architecture`)
3. Output: Architecture document with technical decisions

**Create Epics and Stories**

:::tip[V6 Improvement]
Epics and stories are now created _after_ architecture. This produces better quality stories because architecture decisions (database, API patterns, tech stack) directly affect how work should be broken down.
:::

1. Invoke the **PM agent** (`bmad-agent-pm`) in a new chat
2. Run `bmad-create-epics-and-stories` (`bmad-create-epics-and-stories`)
3. The workflow uses both PRD and Architecture to create technically-informed stories

**Implementation Readiness Check** _(Highly Recommended)_

1. Invoke the **Architect agent** (`bmad-agent-architect`) in a new chat
2. Run `bmad-check-implementation-readiness` (`bmad-check-implementation-readiness`)
3. Validates cohesion across all planning documents

## Step 2: Build Your Project

Move to implementation from whatever context you have: a direct request, an issue, a spec, or a fully planned story. **Each workflow should run in a fresh chat.**

For planned work, invoke `bmad-build` and identify the selected story or sprint item, for example: `Implement story 2.3 from _bmad-output/planning-artifacts/epics.md`.

### Initialize Sprint Planning (For Planned Work)

Invoke the **Developer agent** (`bmad-agent-dev`) and run `bmad-sprint-planning` (`bmad-sprint-planning`). This creates `sprint-status.yaml` to track all epics and stories.

When Build resolves a selected story in that file, it moves the story to `in-progress` during implementation and to `review` when implementation is complete.

### The Build Cycle

For each direct change or planned story, repeat this cycle with fresh chats:

| Step | Agent | Workflow | Command | Purpose |
| ---- | ----- | -------- | ------- | ------- |
| 1    | DEV   | `bmad-build` | `bmad-build` | Clarify as needed, plan, implement, review, present |
| 2    | DEV   | `bmad-code-review` | `bmad-code-review` | Additional quality validation _(recommended)_ |

Build's review is part of every run. `bmad-code-review` is an optional fresh-context, independent validation layer.

After completing all stories in an epic, invoke the **Developer agent** (`bmad-agent-dev`) and run `bmad-retrospective` (`bmad-retrospective`).

## What You've Accomplished

You've learned the foundation of building with BMad:

- Installed BMad and configured it for your IDE
- Chosen planning depth appropriate to your work
- Created planning documents (PRD, Architecture, Epics & Stories)
- Understood the build cycle for implementation

Your project now has:

```text
your-project/
├── _bmad/                                   # BMad configuration
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # Your requirements document
│   │   ├── architecture.md                  # Technical decisions
│   │   └── epics/                           # Epic and story files
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # Sprint tracking
│   └── project-context.md                   # Implementation rules (optional)
└── ...
```

## Quick Reference

| Workflow                              | Command                               | Agent     | Purpose                                    |
| ------------------------------------- | ------------------------------------- | --------- | ------------------------------------------ |
| **`bmad-help`** ⭐                    | `bmad-help`                           | Any       | **Your intelligent guide — ask anything!** |
| `bmad-prd`                            | `bmad-prd`                            | Any       | Create, update, or validate a PRD          |
| `bmad-architecture`                   | `bmad-architecture`                   | Architect | Create architecture document               |
| `bmad-generate-project-context`       | `bmad-generate-project-context`       | Analyst   | Create project context file                |
| `bmad-create-epics-and-stories`       | `bmad-create-epics-and-stories`       | PM        | Break down PRD into epics                  |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | Architect | Validate planning cohesion                 |
| `bmad-sprint-planning`                | `bmad-sprint-planning`                | DEV       | Initialize sprint tracking                 |
| `bmad-build`                      | `bmad-build`                      | DEV       | Implement a feature, fix, or story         |
| `bmad-code-review`                    | `bmad-code-review`                    | DEV       | Review implemented code                    |

## Common Questions

**Do I always need architecture?**
No. Use architecture when technical decisions or cross-system constraints need to be explicit. Clear work can enter `bmad-build` directly, while larger initiatives can bring architecture and other planning artifacts into the same workflow.

**Can I change my plan later?**
Yes. The `bmad-correct-course` workflow handles scope changes mid-implementation.

**What if I want to brainstorm first?**
Invoke the Analyst agent (`bmad-agent-analyst`) and run `bmad-brainstorming` (`bmad-brainstorming`) before starting your PRD.

**Do I need to follow a strict order?**
Not strictly. Once you learn the flow, you can run workflows directly using the Quick Reference above.

## Getting Help

:::tip[First Stop: BMad-Help]
**Invoke `bmad-help` anytime** — it's the fastest way to get unstuck. Ask it anything:

- "What should I do after installing?"
- "I'm stuck on workflow X"
- "What are my options for Y?"
- "Show me what's been done so far"

BMad-Help inspects your project, detects what you've completed, and tells you exactly what to do next.
:::

- **During workflows** — Agents guide you with questions and explanations
- **Community** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)

## Key Takeaways

:::tip[Remember These]

- **Start with `bmad-help`** — Your intelligent guide that knows your project and options
- **Always use fresh chats** — Start a new chat for each workflow
- **Planning depth varies** — direct intent and fully planned stories both enter `bmad-build`
- **BMad-Help runs automatically** — Every workflow ends with guidance on what's next
  :::

Ready to start? Install BMad, invoke `bmad-help`, and let your intelligent guide lead the way.
