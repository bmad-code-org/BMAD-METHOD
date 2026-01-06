# Agent Creation Guide

Create your own custom agents using the BMAD Builder workflow.

## Overview

The BMAD Builder (BMB) module provides an interactive workflow that guides you through creating a custom agent from concept to completion. You define the agent's purpose, personality, capabilities, and menu - then the workflow generates a complete, ready-to-use agent file.

## Before You Start

**Prerequisites:**
- BMAD installed with the BMB module
- An idea for what you want your agent to do
- About 15-30 minutes for your first agent

**Know Before You Go:**
- What problem should your agent solve?
- Who will use this agent?
- What should the agent be able to do?

## Quick Start

### 1. Start the Workflow

In your IDE (Claude Code, Cursor, etc.), invoke the create-agent workflow:

```
"Run the BMAD Builder create-agent workflow"
```

Or trigger it via the BMAD Master menu.

### 2. Follow the Steps

The workflow guides you through:

| Step | What You'll Do |
|------|----------------|
| **Brainstorm** (optional) | Explore ideas with creative techniques |
| **Discovery** | Define the agent's purpose and goals |
| **Type & Metadata** | Choose Simple or Expert, name your agent |
| **Persona** | Craft the agent's personality and principles |
| **Commands** | Define what the agent can do |
| **Activation** | Set up autonomous behaviors (optional) |
| **Build** | Generate the agent file |
| **Validation** | Review and verify everything works |

### 3. Install Your Agent

Once created, package your agent for installation:

```
my-custom-stuff/
├── module.yaml          # Contains: unitary: true
├── agents/
│   └── {agent-name}/
│       ├── {agent-name}.agent.yaml
│       └── _memory/              # Expert agents only
│           └── {sidecar-folder}/
└── workflows/           # Optional: custom workflows
```

See [Custom Content Installation](./custom-content-installation.md) for details.

## Choosing Your Agent Type

The workflow will help you decide, but here's the quick reference:

### Choose Simple Agent When:

- Task is well-defined and focused
- Don't need persistent memory
- Want fast setup and deployment
- Single-purpose assistant (e.g., commit messages, code review)

**Example:** A "Code Commenter" that reads files and adds helpful comments.

### Choose Expert Agent When:

- Domain requires specialized knowledge
- Need persistent memory across sessions
- Agent coordinates complex workflows
- Building ongoing project infrastructure

**Example:** A "Security Architect" that remembers your design decisions and maintains security standards across the project.

### Choose Module Agent When:

- Agent builds other agents or workflows
- Need integration with module system
- Creating professional tooling

**Example:** A "Team Builder" that helps set up agents for new team members.

## The Persona System

Your agent's personality is defined by four fields:

| Field | Purpose | Example |
|-------|---------|---------|
| **Role** | What they do | "Senior code reviewer who catches bugs and suggests improvements" |
| **Identity** | Who they are | "Friendly but exacting, believes clean code is a craft" |
| **Communication Style** | How they speak | "Direct, constructive, explains the 'why' behind suggestions" |
| **Principles** | Why they act | "Security first, clarity over cleverness, test what you fix" |

**Key:** Keep each field focused on its purpose. The role isn't personality; the identity isn't job description.

## Tips for Success

### Start Small

Your first agent should solve **one problem well**. You can always add more capabilities later.

### Learn by Example

Study the reference agents in `src/modules/bmb/reference/agents/`:
- **Simple:** [commit-poet](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/simple-examples/commit-poet.agent.yaml)
- **Expert:** [journal-keeper](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/expert-examples/journal-keeper)

### Write Great Principles

The first principle should "activate" the agent's expertise:

❌ **Weak:** "Be helpful and accurate"
✅ **Strong:** "Channel decades of security expertise: threat modeling begins with trust boundaries, never trust client input, defense in depth is non-negotiable"

### Use the Menu System

The workflow provides options at each step:
- **[A] Advanced** - Get deeper insights and reasoning
- **[P] Party** - Get multiple agent perspectives
- **[C] Continue** - Move to the next step

Use these when you need extra input or creative options.

## After Creation

### Test Your Agent

1. Install your custom module using the BMAD installer
2. Invoke your new agent in your IDE
3. Try each menu command
4. Verify the personality feels right

### Iterate

If something isn't right:
1. Edit the agent YAML directly, or
2. Edit the customization file in `_bmad/_config/agents/`
3. Rebuild using `npx bmad-method build <agent-name>`

### Share

Package your agent as a standalone module (see [Installation Guide](../../bmad-core-concepts/installing/)) and share it with your team or the community.

## Further Reading

- **[Agent Architecture](./index.md)** - Deep technical details on agent types
- **[Agent Customization](../../bmad-core-concepts/agent-customization/)** - Modify agents without editing core files
- **[Custom Content Installation](./custom-content-installation.md)** - Package and distribute your agents

---

**Ready?** Start the workflow and create your first agent!

[← Back to BMB Documentation](./index.md)
