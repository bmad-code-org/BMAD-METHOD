---
last-redoc-date: 2025-09-28
---

<!-- Powered by BMAD-CORE™ -->

# Creative Intelligence System (CIS)

**Purpose:** Transform creative and strategic thinking through AI-powered facilitation across five specialized domains. The CIS module provides expert coaching for brainstorming, design thinking, problem-solving, innovation strategy, and storytelling.

**Overview:** The Creative Intelligence System equips teams and individuals with structured creative methodologies delivered through distinctive agent personas. Each agent facilitates interactive workflows that guide users through proven techniques while adapting to context, energy levels, and goals. Unlike traditional creative tools, CIS agents act as master facilitators who ask questions to draw out insights rather than generating solutions directly.

## Workflows

[View all workflows →](./workflows/README.md)

The module includes **5 interactive workflows** with over 150 creative techniques and frameworks:

- **Brainstorming** - 36 creative techniques across 7 categories for ideation
- **Design Thinking** - Complete 5-phase human-centered design process
- **Problem Solving** - Systematic root cause analysis and solution generation
- **Innovation Strategy** - Business model innovation and disruption analysis
- **Storytelling** - 25 story frameworks for compelling narratives

## Agents

[View all agents →](./agents/README.md)

Five specialized agents with unique personas and communication styles:

- **Carson** - Elite Brainstorming Specialist (energetic facilitator)
- **Maya** - Design Thinking Maestro (jazz-like improviser)
- **Dr. Quinn** - Master Problem Solver (detective-scientist hybrid)
- **Victor** - Disruptive Innovation Oracle (bold strategic precision)
- **Sophia** - Master Storyteller (flowery, whimsical narrator)

## Configuration

The module uses `/bmad/cis/config.yaml` for:

- `output_folder` - Where workflow results are saved
- `user_name` - Session participant identification
- `communication_language` - Facilitation language preference

## Usage

```bash
# Direct workflow invocation
workflow brainstorming
workflow design-thinking --data /path/to/context.md

# Agent-facilitated sessions
agent cis/brainstorming-coach
> *brainstorm
```

## Key Differentiators

- **Facilitation Over Generation:** Agents guide users to discover their own insights through strategic questioning
- **Energy-Aware Sessions:** Built-in checkpoints monitor and adapt to user engagement levels
- **Context Integration:** All workflows accept optional context documents for domain-specific guidance
- **Persona-Driven Experience:** Each agent embodies a unique communication style matching their expertise
- **Rich Method Libraries:** 150+ proven techniques and frameworks across creative disciplines

## Installation

The CIS module installer (`_module-installer/`) configures the complete creative intelligence suite including all agents, workflows, and technique libraries.

## Module Architecture

```
cis/
├── agents/          # 5 specialized creative agents
├── workflows/       # 5 interactive workflows
│   ├── brainstorming/
│   ├── design-thinking/
│   ├── innovation-strategy/
│   ├── problem-solving/
│   └── storytelling/
├── tasks/           # Supporting task operations
└── teams/           # Agent team configurations
```

---

_Part of the BMAD Method v6.0 - Transform your creative potential with expert AI facilitation_
