# Agent Customization Guide

Customize BMad agents without modifying core files. All customizations persist through updates.

## Quick Start

**1. Locate Customization Files**

After installation, find agent customization files in:

```
{bmad_folder}/_cfg/agents/
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
npx bmad-method@alpha install # and then select option to compile all agents
# OR for individual agent only
npx bmad-method@alpha build <agent-name>

# Examples:
npx bmad-method@alpha build bmm-dev
npx bmad-method@alpha build core-bmad-master
npx bmad-method@alpha build bmm-pm
```

## What You Can Customize

### Agent Name

Change how the agent introduces itself:

```yaml
agent:
  metadata:
    name: 'Spongebob' # Default: "Amelia"
```

### Persona

Replace the agent's personality, role, and communication style:

```yaml
persona:
  role: 'Senior Full-Stack Engineer'
  identity: 'Lives in a pineapple (under the sea)'
  communication_style: 'Spongebob'
  principles:
    - 'Never Nester, Spongebob Devs hate nesting more than 2 levels deep'
    - 'Favor composition over inheritance'
```

**Note:** The persona section replaces the entire default persona (not merged).

### Memories

Add persistent context the agent will always remember:

```yaml
memories:
  - 'Works at Krusty Krab'
  - 'Favorite Celebrity: David Hasslehoff'
  - 'Learned in Epic 1 that its not cool to just pretend that tests have passed'
```

### Custom Menu Items

Add your own workflows to the agent's menu:

```yaml
menu:
  - trigger: my-workflow
    workflow: '{project-root}/custom/my-workflow.yaml'
    description: My custom workflow
  - trigger: deploy
    action: '#deploy-prompt'
    description: Deploy to production
```

**Don't include:** `*` prefix or `help`/`exit` items - these are auto-injected.

### Critical Actions

Add instructions that execute before the agent starts:

```yaml
critical_actions:
  - 'Always check git status before making changes'
  - 'Use conventional commit messages'
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

## Real-World Examples

**Example 1: Customize Developer Agent for TDD**

```yaml
# {bmad_folder}/_cfg/agents/bmm-dev.customize.yaml
agent:
  metadata:
    name: 'TDD Developer'

memories:
  - 'Always write tests before implementation'
  - 'Project uses Jest and React Testing Library'

critical_actions:
  - 'Review test coverage before committing'
```

**Example 2: Add Custom Deployment Workflow**

```yaml
# {bmad_folder}/_cfg/agents/bmm-dev.customize.yaml
menu:
  - trigger: deploy-staging
    workflow: '{project-root}/.bmad-custom/deploy-staging.yaml'
    description: Deploy to staging environment
  - trigger: deploy-prod
    workflow: '{project-root}/.bmad-custom/deploy-prod.yaml'
    description: Deploy to production (with approval)
```

**Example 3: Multilingual Product Manager**

```yaml
# {bmad_folder}/_cfg/agents/bmm-pm.customize.yaml
persona:
  role: 'Bilingual Product Manager'
  identity: 'Expert in US and LATAM markets'
  communication_style: 'Clear, strategic, with cultural awareness'
  principles:
    - 'Consider localization from day one'
    - 'Balance business goals with user needs'

memories:
  - 'User speaks English and Spanish'
  - 'Target markets: US and Latin America'
```

## Tips

- **Start Small:** Customize one section at a time and rebuild to test
- **Backup:** Copy customization files before major changes
- **Update-Safe:** Your customizations in `_cfg/` survive all BMad updates
- **Per-Project:** Customization files are per-project, not global
- **Version Control:** Consider committing `_cfg/` to share customizations with your team

## Module vs. Global Config

**Module-Level (Recommended):**

- Customize agents per-project in `{bmad_folder}/_cfg/agents/`
- Different projects can have different agent behaviors

**Global Config (Coming Soon):**

- Set defaults that apply across all projects
- Override with project-specific customizations

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

- Delete the `.customize.yaml` file
- Run `npx bmad-method build <agent-name>` to regenerate defaults

## Next Steps

- **[BMM Agents Guide](../src/modules/bmm/docs/agents-guide.md)** - Learn about all 12 BMad Method agents
- **[BMB Create Agent Workflow](../src/modules/bmb/workflows/create-agent/README.md)** - Build completely custom agents
- **[BMM Complete Documentation](../src/modules/bmm/docs/README.md)** - Full BMad Method reference
