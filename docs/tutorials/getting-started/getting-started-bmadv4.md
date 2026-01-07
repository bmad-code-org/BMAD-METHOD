---
title: "Getting Started with BMad v4"
description: Install BMad and create your first planning document
---


Build software faster using AI-powered workflows with specialized agents that guide you through planning, architecture, and implementation.

:::note[Stable Release]
This tutorial covers BMad v4, the current stable release. For the latest features (with potential breaking changes), see the [BMad v6 Alpha tutorial](./getting-started-bmadv6.md).
:::

## What You'll Learn

- Install and configure BMad for your IDE
- Understand how BMad organizes work into phases and agents
- Initialize a project and choose a planning track
- Create your first requirements document

:::note[Prerequisites]
- **Node.js 20+** — Required for the installer
- **Git** — Recommended for version control
- **AI-powered IDE** — Claude Code, Cursor, Windsurf, or similar
- **A project idea** — Even a simple one works for learning
:::

:::tip[Quick Path]
**Install** → `npx bmad-method install`
**Initialize** → Load Analyst agent, run `workflow-init`
**Plan** → PM creates PRD, Architect creates architecture
**Build** → SM manages sprints, DEV implements stories
**Always use fresh chats** for each workflow to avoid context issues.
:::

## Understanding BMad

BMad helps you build software through guided workflows with specialized AI agents. The process follows four phases:

| Phase | Name | What Happens |
|-------|------|--------------|
| 1 | Analysis | Brainstorm, research *(optional)* |
| 2 | Planning | Requirements — PRD or tech-spec *(required)* |
| 3 | Solutioning | Architecture, design decisions *(varies by track)* |
| 4 | Implementation | Build code story by story *(required)* |

Based on your project's complexity, BMad offers three planning tracks:

| Track | Best For | Documents Created |
|-------|----------|-------------------|
| **Quick Flow** | Bug fixes, simple features, clear scope | Tech-spec only |
| **BMad Method** | Products, platforms, complex features | PRD + Architecture + UX |
| **Enterprise** | Compliance, multi-tenant, enterprise needs | PRD + Architecture + Security + DevOps |

## Installation

Open a terminal in your project directory and run:

```bash
npx bmad-method install
```

The interactive installer guides you through setup:

- **Choose Installation Location** — Select current directory (recommended), subdirectory, or custom path
- **Select Your AI Tool** — Claude Code, Cursor, Windsurf, or other
- **Choose Modules** — Select **BMM** (BMad Method) for this tutorial
- **Accept Defaults** — Customize later in `_bmad/[module]/config.yaml`

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
Having issues? See [Install BMad](../../how-to/installation/install-bmad.md) for common solutions.
:::

## Step 1: Initialize Your Project

Load the **Analyst agent** in your IDE:
- **Claude Code**: Type `/analyst` or load the agent file directly
- **Cursor/Windsurf**: Open the agent file from `_bmad/bmm/agents/`

Wait for the agent's menu to appear, then run:

```
Run workflow-init
```

Or use the shorthand: `*workflow-init`

The workflow asks you to describe:
- **Your project and goals** — What are you building? What problem does it solve?
- **Existing codebase** — Is this new (greenfield) or existing code (brownfield)?
- **Size and complexity** — Roughly how big is this? (adjustable later)

Based on your description, the workflow suggests a planning track. For this tutorial, choose **BMad Method**.

Once you confirm, the workflow creates `bmm-workflow-status.yaml` to track your progress.

:::caution[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 2: Create Your Plan

With your project initialized, work through the planning phases.

### Phase 1: Analysis (Optional)

If you want to brainstorm or research first:
- **brainstorm-project** — Guided ideation with the Analyst
- **research** — Market and technical research
- **product-brief** — Recommended foundation document

### Phase 2: Planning (Required)

**Start a fresh chat** and load the **PM agent**.

```
Run prd
```

Or use shortcuts: `*prd`, select "create-prd" from the menu, or say "Let's create a PRD".

The PM agent guides you through:
1. **Project overview** — Refine your project description
2. **Goals and success metrics** — What does success look like?
3. **User personas** — Who uses this product?
4. **Functional requirements** — What must the system do?
5. **Non-functional requirements** — Performance, security, scalability needs

When complete, you'll have `PRD.md` in your `_bmad-output/` folder.

:::note[UX Design (Optional)]
If your project has a user interface, load the **UX-Designer agent** and run the UX design workflow after creating your PRD.
:::

### Phase 3: Solutioning (Required for BMad Method)

**Start a fresh chat** and load the **Architect agent**.

```
Run create-architecture
```

The architect guides you through technical decisions: tech stack, database design, API patterns, and system structure.

:::tip[Check Your Status]
Unsure what's next? Load any agent and run `workflow-status`. It tells you the next recommended or required workflow.
:::

## Step 3: Build Your Project

Once planning is complete, move to implementation.

### Initialize Sprint Planning

Load the **SM agent** and run `sprint-planning`. This creates `sprint-status.yaml` to track all epics and stories.

### The Build Cycle

For each story, repeat this cycle with fresh chats:

| Step | Agent | Workflow | Purpose |
|------|-------|----------|---------|
| 1 | SM | `create-story` | Create story file from epic |
| 2 | DEV | `dev-story` | Implement the story |
| 3 | DEV | `code-review` | Quality validation *(recommended)* |

After completing all stories in an epic, load the **SM agent** and run `retrospective`.

## What You've Accomplished

You've learned the foundation of building with BMad:

- Installed BMad and configured it for your IDE
- Initialized a project with your chosen planning track
- Created planning documents (PRD, Architecture)
- Understood the build cycle for implementation

Your project now has:

```
your-project/
├── _bmad/                         # BMad configuration
├── _bmad-output/
│   ├── PRD.md                     # Your requirements document
│   ├── architecture.md            # Technical decisions
│   └── bmm-workflow-status.yaml   # Progress tracking
└── ...
```

## Quick Reference

| Command | Agent | Purpose |
|---------|-------|---------|
| `*workflow-init` | Analyst | Initialize a new project |
| `*workflow-status` | Any | Check progress and next steps |
| `*prd` | PM | Create Product Requirements Document |
| `*create-architecture` | Architect | Create architecture document |
| `*sprint-planning` | SM | Initialize sprint tracking |
| `*create-story` | SM | Create a story file |
| `*dev-story` | DEV | Implement a story |
| `*code-review` | DEV | Review implemented code |

## Common Questions

**Do I need to create a PRD for every project?**
Only for BMad Method and Enterprise tracks. Quick Flow projects use a simpler tech-spec instead.

**Can I skip Phase 1 (Analysis)?**
Yes, Phase 1 is optional. If you already know what you're building, start with Phase 2 (Planning).

**What if I want to brainstorm first?**
Load the Analyst agent and run `*brainstorm-project` before `workflow-init`.

**Why start fresh chats for each workflow?**
Workflows are context-intensive. Reusing chats can cause the AI to hallucinate or lose track of details. Fresh chats ensure maximum context capacity.

## Getting Help

- **During workflows** — Agents guide you with questions and explanations
- **Check status** — Run `workflow-status` with any agent
- **Community** — [Discord](https://discord.gg/gk8jAdXWmj) (#general-dev, #bugs-issues)
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
