---
sidebar_label: BMad v4
sidebar_position: 1
description: Install BMAD and create your first planning document
---

# Getting Started with BMad v4

Learn how to build software with BMAD's AI-powered workflows. By the end of this tutorial, you'll have installed BMAD, initialized a project, and created your first planning document.

## What You'll Learn

- How to install and configure BMAD for your IDE
- How BMAD organizes work into phases and agents
- How to initialize a project and choose a planning track
- How to create your first requirements document

:::info[Prerequisites]
- **Node.js 20+** — Required for the installer
- **Git** — Recommended for version control
- **AI-powered IDE** — Claude Code, Cursor, Windsurf, or similar
- **A project idea** — Even a simple one works for learning
:::

## Step 1: Install BMAD

Open a terminal in your project directory and run:

```bash
npx bmad-method install
```

The interactive installer guides you through setup.

**Choose Installation Location** — Select current directory (recommended), subdirectory, or custom path.

**Select Your AI Tool** — Choose Claude Code, Cursor, Windsurf, or other. The installer configures BMAD for your selection.

**Choose Modules** — For this tutorial, select **BMM** (BMAD Method):

| Module   | Purpose                                   |
| -------- | ----------------------------------------- |
| **BMM**  | Core methodology for software development |
| **BMGD** | Game development workflows                |
| **CIS**  | Creative intelligence and facilitation    |
| **BMB**  | Building custom agents and workflows      |

**Accept Default Configuration** — For your first project, accept the recommended defaults. Customize later in `_bmad/[module]/config.yaml`.

**Verify Installation** — Check your project structure:

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
Having issues? See [Install BMAD](../../how-to/installation/install-bmad.md) for common solutions.
:::

## Step 2: Understand How BMAD Works

Before diving in, learn BMAD's core concepts.

### Phases

BMAD organizes work into four phases:

| Phase | Name           | What Happens                                       |
| ----- | -------------- | -------------------------------------------------- |
| 1     | Analysis       | Brainstorm, research *(optional)*                  |
| 2     | Planning       | Requirements — PRD or tech-spec *(required)*       |
| 3     | Solutioning    | Architecture, design decisions *(varies by track)* |
| 4     | Implementation | Build code story by story *(required)*             |

### Agents

Agents are specialized AI personas, each expert in their domain:

| Agent           | Role                                                     |
| --------------- | -------------------------------------------------------- |
| **Analyst**     | Initializes projects, tracks progress, conducts research |
| **PM**          | Creates requirements (PRD or tech-spec)                  |
| **UX-Designer** | Designs user interfaces and experiences                  |
| **Architect**   | Makes technical decisions, designs system architecture   |
| **SM**          | Manages sprints, creates stories                         |
| **DEV**         | Implements code, reviews work                            |

### Workflows

Workflows are guided processes that agents run. You tell an agent to run a workflow, and it walks you through the process interactively.

### Planning Tracks

Based on your project's complexity, BMAD offers three tracks:

| Track           | Best For                                   | Documents Created                      |
| --------------- | ------------------------------------------ | -------------------------------------- |
| **Quick Flow**  | Bug fixes, simple features, clear scope    | Tech-spec only                         |
| **BMAD Method** | Products, platforms, complex features      | PRD + Architecture + UX                |
| **Enterprise**  | Compliance, multi-tenant, enterprise needs | PRD + Architecture + Security + DevOps |

## Step 3: Initialize Your Project

Load the **Analyst agent** in your IDE:
- **Claude Code**: Type `/analyst` or load the agent file directly
- **Cursor/Windsurf**: Open the agent file from `_bmad/bmm/agents/`

Wait for the agent's menu to appear, then run the initialization workflow:

```
Run workflow-init
```

Or use the shorthand: `*workflow-init`

The workflow asks you to describe:
- **Your project and goals** — What are you building? What problem does it solve?
- **Existing codebase** — Is this new (greenfield) or existing code (brownfield)?
- **Size and complexity** — Roughly how big is this? (adjustable later)

Based on your description, the workflow suggests a planning track. For this tutorial, choose **BMAD Method**.

Once you confirm, the workflow creates `bmm-workflow-status.yaml` in your project's docs folder to track your progress.

:::warning[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 4: Create Your Requirements Document

With your project initialized, create your first planning document — the PRD (Product Requirements Document).

**Start a fresh chat** and load the **PM agent**.

Tell the PM agent:

```
Run prd
```

Or use shortcuts: `*prd`, select "create-prd" from the menu, or say "Let's create a new PRD".

The PM agent guides you through creating your PRD interactively:

1. **Project overview** — Refine your project description
2. **Goals and success metrics** — What does success look like?
3. **User personas** — Who uses this product?
4. **Functional requirements** — What must the system do?
5. **Non-functional requirements** — Performance, security, scalability needs

Answer the agent's questions thoughtfully. The PRD becomes the foundation for everything that follows.

When complete, you'll have a `PRD.md` file in your `_bmad-output/` folder.

## Step 5: Check Your Progress

At any point, check what to do next by loading any agent and running:

```
workflow-status
```

The agent reads your `bmm-workflow-status.yaml` and tells you which phase you're in, what's complete, and what the next step is.

:::info[Example Response]
Phase 2 (Planning) complete: PRD created

Next recommended steps:
- UX Design (optional, if your project has a UI)
- Architecture (required for BMAD Method track) — Agent: architect, Command: `create-architecture`
:::

## What You've Accomplished

You've completed the foundation of a BMAD project:

- Installed BMAD and configured it for your IDE
- Initialized a project with your chosen planning track
- Created a PRD that defines your product requirements

Your project now has:

```
your-project/
├── _bmad/                         # BMAD configuration
├── _bmad-output/
│   ├── PRD.md                     # Your requirements document
│   └── bmm-workflow-status.yaml   # Progress tracking
└── ...
```

## Next Steps

Continue building your project:
1. Design your system's technical foundation with the **Architect agent**
2. Start implementation story by story with **SM** and **DEV** agents

Explore related topics:
- [What Are Agents?](../../explanation/core-concepts/what-are-agents.md) — Deep dive into how agents work
- [What Are Workflows?](../../explanation/core-concepts/what-are-workflows.md) — Understanding BMAD's workflow system
- [Workflow Reference](../../reference/workflows/index.md) — Complete list of available workflows

## Quick Reference

| Command           | Agent   | Purpose                                |
| ----------------- | ------- | -------------------------------------- |
| `*workflow-init`  | Analyst | Initialize a new project               |
| `*prd`            | PM      | Create a Product Requirements Document |
| `workflow-status` | Any     | Check progress and next steps          |

:::tip[Flexible Commands]
Agents accept menu numbers, shortcuts (`*prd`), or natural language ("Let's create a PRD").
:::

## Common Questions

**Do I need to create a PRD for every project?**
Only for BMAD Method and Enterprise tracks. Quick Flow projects use a simpler tech-spec instead.

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
