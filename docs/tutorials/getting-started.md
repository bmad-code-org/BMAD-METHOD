---
title: "Getting Started"
description: Install BMad and build your first project
---

Build software faster using AI-powered workflows with specialized agents that guide you through planning, architecture, and implementation.

## What You'll Learn

- Install and initialize BMad Method for a new project
- Choose the right planning track for your project size
- Progress through phases from requirements to working code
- Use agents and workflows effectively

:::note[Prerequisites]
- **Node.js 20+** — Required for the installer
- **Git** — Recommended for version control
- **AI-powered IDE** — Claude Code, Cursor, Windsurf, or similar
- **A project idea** — Even a simple one works for learning
:::

:::tip[Quick Path]
**Install** → `npx bmad-method install`
**Plan** → PM creates PRD, Architect creates architecture
**Build** → SM manages sprints, DEV implements stories
**Fresh chats** for each workflow to avoid context issues.
:::

## Understanding BMad

BMad helps you build software through guided workflows with specialized AI agents. The process follows four phases:

| Phase | Name           | What Happens                                        |
| ----- | -------------- | --------------------------------------------------- |
| 1     | Analysis       | Brainstorming, research, product brief *(optional)* |
| 2     | Planning       | Create requirements (PRD or tech-spec)              |
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

When prompted to select modules, choose **BMad Method**.

The installer creates two folders:
- `_bmad/` — agents, workflows, tasks, and configuration
- `_bmad-output/` — empty for now, but this is where your artifacts will be saved

Open your AI IDE in the project folder. Run the `help` workflow (`/bmad-help`) to see what to do next — it detects what you've completed and recommends the next step.

:::note[How to Load Agents and Run Workflows]
Each workflow has a **slash command** you run in your IDE (e.g., `/bmad-bmm-create-prd`). Running a workflow command automatically loads the appropriate agent — you don't need to load agents separately. You can also load an agent directly for general conversation (e.g., `/bmad-agent-bmm-pm` for the PM agent).
:::

