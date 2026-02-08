---
title: "How to Customize BMad"
description: Customize agents, workflows, and modules while preserving update compatibility
sidebar:
  order: 7
---

Use the `.customize.yaml` files to tailor agent behavior, personas, and menus while preserving your changes across updates.

## When to Use This

- You want to change an agent's name, personality, or communication style
- You need agents to remember project-specific context
- You want to add custom menu items that trigger your own workflows or prompts
- You want agents to perform specific actions every time they start up

:::note[Prerequisites]
- BMad installed in your project (see [How to Install BMad](./install-bmad.md))
- A text editor for YAML files
:::

:::caution[Keep Your Customizations Safe]
Always use the `.customize.yaml` files described here rather than editing agent files directly. The installer overwrites agent files during updates, but preserves your `.customize.yaml` changes.
:::

## Steps

### 1. Locate Customization Files

After installation, find one `.customize.yaml` file per agent in:

```text
_bmad/_config/agents/
├── core-bmad-master.customize.yaml
├── bmm-dev.customize.yaml
├── bmm-pm.customize.yaml
└── ... (one file per installed agent)
```

### 2. Edit the Customization File

Open the `.customize.yaml` file for the agent you want to modify. Every section is optional -- customize only what you need.

| Section             | Behavior     | Purpose                                        |
| ------------------- | ------------ | ---------------------------------------------- |
| `agent.metadata`    | Replaces     | Override the agent's display name               |
| `persona`           | Replaces     | Set role, identity, style, and principles       |
| `memories`          | Appends      | Add persistent context the agent always recalls |
| `menu`              | Appends      | Add custom menu items for workflows or prompts  |
| `critical_actions`  | Appends      | Define startup instructions for the agent       |
| `prompts`           | Appends      | Create reusable prompts for menu actions         |

Sections marked **Replaces** overwrite the agent's defaults entirely. Sections marked **Appends** add to the existing configuration.

**Agent Name**

Change how the agent introduces itself:

```yaml
agent:
  metadata:
    name: 'Spongebob' # Default: "Amelia"
```

**Persona**

Replace the agent's personality, role, and communication style:

```yaml
persona:
  role: 'Senior Full-Stack Engineer'
  identity: 'Lives in a pineapple (under the sea)'
  communication_style: 'Spongebob annoying'
  principles:
    - 'Never Nester, Spongebob Devs hate nesting more than 2 levels deep'
    - 'Favor composition over inheritance'
```

The `persona` section replaces the entire default persona, so include all four fields if you set it.

**Memories**

Add persistent context the agent will always remember:

```yaml
memories:
  - 'Works at Krusty Krab'
  - 'Favorite Celebrity: David Hasslehoff'
  - 'Learned in Epic 1 that it is not cool to just pretend that tests have passed'
```

**Menu Items**

Add custom entries to the agent's display menu. Each item needs a `trigger`, a target (`workflow` path or `action` reference), and a `description`:

```yaml
menu:
  - trigger: my-workflow
    workflow: '{project-root}/my-custom/workflows/my-workflow.yaml'
    description: My custom workflow
  - trigger: deploy
    action: '#deploy-prompt'
    description: Deploy to production
```

**Critical Actions**

Define instructions that run when the agent starts up:

```yaml
critical_actions:
  - 'Check the CI Pipelines with the XYZ Skill and alert user on wake if anything is urgently needing attention'
```

**Custom Prompts**

Create reusable prompts that menu items can reference with `action="#id"`:

```yaml
prompts:
  - id: deploy-prompt
    content: |
      Deploy the current branch to production:
      1. Run all tests
      2. Build the project
      3. Execute deployment script
```

### 3. Apply Your Changes

After editing, recompile the agent to apply changes:

```bash
npx bmad-method install
```

The installer detects the existing installation and offers these options:

| Option                | What It Does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| **Quick Update**      | Updates all modules to the latest version and recompiles all agents |
| **Recompile Agents**  | Applies customizations only, without updating module files          |
| **Modify BMad Installation** | Full installation flow for adding or removing modules        |

For customization-only changes, **Recompile Agents** is the fastest option.

## Troubleshooting

**Changes not appearing?**

- Run `npx bmad-method install` and select **Recompile Agents** to apply changes
- Check that your YAML syntax is valid (indentation matters)
- Verify you edited the correct `.customize.yaml` file for the agent

**Agent not loading?**

- Check for YAML syntax errors using an online YAML validator
- Ensure you did not leave fields empty after uncommenting them
- Try reverting to the original template and rebuilding

**Need to reset an agent?**

- Clear or delete the agent's `.customize.yaml` file
- Run `npx bmad-method install` and select **Recompile Agents** to restore defaults

## Workflow Customization

Customization of existing BMad Method workflows and skills is coming soon.

## Module Customization

Guidance on building expansion modules and customizing existing modules is coming soon.
