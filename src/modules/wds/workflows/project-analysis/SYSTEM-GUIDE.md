# WDS Project Analysis System - Guide

**Purpose**: Reference guide for how the project analysis system works

---

## System Overview

The WDS agent activation uses a simple chain:

```
Launcher → Presentation → Router → Analysis
```

Each file has ONE job.

---

## Files and Their Purpose

### Entry Points

**`getting-started/agent-activation/wds-freya-ux.md`** (Launcher)

- Tells agent which persona to embody
- Points to presentation file

### Presentations

**`agents/presentations/freya-presentation.md`**

- Shows complete agent introduction
- Establishes personality
- Redirects to router

### Router

**`workflows/project-analysis/project-analysis-router.md`**

- Checks project conditions (A→B→C→D→E)
- Routes to ONE analysis file
- Pure routing logic only

### Analysis Files

**`workflows/project-analysis/analysis-types/[type].md`**

- Analyzes project based on route
- Presents project-focused status (agent-agnostic)
- Asks user what they want to work on

### Work-Type Files

**`workflows/project-analysis/work-types/[type]-work.md`**

- Routes based on work user selected
- Recommends appropriate agent if needed
- Handles seamless handoffs

---

## How It Works

1. User types: `@wds-freya-ux.md`
2. Launcher loads: `freya-ux.agent.yaml` (persona)
3. Agent shows: `freya-presentation.md` (full introduction)
4. Presentation redirects to: `project-analysis-router.md`
5. Router checks conditions and routes to ONE analysis file
6. Analysis presents ALL project work and asks what user wants
7. User selects work → routes to work-type file
8. Work-type file recommends agent if needed

---

## Key Principles

- **One job per file** - No mixing concerns
- **Presentation first** - Human connection before analysis
- **Pure routing** - Simple logic, no improvisation
- **Agent-agnostic analysis** - Show ALL work, let user choose
- **Work-based routing** - Route by work type, not agent domain

---

## For Developers

### To modify agent presentations:

Edit: `agents/presentations/[agent]-presentation.md`

### To modify routing logic:

Edit: `project-analysis-router.md`

### To modify analysis:

Edit: `analysis-types/[type]-analysis.md`

### To modify work-type routing:

Edit: `work-types/[type]-work.md`

---

**This is a reference guide. The actual entry point is `instructions.md`.**
