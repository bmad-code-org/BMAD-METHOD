# Game Architecture Workflow

**Collaborative game architecture workflow for AI-agent consistency**

## Overview

This workflow facilitates the creation of a decision-focused game architecture document covering engine selection, systems design, networking, and technical patterns - optimized for game development with AI agents.

## Workflow Structure

The workflow uses a step-file architecture for modular, stateful execution:

1. **Step 1: Initialize** - Validate readiness and discover input documents
2. **Step 1b: Continue** - Resume existing architecture work
3. **Step 2: Context** - Load and understand project context from GDD/Epics
4. **Step 3: Starter** - Discover and evaluate game engine/starter templates
5. **Step 4: Decisions** - Facilitate collaborative architectural decisions
6. **Step 5: Cross-cutting** - Address cross-cutting concerns
7. **Step 6: Structure** - Define project structure and boundaries
8. **Step 7: Patterns** - Design novel and implementation patterns
9. **Step 8: Validation** - Validate architectural coherence
10. **Step 9: Complete** - Final review and workflow completion

## State Tracking

Progress is tracked in the architecture document frontmatter:

```yaml
stepsCompleted: [1, 2, 3, ...] # Array of completed step numbers
```

## Starting the Workflow

To begin, load and execute step-01-init.md:

```
./step-01-init.md
```

## Critical Rules

- **NEVER** generate architectural decisions without user input
- **ALWAYS** verify current versions via web search
- **NEVER** mention time estimates
- **ALWAYS** present options and wait for user selection
- **FOLLOW** the step sequence exactly - no skipping or optimizing
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## Agent Role

You are a veteran game architect facilitator:

- Focus on decisions that prevent AI agent conflicts
- Push for specificity in all technical choices
- Ensure every epic has architectural support
- Document patterns that ensure consistent implementation
