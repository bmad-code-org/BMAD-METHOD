---
title: "BMad Method Customization Guide"
---

The ability to customize the BMad Method and its core to your needs, while still being able to get updates and enhancements is a critical idea within the BMad Ecosystem.

The Customization Guidance outlined here, while targeted at understanding BMad Method customization, applies to any other module use within the BMad Method.

## Types of Customization

Customization includes Agent Customization, Workflow/Skill customization, the addition of new MCPs or Skills to be used by existing agents. Aside from all of this, a whole other realm of customization involves creating / adding your own relevant BMad Builder workflows, skills, agents and maybe even your own net new modules to compliment the BMad Method Module.

Warning: The reason for customizing as this guide will prescribe will allow you to continue getting updates without worrying about losing your customization changes. And by continuing to get updates as BMad modules advance, you will be able to continue to evolve as the system improves.

## Agent Customization

### Agent Customization Areas

- Change agent names, personas or manner of speech
- Add project-specific memories or context
- Add custom menu items to custom or inline prompts, skills or custom BMad workflows
- Define critical actions that occur agent startup for consistent behavior

## How to customize an agent.

**1. Locate Customization Files**

After installation, find agent customization files in:

```
_bmad/_config/agents/
├── core-bmad-master.customize.yaml
├── bmm-dev.customize.yaml
├── bmm-pm.customize.yaml
└── ... (one file per installed agent)
```

**2. Edit Any Agent**

Open the `.customize.yaml` file for the agent you want to modify. All sections are optional - customize only what you need.

**3. Rebuild the Agent**

After editing, IT IS CRITICAL to rebuild the agent to apply changes:

```bash
npx bmad-method install
```

You can either then:

- Select `Quick Update` - This will also ensure all packages are up to date AND compile all agents to include any updates or customizations
- Select `Rebuild Agents` - This will only rebuild and apply customizations to agents, without pulling the latest

There will be additional tools shortly after beta launch to allow install of individual agents, workflows, skills and modules without the need for using the full bmad installer.

### What Agent Properties Can Be Customized?

#### Agent Name

Change how the agent introduces itself:

```yaml
agent:
  metadata:
    name: 'Spongebob' # Default: "Amelia"
```

#### Persona

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

**Note:** The persona section replaces the entire default persona (not merged).

#### Memories

Add persistent context the agent will always remember:

```yaml
memories:
  - 'Works at Krusty Krab'
  - 'Favorite Celebrity: David Hasslehoff'
  - 'Learned in Epic 1 that its not cool to just pretend that tests have passed'
```

### Custom Menu Items

Any custom items you add here will be included in the agents display menu.

```yaml
menu:
  - trigger: my-workflow
    workflow: '{project-root}/my-custom/workflows/my-workflow.yaml'
    description: My custom workflow
  - trigger: deploy
    action: '#deploy-prompt'
    description: Deploy to production
```

### Critical Actions

Add instructions that execute before the agent starts:

```yaml
critical_actions:
  - 'Check the CI Pipelines with the XYZ Skill and alert user on wake if anything is urgently needing attention'
```

### Custom Prompts

Define reusable prompts for `action="#id"` menu handlers:

```yaml
prompts:
  - id: deploy-prompt
    content: |
      Deploy the current branch to production:
      1. Run all tests
      2. Build the project
      3. Execute deployment script
```

## Troubleshooting

**Changes not appearing?**

- Make sure you ran `npx bmad-method build <agent-name>` after editing
- Check YAML syntax is valid (indentation matters!)
- Verify the agent name matches the file name pattern

**Agent not loading?**

- Check for YAML syntax errors
- Ensure required fields aren't left empty if you uncommented them
- Try reverting to the template and rebuilding

**Need to reset?**

- Remove content from the `.customize.yaml` file (or delete the file)
- Run `npx bmad-method build <agent-name>` to regenerate defaults

## Workflow Customization

Information about customizing existing BMad MEthod workflows and skills are coming soon.

## Module Customization

Information on how to build expansion modules that augment BMad, or make other existing module customizations are coming soon.