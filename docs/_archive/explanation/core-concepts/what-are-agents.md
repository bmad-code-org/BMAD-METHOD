---
title: "Agents"
---

Agents are AI assistants that help you accomplish tasks. Each agent has a unique personality, specialized capabilities, and an interactive menu.

## Agent Types

BMad has two primary agent types, designed for different use cases:

### Simple Agents

**Self-contained, focused, ready to use.**

Simple agents are complete in a single file. They excel at well-defined tasks and require minimal setup.

**Best for:**
- Single-purpose assistants (code review, documentation, commit messages)
- Quick deployment
- Projects that don't require persistent memory
- Getting started fast

**Example:** A commit message agent that reads your git diff and generates conventional commits.

### Expert Agents

**Powerful, memory-equipped, domain specialists.**

Expert agents have a **sidecar** - a companion folder containing additional instructions, workflows, and memory files. They remember context across sessions and handle complex, multi-step tasks.

**Best for:**
- Domain specialists (security architect, game designer, product manager)
- Tasks requiring persistent memory
- Complex workflows with multiple stages
- Projects that grow over time

**Example:** A game architect that remembers your design decisions, maintains consistency across sprints, and coordinates with other specialists.

## Key Differences

| Feature          | Simple         | Expert                     |
| ---------------- | -------------- | -------------------------- |
| **Files**        | Single file    | Agent + sidecar folder     |
| **Memory**       | Session only   | Persistent across sessions |
| **Capabilities** | Focused scope  | Multi-domain, extensible   |
| **Setup**        | Zero config    | Sidecar initialization     |
| **Best Use**     | Specific tasks | Ongoing projects           |

## Agent Components

All agents share these building blocks:

### Persona
- **Role** - What the agent does (expertise domain)
- **Identity** - Who the agent is (personality, character)
- **Communication Style** - How the agent speaks (tone, voice)
- **Principles** - Why the agent acts (values, decision framework)

### Capabilities
- Skills, tools, and knowledge the agent can apply
- Mapped to specific menu commands

### Menu
- Interactive command list
- Triggers, descriptions, and handlers
- Auto-includes help and exit options

### Critical Actions (optional)
- Instructions that execute before the agent starts
- Enable autonomous behaviors (e.g., "check git status before changes")

## Which Should You Use?

:::tip[Quick Decision]
Choose **Simple** for focused, one-off tasks with no memory needs. Choose **Expert** when you need persistent context and complex workflows.
:::

**Choose Simple when:**
- You need a task done quickly and reliably
- The scope is well-defined and won't change much
- You don't need the agent to remember things between sessions

**Choose Expert when:**
- You're building something complex over time
- The agent needs to maintain context (project history, decisions)
- You want the agent to coordinate workflows or other agents
- Domain expertise requires specialized knowledge bases

## Creating Custom Agents

BMad provides the **BMad Builder (BMB)** module for creating your own agents. See the [Agent Creation Guide](https://github.com/bmad-code-org/bmad-builder/blob/main/docs/tutorials/create-custom-agent.md) for step-by-step instructions.



## Customizing Existing Agents

You can modify any agent's behavior without editing core files. See [BMad Customization](/docs/how-to/customization/index.md) for details. It is critical to never modify an installed agents .md file directly and follow the customization process, this way future updates to the agent or module its part of will continue to be updated and recompiled with the installer tool, and your customizations will still be retained.
