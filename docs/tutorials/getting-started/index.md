---
sidebar_label: Getting Started
description: Install BMAD and create your first planning document
---

# Getting Started with BMAD

Learn how to build software with BMAD's AI-powered workflows. By the end of this tutorial, you'll have installed BMAD, initialized a project, and created your first planning document.

## What You'll Learn

- How to install and configure BMAD for your IDE
- How BMAD organizes work into phases and agents
- How to initialize a project and choose a planning track
- How to create your first requirements document

## Prerequisites

Before starting, ensure you have:

- **Node.js 20+** — Required for the installer
- **Git** — Recommended for version control
- **AI-powered IDE** — Claude Code, Cursor, Windsurf, or similar
- **A project idea** — Even a simple one works for learning

---

## Step 1: Install BMAD

Open a terminal in your project directory and run:

```bash
npx bmad-method install
```

The interactive installer guides you through setup:

### 1.1 Choose Installation Location

Select where to install BMAD files:

- **Current directory** — Recommended for new projects
- **Subdirectory** — If you want BMAD isolated
- **Custom path** — For specific project structures

### 1.2 Select Your AI Tool

Choose the IDE you'll be using:

- Claude Code
- Cursor
- Windsurf
- Other

The installer configures BMAD to work with your selected tool.

### 1.3 Choose Modules

For this tutorial, select **BMM** (BMAD Method) — the core module for software development. You can add other modules later:

| Module   | Purpose                                   |
| -------- | ----------------------------------------- |
| **BMM**  | Core methodology for software development |
| **BMGD** | Game development workflows                |
| **CIS**  | Creative intelligence and facilitation    |
| **BMB**  | Building custom agents and workflows      |

### 1.4 Accept Default Configuration

For your first project, accept the recommended defaults. You can customize settings later in `_bmad/[module]/config.yaml`.

### 1.5 Verify Installation

After installation completes, verify by checking your project structure:

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

> **Having trouble?** See [Install BMAD](../../how-to/installation/install-bmad.md) for troubleshooting common issues.

---

## Step 2: Understand How BMAD Works

Before diving in, let's understand BMAD's core concepts.

### Phases

BMAD organizes work into four phases:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Phase 1    │    │  Phase 2    │    │  Phase 3    │    │  Phase 4    │
│  Analysis   │ → │  Planning   │ → │ Solutioning │ → │Implementation│
│ (Optional)  │    │ (Required)  │    │  (Varies)   │    │ (Required)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
  Brainstorm        Requirements       Architecture       Build code
  Research          PRD or tech-spec   Design decisions   Story by story
