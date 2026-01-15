---
title: "Create a Custom Agent"
---


Build your own AI agent with a unique personality, specialized commands, and optional persistent memory using the BMad Builder workflow.

:::note[BMB Module]
This tutorial uses the **BMad Builder (BMB)** module. Make sure you have BMad installed with the BMB module enabled.
:::

## What You'll Learn

- How to run the `create-agent` workflow
- Choose between Simple, Expert, and Module agent types
- Define your agent's persona (role, identity, communication style, principles)
- Package and install your custom agent
- Test and iterate on your agent's behavior

:::note[Prerequisites]
- BMad installed with the BMB module
- An idea for what you want your agent to do
- About 15-30 minutes for your first agent
:::

:::tip[Quick Path]
Run `create-agent` workflow → Follow the guided steps → Install your agent module → Test and iterate.
:::

## Understanding Agent Types

Before creating your agent, understand the three types available:

| Type       | Best For                              | Memory     | Complexity |
| ---------- | ------------------------------------- | ---------- | ---------- |
| **Simple** | Focused tasks, quick setup            | None       | Low        |
| **Expert** | Specialized domains, ongoing projects | Persistent | Medium     |
| **Module** | Building other agents/workflows       | Persistent | High       |

**Simple Agent** - Use when your task is well-defined and focused. Perfect for single-purpose assistants like commit message generators or code reviewers.

**Expert Agent** - Use when your domain requires specialized knowledge or you need memory across sessions. Great for roles like Security Architect or Documentation Lead.

**Module Agent** - Use when your agent builds other agents or needs deep integration with the module system.

## Step 1: Start the Workflow

In your IDE (Claude Code, Cursor, etc.), invoke the create-agent workflow with the agent-builder agent.

The workflow guides you through eight steps:

| Step                        | What You'll Do                               |
| --------------------------- | -------------------------------------------- |
| **Brainstorm** *(optional)* | Explore ideas with creative techniques       |
| **Discovery**               | Define the agent's purpose and goals         |
| **Type & Metadata**         | Choose Simple or Expert, name your agent     |
| **Persona**                 | Craft the agent's personality and principles |
| **Commands**                | Define what the agent can do                 |
| **Activation**              | Set up autonomous behaviors *(optional)*     |
| **Build**                   | Generate the agent file                      |
| **Validation**              | Review and verify everything works           |

:::tip[Workflow Options]
At each step, the workflow provides options:
- **[A] Advanced** - Get deeper insights and reasoning
- **[P] Party** - Get multiple agent perspectives
- **[C] Continue** - Move to the next step
:::

## Step 2: Define the Persona

Your agent's personality is defined by four fields:

| Field                   | Purpose        | Example                                                           |
| ----------------------- | -------------- | ----------------------------------------------------------------- |
| **Role**                | What they do   | "Senior code reviewer who catches bugs and suggests improvements" |
| **Identity**            | Who they are   | "Friendly but exacting, believes clean code is a craft"           |
| **Communication Style** | How they speak | "Direct, constructive, explains the 'why' behind suggestions"     |
| **Principles**          | Why they act   | "Security first, clarity over cleverness, test what you fix"      |

Keep each field focused on its purpose. The role isn't personality; the identity isn't job description.

:::note[Writing Great Principles]
The first principle should "activate" the agent's expertise:

- **Weak:** "Be helpful and accurate"
- **Strong:** "Channel decades of security expertise: threat modeling begins with trust boundaries, never trust client input, defense in depth is non-negotiable"
:::

## Step 3: Install Your Agent

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

Install using the BMad installer, then invoke your new agent in your IDE.

## What You've Accomplished

You've created a custom AI agent with:

- A defined purpose and role in your workflow
- A unique persona with communication style and principles
- Custom menu commands for your specific tasks
- Optional persistent memory for ongoing context

Your project now includes:

```
_bmad/
├── _config/
│   └── agents/
│       └── {your-agent}/        # Your agent customizations
└── {module}/
    └── agents/
        └── {your-agent}/
            └── {your-agent}.agent.yaml
```

## Quick Reference

| Action              | How                                            |
| ------------------- | ---------------------------------------------- |
| Start workflow      | `"Run the BMad Builder create-agent workflow"` |
| Edit agent directly | Modify `{agent-name}.agent.yaml`               |
| Edit customization  | Modify `_bmad/_config/agents/{agent-name}`     |
| Rebuild agent       | `npx bmad-method build <agent-name>`           |
| Study examples      | Check `src/modules/bmb/reference/agents/`      |

## Common Questions

**Should I start with Simple or Expert?**
Start with Simple for your first agent. You can always upgrade to Expert later if you need persistent memory.

**How do I add more commands later?**
Edit the agent YAML directly or use the customization file in `_bmad/_config/agents/`. Then rebuild.

**Can I share my agent with others?**
Yes. Package your agent as a standalone module and share it with your team or the community.

**Where can I see example agents?**
Study the reference agents in `src/modules/bmb/reference/agents/`:
- [commit-poet](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/simple-examples/commit-poet.agent.yaml) (Simple)
- [journal-keeper](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/expert-examples/journal-keeper) (Expert)

## Getting Help

- **[Discord Community](https://discord.gg/gk8jAdXWmj)** - Ask in #bmad-method-help or #report-bugs-and-issues
- **[GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - Report bugs or request features

## Further Reading

- **[What Are Agents](/docs/explanation/core-concepts/what-are-agents.md)** - Deep technical details on agent types
- **[Agent Customization](/docs/how-to/customization/customize-agents.md)** - Modify agents without editing core files
- **[Custom Content Installation](/docs/how-to/installation/install-custom-modules.md)** - Package and distribute your agents

:::tip[Key Takeaways]
- **Start small** - Your first agent should solve one problem well
- **Persona matters** - Strong principles activate the agent's expertise
- **Iterate often** - Test your agent and refine based on behavior
- **Learn from examples** - Study reference agents before building your own
:::
