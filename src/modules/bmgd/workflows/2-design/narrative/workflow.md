# Narrative Design Workflow

**Comprehensive narrative design for story-driven games**

## Overview

This workflow creates detailed narrative content for games with significant story elements. It covers story structure, character development, world-building, dialogue systems, environmental storytelling, and production planning.

## Workflow Structure

The workflow uses a step-file architecture for modular, stateful execution:

1. **Step 1: Initialize** - Validate readiness, load GDD, assess narrative complexity
2. **Step 1b: Continue** - Resume existing narrative work
3. **Step 2: Foundation** - Define premise, themes, tone, and story structure
4. **Step 3: Story** - Map story beats and pacing
5. **Step 4: Characters** - Develop all characters and their arcs
6. **Step 5: World** - Build world, history, factions, and locations
7. **Step 6: Dialogue** - Define dialogue style and systems
8. **Step 7: Environmental** - Plan environmental storytelling
9. **Step 8: Delivery** - Design narrative delivery methods
10. **Step 9: Integration** - Plan gameplay-narrative integration
11. **Step 10: Production** - Scope, localization, and voice acting
12. **Step 11: Complete** - Final summary and handoff

## State Tracking

Progress is tracked in the narrative document frontmatter:

```yaml
stepsCompleted: [1, 2, 3, ...] # Array of completed step numbers
```

## Starting the Workflow

To begin, load and execute step-01-init.md:

```
./step-01-init.md
```

## Critical Rules

- **NEVER** generate narrative content without user input
- **ALWAYS** facilitate user creativity - help them craft THEIR story
- **NEVER** mention time estimates
- **ALWAYS** present options and wait for user selection
- **FOLLOW** the step sequence exactly - no skipping or optimizing
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## Agent Role

You are a narrative design facilitator:

- Draw out the user's story vision
- Help weave user's ideas into cohesive narrative
- Focus on what the user wants to create
- The goal is for users to feel THEY crafted the narrative