```

### Agents

Agents are specialized AI personas, each expert in their domain:

- **Analyst** — Initializes projects, tracks progress, conducts research
- **PM** — Creates requirements (PRD or tech-spec)
- **UX-Designer** — Designs user interfaces and experiences
- **Architect** — Makes technical decisions, designs system architecture
- **SM (Scrum Master)** — Manages sprints, creates stories
- **DEV** — Implements code, reviews work

### Workflows

Workflows are guided processes that agents run. You tell an agent to run a workflow, and it walks you through the process interactively.

### Planning Tracks

Based on your project's complexity, BMAD offers three tracks:

| Track           | Best For                                   | Documents Created              |
| --------------- | ------------------------------------------ | ------------------------------ |
| **Quick Flow**  | Bug fixes, simple features, clear scope    | Tech-spec only                 |
| **BMAD Method** | Products, platforms, complex features      | PRD + Architecture + UX        |
| **Enterprise**  | Compliance, multi-tenant, enterprise needs | PRD + Architecture + Security + DevOps |

---

## Step 3: Initialize Your Project

Now let's set up your project with BMAD.

### 3.1 Load the Analyst Agent

In your IDE, load the Analyst agent. The method depends on your IDE:

- **Claude Code**: Type `/analyst` or load the agent file directly
- **Cursor/Windsurf**: Open the agent file from `_bmad/bmm/agents/`

Wait for the agent's menu to appear. You'll see a list of available workflows.

### 3.2 Run the Initialization Workflow

Tell the agent to initialize your project:

```
Run workflow-init
```

Or use the shorthand:

```
*workflow-init
```

### 3.3 Describe Your Project

The workflow asks you to describe:

- **Your project and goals** — What are you building? What problem does it solve?
- **Existing codebase** — Is this a new project (greenfield) or existing code (brownfield)?
- **Size and complexity** — Roughly how big is this? (You can adjust later)

### 3.4 Choose Your Track

Based on your description, the workflow suggests a planning track. You can accept the suggestion or choose a different one:

- Choose **Quick Flow** if you have a clear, bounded task
- Choose **BMAD Method** for most new products or features
- Choose **Enterprise** if you have compliance or security requirements

For this tutorial, we'll assume you chose **BMAD Method**.

### 3.5 Confirm and Create

Once you confirm, the workflow creates `bmm-workflow-status.yaml` in your project's docs folder. This file tracks your progress through all phases.

> **Important**: Always start a fresh chat for each workflow. This prevents context limitations from causing issues.

---

## Step 4: Create Your Requirements Document

With your project initialized, it's time to create your first planning document — the PRD (Product Requirements Document).

### 4.1 Start a Fresh Chat

Close your current chat and start a new one. This ensures the agent has full context capacity for the workflow.

### 4.2 Load the PM Agent

Load the PM (Product Manager) agent in your IDE.

### 4.3 Run the PRD Workflow

Tell the PM agent:

```
Run prd
```

Or use shortcuts:

- `*prd`
- Select "create-prd" from the menu
- Say "Let's create a new PRD"

### 4.4 Work Through the PRD

The PM agent guides you through creating your PRD interactively:

1. **Project overview** — Refine your project description
2. **Goals and success metrics** — What does success look like?
3. **User personas** — Who uses this product?
4. **Functional requirements** — What must the system do?
5. **Non-functional requirements** — Performance, security, scalability needs

Answer the agent's questions thoughtfully. The PRD becomes the foundation for everything that follows.

### 4.5 Review Your PRD

When complete, you'll have a `PRD.md` file in your `_bmad-output/` folder. Review it to ensure it captures your vision.

---

## Step 5: Check Your Progress

At any point, you can check what to do next.

### 5.1 Load Any Agent

Start a fresh chat and load any BMAD agent.

### 5.2 Ask for Status

Tell the agent:

```
workflow-status
```

The agent reads your `bmm-workflow-status.yaml` and tells you:

- Which phase you're in
- What workflows are complete
- What the next recommended or required step is

Example response:

```
Phase 2 (Planning) complete:
  ✓ PRD created

Next recommended steps:
  - UX Design (optional, if your project has a UI)
  - Architecture (required for BMAD Method track)
    Agent: architect
    Command: create-architecture
```

---

## What You've Accomplished

You've completed the foundation of a BMAD project:

- Installed BMAD and configured it for your IDE
- Initialized a project with your chosen planning track
- Created a PRD that defines your product requirements

Your project now has:

```
your-project/
├── _bmad/                    # BMAD configuration
├── _bmad-output/
│   ├── PRD.md               # Your requirements document
│   └── bmm-workflow-status.yaml  # Progress tracking
└── ...
```

---

## Next Steps

Continue building your project by designing your system's technical foundation (required for BMAD Method) and then starting implementation story by story.

Explore related topics:

- **[What Are Agents?](../../explanation/core-concepts/what-are-agents.md)** — Deep dive into how agents work
- **[What Are Workflows?](../../explanation/core-concepts/what-are-workflows.md)** — Understanding BMAD's workflow system
- **[Workflow Reference](../../reference/workflows/index.md)** — Complete list of available workflows

---

## Quick Reference

Commands you learned in this tutorial:

| Command          | Agent   | Purpose                            |
| ---------------- | ------- | ---------------------------------- |
| `*workflow-init` | Analyst | Initialize a new project           |
| `*prd`           | PM      | Create a Product Requirements Document |
| `workflow-status`| Any     | Check progress and next steps      |

> **Tip**: Agents are flexible with commands. Menu numbers, shortcuts (`*prd`), or natural language ("Let's create a PRD") all work.

---

## Common Questions

**Q: Do I need to create a PRD for every project?**

Only for BMAD Method and Enterprise tracks. Quick Flow projects use a simpler tech-spec instead.

**Q: Can I skip Phase 1 (Analysis)?**

Yes, Phase 1 is optional. If you already know what you're building, start with Phase 2 (Planning).

**Q: What if I want to brainstorm first?**

Load the Analyst agent and run `*brainstorm-project` before `workflow-init`.

**Q: Why start fresh chats for each workflow?**

Workflows are context-intensive. Reusing chats can cause the AI to hallucinate or lose track of details. Fresh chats ensure maximum context capacity.

---

## Getting Help

- **During workflows**: Agents guide you with questions and explanations
- **Check status**: Run `workflow-status` with any agent
- **Community**: [Discord](https://discord.gg/gk8jAdXWmj) — #general-dev, #bugs-issues
- **Video tutorials**: [BMad Code YouTube](https://www.youtube.com/@BMadCode)