:::caution[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 1: Create Your Plan

Work through phases 1-3. **Use fresh chats for each workflow.**

### Phase 1: Analysis (Optional)

All workflows in this phase are optional:
- **brainstorming** (`/bmad-brainstorming`) — Guided ideation
- **research** (`/bmad-bmm-research`) — Market and technical research
- **create-product-brief** (`/bmad-bmm-create-product-brief`) — Recommended foundation document

### Phase 2: Planning (Required)

**For BMad Method and Enterprise tracks:**
1. Load the **PM agent** (`/bmad-agent-bmm-pm`) in a new chat
2. Run the `prd` workflow (`/bmad-bmm-create-prd`)
3. Output: `PRD.md`

**For Quick Flow track:**
- Use the `quick-spec` workflow (`/bmad-bmm-quick-spec`) instead of PRD, then skip to implementation

:::note[UX Design (Optional)]
If your project has a user interface, load the **UX-Designer agent** (`/bmad-agent-bmm-ux-designer`) and run the UX design workflow (`/bmad-bmm-create-ux-design`) after creating your PRD.
:::

### Phase 3: Solutioning (BMad Method/Enterprise)

**Create Architecture**
1. Load the **Architect agent** (`/bmad-agent-bmm-architect`) in a new chat
2. Run `create-architecture` (`/bmad-bmm-create-architecture`)
3. Output: Architecture document with technical decisions

**Create Epics and Stories**

:::tip[V6 Improvement]
Epics and stories are now created *after* architecture. This produces better quality stories because architecture decisions (database, API patterns, tech stack) directly affect how work should be broken down.
:::

1. Load the **PM agent** (`/bmad-agent-bmm-pm`) in a new chat
2. Run `create-epics-and-stories` (`/bmad-bmm-create-epics-and-stories`)
3. The workflow uses both PRD and Architecture to create technically-informed stories

**Implementation Readiness Check** *(Highly Recommended)*
1. Load the **Architect agent** (`/bmad-agent-bmm-architect`) in a new chat
2. Run `check-implementation-readiness` (`/bmad-bmm-check-implementation-readiness`)
3. Validates cohesion across all planning documents

## Step 2: Build Your Project

Once planning is complete, move to implementation. **Each workflow should run in a fresh chat.**

### Initialize Sprint Planning

Load the **SM agent** (`/bmad-agent-bmm-sm`) and run `sprint-planning` (`/bmad-bmm-sprint-planning`). This creates `sprint-status.yaml` to track all epics and stories.

### The Build Cycle

For each story, repeat this cycle with fresh chats:

| Step | Agent | Workflow       | Command                    | Purpose                            |
| ---- | ----- | -------------- | -------------------------- | ---------------------------------- |
| 1    | SM    | `create-story` | `/bmad-bmm-create-story`  | Create story file from epic        |
| 2    | DEV   | `dev-story`    | `/bmad-bmm-dev-story`     | Implement the story                |
| 3    | DEV   | `code-review`  | `/bmad-bmm-code-review`   | Quality validation *(recommended)* |

After completing all stories in an epic, load the **SM agent** (`/bmad-agent-bmm-sm`) and run `retrospective` (`/bmad-bmm-retrospective`).

## What You've Accomplished

You've learned the foundation of building with BMad:

- Installed BMad and configured it for your IDE
- Initialized a project with your chosen planning track
- Created planning documents (PRD, Architecture, Epics & Stories)
- Understood the build cycle for implementation

Your project now has:

```text
your-project/
├── _bmad/                         # BMad configuration
├── _bmad-output/
│   ├── PRD.md                     # Your requirements document
│   ├── architecture.md            # Technical decisions
│   ├── epics/                     # Epic and story files
│   └── sprint-status.yaml         # Sprint tracking
└── ...
```

## Quick Reference

| Workflow                         | Command                                    | Agent     | Purpose                              |
| -------------------------------- | ------------------------------------------ | --------- | ------------------------------------ |
| `help`                           | `/bmad-help`                               | Any       | Get guidance on what to do next      |
| `prd`                            | `/bmad-bmm-create-prd`                     | PM        | Create Product Requirements Document |
| `create-architecture`            | `/bmad-bmm-create-architecture`            | Architect | Create architecture document         |
| `create-epics-and-stories`       | `/bmad-bmm-create-epics-and-stories`       | PM        | Break down PRD into epics            |
| `check-implementation-readiness` | `/bmad-bmm-check-implementation-readiness` | Architect | Validate planning cohesion           |
| `sprint-planning`                | `/bmad-bmm-sprint-planning`                | SM        | Initialize sprint tracking           |
| `create-story`                   | `/bmad-bmm-create-story`                   | SM        | Create a story file                  |
| `dev-story`                      | `/bmad-bmm-dev-story`                      | DEV       | Implement a story                    |
| `code-review`                    | `/bmad-bmm-code-review`                    | DEV       | Review implemented code              |

## Common Questions

**Do I always need architecture?**
Only for BMad Method and Enterprise tracks. Quick Flow skips from tech-spec to implementation.

**Can I change my plan later?**
Yes. The SM agent has a `correct-course` workflow (`/bmad-bmm-correct-course`) for handling scope changes.

**What if I want to brainstorm first?**
Load the Analyst agent (`/bmad-agent-bmm-analyst`) and run `brainstorming` (`/bmad-brainstorming`) before starting your PRD.

**Do I need to follow a strict order?**
Not strictly. Once you learn the flow, you can run workflows directly using the Quick Reference above.

## Getting Help

- **During workflows** — Agents guide you with questions and explanations
- **Community** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)
- **Stuck?** — Run `help` (`/bmad-help`) to see what to do next

## Key Takeaways

:::tip[Remember These]
- **Always use fresh chats** — Start a new chat for each workflow
- **Track matters** — Quick Flow uses quick-spec; Method/Enterprise need PRD and architecture
- **Use `help` (`/bmad-help`) when stuck** — It detects your progress and suggests next steps
:::

Ready to start? Install BMad and let the agents guide you through your first project.
