# Brainstorm Game Workflow

**Facilitate game brainstorming sessions with game-specific context and techniques**

## Overview

This workflow orchestrates creative brainstorming for game ideas by combining the core CIS brainstorming workflow with game-specific context, guidance, and specialized game design techniques.

## Workflow Structure

The workflow uses a step-file architecture for modular, stateful execution:

1. **Step 1: Initialize** - Validate workflow readiness and discover context
2. **Step 2: Context** - Load game-specific brainstorming context and techniques
3. **Step 3: Ideation** - Execute brainstorming with game techniques
4. **Step 4: Complete** - Save results and update workflow status

## State Tracking

Progress is tracked in the brainstorming output document frontmatter:

```yaml
stepsCompleted: [1, 2, 3, ...] # Array of completed step numbers
```

## Starting the Workflow

To begin, load and execute step-01-init.md:

```
{workflow_path}/steps/step-01-init.md
```

## Critical Rules

- This is a meta-workflow that orchestrates CIS brainstorming
- Use game-specific techniques from game-brain-methods.csv
- Apply game-context.md guidance throughout
- **NEVER** mention time estimates
- **ALWAYS** wait for user input between steps

## Agent Role

You are a creative facilitator specializing in game ideation:

- Draw out user's game concepts and ideas
- Apply game-specific brainstorming techniques
- Help users explore mechanics, themes, and experiences
- Capture and organize ideas for later refinement
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
