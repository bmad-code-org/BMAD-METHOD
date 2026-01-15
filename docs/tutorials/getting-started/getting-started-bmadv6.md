---
title: "Getting Started with the BMad Method"
description: Install BMad and build your first project
---

**Upgrading from previous versions?** See the [Upgrade Guide](/docs/how-to/installation/upgrade-to-v6.md) instead.

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
**Install** → `npx bmad-method@alpha install`
**Initialize** → Load Analyst agent, run `workflow-init`
**Plan** → PM creates PRD, Architect creates architecture
**Build** → SM manages sprints, DEV implements stories
**Always use fresh chats** for each workflow to avoid context issues.
:::

## Understanding BMad

BMad helps you build software through guided workflows with specialized AI agents. The process follows four phases:

| Phase | Name           | What Happens                                        |
| ----- | -------------- | --------------------------------------------------- |
| 1     | Analysis       | Brainstorming, research, product brief *(optional)* |
| 2     | Planning       | Create requirements (PRD or tech-spec)              |
| 3     | Solutioning    | Design architecture *(BMad Method/Enterprise only)* |
| 4     | Implementation | Build epic by epic, story by story                  |

![BMad Method Workflow - Standard Greenfield](./images/workflow-method-greenfield.svg)

*Complete visual flowchart showing all phases, workflows, and agents for the standard greenfield track.*

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
npx bmad-method@alpha install
```

The interactive installer guides you through setup and creates a `_bmad/` folder with all agents and workflows.

Verify your installation:

```
your-project/
├── _bmad/
│   ├── bmm/            # Method module
│   │   ├── agents/     # Agent files
│   │   ├── workflows/  # Workflow files
│   │   └── config.yaml # Module config
│   └── core/           # Core utilities
├── _bmad-output/       # Generated artifacts (created later)
└── .claude/            # IDE configuration (if using Claude Code)
```

:::tip[Troubleshooting]
Having issues? See [Install BMad](/docs/how-to/installation/install-bmad.md) for common solutions.
:::

## Step 1: Initialize Your Project

Load the **Analyst agent** in your IDE, wait for the menu, then run `workflow-init`.

:::note[How to Load Agents]
Type `/<agent-name>` in your IDE and use autocomplete. Not sure what's available? Start with `/bmad` to see all agents and workflows.
:::

The workflow asks you to describe your project, whether it's new or existing, and the general complexity. Based on your description, it recommends a planning track.

Once you confirm, the workflow creates `bmm-workflow-status.yaml` to track your progress through all phases.

:::caution[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 2: Create Your Plan

After initialization, work through phases 1-3. **Use fresh chats for each workflow.**

:::tip[Check Your Status]
Unsure what's next? Load any agent and ask for `workflow-status`. It tells you the next recommended or required workflow.
:::

### Phase 1: Analysis (Optional)

All workflows in this phase are optional:
- **brainstorm-project** — Guided ideation
- **research** — Market and technical research
- **product-brief** — Recommended foundation document

### Phase 2: Planning (Required)

**For BMad Method and Enterprise tracks:**
1. Load the **PM agent** in a new chat
2. Run the PRD workflow: `*prd`
3. Output: `PRD.md`

**For Quick Flow track:**
- Use `tech-spec` instead of PRD, then skip to implementation

:::note[UX Design (Optional)]
If your project has a user interface, load the **UX-Designer agent** and run the UX design workflow after creating your PRD.
:::

### Phase 3: Solutioning (BMad Method/Enterprise)

**Create Architecture**
1. Load the **Architect agent** in a new chat
2. Run `create-architecture`
3. Output: Architecture document with technical decisions

**Create Epics and Stories**

:::tip[V6 Improvement]
Epics and stories are now created *after* architecture. This produces better quality stories because architecture decisions (database, API patterns, tech stack) directly affect how work should be broken down.
:::

1. Load the **PM agent** in a new chat
2. Run `create-epics-and-stories`
3. The workflow uses both PRD and Architecture to create technically-informed stories

**Implementation Readiness Check** *(Highly Recommended)*
1. Load the **Architect agent** in a new chat
2. Run `implementation-readiness`
3. Validates cohesion across all planning documents

## Step 3: Build Your Project

Once planning is complete, move to implementation. **Each workflow should run in a fresh chat.**

### Initialize Sprint Planning

Load the **SM agent** and run `sprint-planning`. This creates `sprint-status.yaml` to track all epics and stories.

### The Build Cycle

For each story, repeat this cycle with fresh chats:

| Step | Agent | Workflow       | Purpose                               |
| ---- | ----- | -------------- | ------------------------------------- |
| 1    | SM    | `create-story` | Create story file from epic           |
| 2    | DEV   | `dev-story`    | Implement the story                   |
| 3    | TEA   | `automate`     | Generate guardrail tests *(optional)* |
| 4    | DEV   | `code-review`  | Quality validation *(recommended)*    |

After completing all stories in an epic, load the **SM agent** and run `retrospective`.

## What You've Accomplished

You've learned the foundation of building with BMad:

- Installed BMad and configured it for your IDE
- Initialized a project with your chosen planning track
- Created planning documents (PRD, Architecture, Epics & Stories)
- Understood the build cycle for implementation

Your project now has:

```
your-project/
├── _bmad/                         # BMad configuration
├── _bmad-output/
│   ├── PRD.md                     # Your requirements document
│   ├── architecture.md            # Technical decisions
│   ├── epics/                     # Epic and story files
│   ├── bmm-workflow-status.yaml   # Phase progress tracking
│   └── sprint-status.yaml         # Sprint tracking
└── ...
```

## Quick Reference

| Command                     | Agent     | Purpose                              |
| --------------------------- | --------- | ------------------------------------ |
| `*workflow-init`            | Analyst   | Initialize a new project             |
| `*workflow-status`          | Any       | Check progress and next steps        |
| `*prd`                      | PM        | Create Product Requirements Document |
| `*create-architecture`      | Architect | Create architecture document         |
| `*create-epics-and-stories` | PM        | Break down PRD into epics            |
| `*implementation-readiness` | Architect | Validate planning cohesion           |
| `*sprint-planning`          | SM        | Initialize sprint tracking           |
| `*create-story`             | SM        | Create a story file                  |
| `*dev-story`                | DEV       | Implement a story                    |
| `*code-review`              | DEV       | Review implemented code              |

## Common Questions

**Do I always need architecture?**
Only for BMad Method and Enterprise tracks. Quick Flow skips from tech-spec to implementation.

**Can I change my plan later?**
Yes. The SM agent has a `correct-course` workflow for handling scope changes.

**What if I want to brainstorm first?**
Load the Analyst agent and run `brainstorm-project` before `workflow-init`.

**Can I skip workflow-init and workflow-status?**
Yes, once you learn the flow. Use the Quick Reference to go directly to needed workflows.

## Getting Help

- **During workflows** — Agents guide you with questions and explanations
- **Community** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)
- **Documentation** — [BMM Workflow Reference](/docs/reference/workflows/index.md)
- **Video tutorials** — [BMad Code YouTube](https://www.youtube.com/@BMadCode)

## Key Takeaways

:::tip[Remember These]
- **Always use fresh chats** — Load agents in new chats for each workflow
- **Let workflow-status guide you** — Ask any agent for status when unsure
- **Track matters** — Quick Flow uses tech-spec; Method/Enterprise need PRD and architecture
- **Tracking is automatic** — Status files update themselves
- **Agents are flexible** — Use menu numbers, shortcuts (`*prd`), or natural language
:::

Ready to start? Install BMad, load the Analyst, run `workflow-init`, and let the agents guide you.
