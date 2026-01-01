# Workflows

Workflows are structured processes that guide agents through complex tasks. Think of them as recipes that ensure consistent, high-quality outcomes.

## What is a Workflow?

A workflow is a step-by-step process that agents follow to accomplish specific objectives. A workflow can be a single file if small enough, but more than likely is comprized of a very small workflow or skill definition file with multiple steps and data files that are loaded as needed on demand. Each step file:

- Defines a clear goal
- Provides instructions for the agent
- May include decision points or user interactions
- Produces specific outputs
- Progressively at a specific point can load the next proper step.

## How Workflows Work

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Step 1    │ →  │   Step 2    │ →  │   Step 3    │ →  │  Complete   │
│  Discover   │    │   Define    │    │   Build     │    │   Output    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

**Key characteristics:**
- **Progressive** - Each step builds on the previous
- **Interactive** - Workflows can pause for user input
- **Reusable** - The same workflow produces consistent results
- **Composable** - Workflow steps can call other workflow steps, or whole other workflows!
- **LLM Reinforcement** - Some rules or info is repeated in each step file ensuring certain rules are always top of agent mind, even during context heavy processes or very long workflows!

## Workflow Types

### Planning Workflows

Generate project artifacts like requirements, architecture, and task breakdowns.

**Examples:** Brief creation, PRD authoring, architecture design, sprint planning

### Execution Workflows

Guide implementation of specific tasks or features.

**Examples:** Code implementation, code review, testing, deployment

### Support Workflows

Handle cross-cutting concerns and creative processes.

**Examples:** Brainstorming, retrospectives, root cause analysis

## Progressive Disclosure

BMAD workflows use **progressive disclosure** - each step only knows about its immediate next step and what it is currently meant to do. This:

- Reduces cognitive load on the AI
- Ensures each step gets full attention
- Allows for conditional routing based on previous outcomes
- Makes workflows easier to debug and modify

## Menu-Driven Interaction

Most workflows use interactive menus with standard options:

| Option           | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| **[A] Advanced** | Invoke deeper reasoning techniques                 |
| **[P] Party**    | Get multiple agent perspectives                    |
| **[C] Continue** | Proceed to next step after all writes are complete |

## Workflow Files

Workflows are markdown files with structured frontmatter - this front matter also allows them to easily work as skills and also slash command loaded:

```yaml
---
name: 'my-workflow'
description: 'What this workflow does and when it should be used or loaded automatically (or call out if it should be requested to run explicitly by the user)'
---
```

The content in the workflow file is very minimal, sets up the reinforcement of the agent persona and reminder that it is a facilitator working with a user, lays out rules of processing steps only when told to do a specific step, loads all config file variables needed by the workflow, and then routes to step 1. No other info about other steps should be in this workflow file. Keeping it as small and lean as possible help in compilation as a skill, as overall size of the skill main file (workflow.md) is critical to keep small.

## Creating Custom Workflows

The **BMAD Builder (BMB)** module includes workflows for creating custom workflows. See [BMB Documentation](../modules/bmb-bmad-builder/) for details.

---

**Next:** Learn about [Modules](./modules.md) to see how agents and workflows are organized.
