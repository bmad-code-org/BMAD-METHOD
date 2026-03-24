---
title: "Getting Started"
description: Install BMad and build your first project
---

Build software faster using AI-powered workflows with specialized agents that guide you through planning, architecture, and implementation.

## What You'll Learn

- Install and initialize BMad Method for a new project
- Use **BMad-Help** — your intelligent guide that knows what to do next
- Choose the right planning track for your project size
- Progress through phases from requirements to working code
- Use agents and workflows effectively

:::note[Prerequisites]
- **Node.js 20+** — Required for the installer
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

| Phase | Name           | What Happens                                        |
| ----- | -------------- | --------------------------------------------------- |
| 1     | Analysis       | Brainstorming, research, product brief *(optional)* |
| 2     | Planning       | Create requirements (PRD or spec)              |
| 3     | Solutioning    | Design architecture *(BMad Method/Enterprise only)* |
| 4     | Implementation | Build epic by epic, story by story                  |

**[Open the Workflow Map](../reference/workflow-map.md)** to explore phases, workflows, and context management.

Based on your project's complexity, BMad offers three planning tracks:

| Track           | Best For                                               | Documents Created                      |
| --------------- | ------------------------------------------------------ | -------------------------------------- |
| **Quick Flow**  | Bug fixes, simple features, clear scope (1-15 stories) | Tech-spec only                         |
| **BMad Method** | Products, platforms, complex features (10-50+ stories) | PRD + Architecture + UX                |
| **Enterprise**  | Compliance, multi-tenant systems (30+ stories)         | PRD + Architecture + Security + DevOps |

:::note
Story counts are guidance, not definitions. Choose your track based on planning needs, not story math.
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
Each workflow has a **skill** you invoke by name in your IDE (e.g., `bmad-create-prd`). Your AI tool will recognize the `bmad-*` name and run it — you don't need to load agents separately. You can also invoke an agent skill directly for general conversation (e.g., `bmad-agent-pm` for the PM agent).
:::

:::caution[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 1: Create Your Plan

Work through phases 1-3. **Use fresh chats for each workflow.**

:::tip[Project Context (Optional)]
Before starting, consider creating `project-context.md` to document your technical preferences and implementation rules. This ensures all AI agents follow your conventions throughout the project.

Create it manually at `_bmad-output/project-context.md` or generate it after architecture using `bmad-generate-project-context`. [Learn more](../explanation/project-context.md).
:::

### Phase 1: Analysis (Optional)

All workflows in this phase are optional:
- **brainstorming** (`bmad-brainstorming`) — Guided ideation
- **research** (`bmad-market-research` / `bmad-domain-research` / `bmad-technical-research`) — Market, domain, and technical research
- **create-product-brief** (`bmad-create-product-brief`) — Recommended foundation document

### Phase 2: Planning (Required)

**For BMad Method and Enterprise tracks:**
1. Invoke the **PM agent** (`bmad-agent-pm`) in a new chat
2. Run the `bmad-create-prd` workflow (`bmad-create-prd`)
3. Output: `PRD.md`

**For Quick Flow track:**
- Run `bmad-quick-dev` — it handles planning and implementation in a single workflow, skip to implementation

:::note[UX Design (Optional)]
If your project has a user interface, invoke the **UX-Designer agent** (`bmad-agent-ux-designer`) and run the UX design workflow (`bmad-create-ux-design`) after creating your PRD.
:::

### Phase 3: Solutioning (BMad Method/Enterprise)

**Create Architecture**
1. Invoke the **Architect agent** (`bmad-agent-architect`) in a new chat
2. Run `bmad-create-architecture` (`bmad-create-architecture`)
3. Output: Architecture document with technical decisions

**Create Epics and Stories**

:::tip[V6 Improvement]
Epics and stories are now created *after* architecture. This produces better quality stories because architecture decisions (database, API patterns, tech stack) directly affect how work should be broken down.
:::

1. Invoke the **PM agent** (`bmad-agent-pm`) in a new chat
2. Run `bmad-create-epics-and-stories` (`bmad-create-epics-and-stories`)
3. The workflow uses both PRD and Architecture to create technically-informed stories

**Implementation Readiness Check** *(Highly Recommended)*
1. Invoke the **Architect agent** (`bmad-agent-architect`) in a new chat
2. Run `bmad-check-implementation-readiness` (`bmad-check-implementation-readiness`)
3. Validates cohesion across all planning documents

## Step 2: Build Your Project

Once planning is complete, move to implementation. **Each workflow should run in a fresh chat.**

### Initialize Sprint Planning

Invoke the **SM agent** (`bmad-agent-sm`) and run `bmad-sprint-planning` (`bmad-sprint-planning`). This creates `sprint-status.yaml` to track all epics and stories.

### The Build Cycle

For each story, repeat this cycle with fresh chats:

| Step | Agent | Workflow       | Command                    | Purpose                            |
| ---- | ----- | -------------- | -------------------------- | ---------------------------------- |
| 1    | SM    | `bmad-create-story` | `bmad-create-story`  | Create story file from epic        |
| 2    | DEV   | `bmad-dev-story`    | `bmad-dev-story`     | Implement the story                |
| 3    | DEV   | `bmad-code-review`  | `bmad-code-review`   | Quality validation *(recommended)* |

After completing all stories in an epic, invoke the **SM agent** (`bmad-agent-sm`) and run `bmad-retrospective` (`bmad-retrospective`).

## What You've Accomplished

You've learned the foundation of building with BMad:

- Installed BMad and configured it for your IDE
- Initialized a project with your chosen planning track
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

| Workflow                              | Command                                    | Agent     | Purpose                                         |
| ------------------------------------- | ------------------------------------------ | --------- | ----------------------------------------------- |
| **`bmad-help`** ⭐                    | `bmad-help`                               | Any       | **Your intelligent guide — ask anything!**      |
| `bmad-create-prd`                | `bmad-create-prd`                     | PM        | Create Product Requirements Document            |
| `bmad-create-architecture`            | `bmad-create-architecture`            | Architect | Create architecture document                     |
| `bmad-generate-project-context`       | `bmad-generate-project-context`           | Analyst   | Create project context file                     |
| `bmad-create-epics-and-stories`       | `bmad-create-epics-and-stories`       | PM        | Break down PRD into epics            |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | Architect | Validate planning cohesion           |
| `bmad-sprint-planning`                | `bmad-sprint-planning`                | SM        | Initialize sprint tracking           |
| `bmad-create-story`                   | `bmad-create-story`                   | SM        | Create a story file                  |
| `bmad-dev-story`                      | `bmad-dev-story`                      | DEV       | Implement a story                    |
| `bmad-code-review`                    | `bmad-code-review`                    | DEV       | Review implemented code              |

## Common Questions

**Do I always need architecture?**
Only for BMad Method and Enterprise tracks. Quick Flow skips from spec to implementation.

**Can I change my plan later?**
Yes. The SM agent has a `bmad-correct-course` workflow (`bmad-correct-course`) for handling scope changes.

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
- **Track matters** — Quick Flow uses `bmad-quick-dev`; Method/Enterprise need PRD and architecture
- **BMad-Help runs automatically** — Every workflow ends with guidance on what's next
:::

Ready to start? Install BMad, invoke `bmad-help`, and let your intelligent guide lead the way.
