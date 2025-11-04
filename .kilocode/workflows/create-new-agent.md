# Create New BMAD Agent

This workflow guides you through creating a new custom agent for the BMAD framework using the BMad Builder (BMB) module.

## Prerequisites

- BMB module installed (`bmad/bmb/` exists)
- Understanding of desired agent purpose and role
- Familiarity with BMAD agent structure

## Workflow Overview

This workflow uses the BMB interactive agent creation system. You have two approaches:

**Approach A**: Use the built-in creation workflow (recommended)
**Approach B**: Manual creation following BMAD v6 standards

## Approach A: Interactive Creation (Recommended)

### 1. Activate BMad Builder Agent

In your IDE, activate the BMad Builder agent from your available agents list.

### 2. Start Creation Workflow

Execute the agent creation workflow:

```
/workflow create-agent
```

Or navigate through the BMad Builder menu to select "Create New Agent"

### 3. Optional: Brainstorm Agent Concept

When prompted, choose whether to brainstorm the agent concept:

- **Yes**: Guided brainstorming session using creative techniques
- **No**: Proceed directly to agent definition

### 4. Define Agent Core Properties

Provide the following information when prompted:

**Basic Identity**:
- Agent slug (kebab-case, e.g., `data-analyst`)
- Display name (e.g., `Data Analyst`)
- Agent title/description
- Icon emoji (optional, e.g., `📊`)

**Agent Type**:
- Full module agent (complete persona with workflows)
- Hybrid agent (persona + specialized knowledge)
- Sidecar agent (focused sub-agent for specific expertise)

### 5. Develop Agent Persona

Define the agent's persona:

**Role**: What is this agent's primary function?
```
Example: "Senior Data Analyst specializing in business intelligence and insights"
```

**Identity**: Who is this agent? What expertise do they have?
```
Example: "Expert in data analysis, statistical modeling, and data visualization
with 10+ years of experience transforming raw data into actionable insights"
```

**Communication Style**: How should the agent communicate?
```
Example: "Analytical and precise, uses data to support recommendations,
explains complex concepts clearly, asks clarifying questions about metrics and goals"
```

**Principles**: Core beliefs or approaches?
```
Example: "Data quality first, context matters, visualize insights,
validate assumptions with data"
```

### 6. Design Agent Menu

Create menu items for the agent:

```yaml
<menu>
  <item cmd="*help">Show menu</item>
  <item cmd="*analyze-data" workflow="{project-root}/path/to/workflow.yaml">Analyze Dataset</item>
  <item cmd="*create-dashboard" action="#create-dashboard">Build Dashboard</item>
  <item cmd="*exit">Exit agent</item>
</menu>
```

Each menu item needs:
- `cmd`: Trigger text (use asterisk prefix)
- Display text
- Action type: `workflow`, `action`, or `exec`

### 7. Add Activation Instructions

Define what happens when the agent activates:

```xml
<activation critical="MANDATORY">
  <step n="1">Load persona from current agent file</step>
  <step n="2">Load project config from bmad/core/config.yaml</step>
  <step n="3">Greet user by {user_name} in {communication_language}</step>
  <step n="4">Display menu and wait for input</step>
</activation>
```

### 8. Create Associated Workflows (Optional)

If your agent references workflows, create them:

```bash
read_file("bmad/bmb/workflows/create-workflow/")
```

Follow the workflow creation process for each workflow your agent needs.

### 9. Review and Save

The BMB workflow will:
- Generate the complete agent file
- Save to appropriate location
- Validate against BMAD standards
- Update manifests

### 10. Test Your Agent

1. Restart your IDE or reload agents
2. Activate your new agent
3. Verify:
   - Greeting appears correctly
   - Menu displays properly
   - Menu items trigger correctly
   - Workflows execute as expected

## Approach B: Manual Creation

### 1. Create Agent File

Create file in appropriate location:
- **Module agent**: `src/modules/{module}/agents/{agent-name}.md`
- **Core agent**: `bmad/core/agents/{agent-name}.md`
- **Custom agent**: `bmad/_cfg/agents/{agent-name}.md` (customization only)

### 2. Add Frontmatter

```yaml
---
name: 'agent-name'
description: 'Brief description of agent purpose'
---
```

### 3. Add Agent XML Structure

```xml
<agent id="path/to/agent.md" name="Agent Name" title="Full Title" icon="🎯">
<activation critical="MANDATORY">
  <!-- Activation steps -->
</activation>

<persona>
  <role>Primary role</role>
  <identity>Who they are</identity>
  <communication_style>How they communicate</communication_style>
  <principles>Core principles</principles>
</persona>

<menu>
  <item cmd="*help">Show menu</item>
  <item cmd="*exit">Exit</item>
</menu>
</agent>
```

### 4. Follow BMAD Conventions

Ensure your agent follows:
- XML structure standards
- Menu handler patterns
- Activation step requirements
- Variable usage (`{user_name}`, `{communication_language}`, etc.)
- Config loading patterns

### 5. Update Manifests

Add entry to `bmad/_cfg/agent-manifest.csv`:

```csv
agent-slug,Agent Name,path/to/agent.md,Brief description
```

## Agent Types Explained

### Full Module Agent
- Complete persona with personality
- Multiple workflows and capabilities
- Examples: BMad Master, PM, Architect

### Hybrid Agent
- Persona + specialized knowledge base
- Knowledge stored in separate files
- Examples: Agents with extensive reference materials

### Sidecar Agent
- Focused, specialized sub-agent
- Works alongside main agents
- Examples: Release Chief Sidecar, Doc Keeper Sidecar

## Best Practices

1. **Clear Purpose**: Agent should have focused, well-defined role
2. **Consistent Voice**: Communication style should match persona
3. **User-Centric**: Design menu for user workflow efficiency
4. **Config Integration**: Always load and use user config
5. **Language Support**: Respect `{communication_language}` setting
6. **Error Handling**: Provide helpful messages for issues
7. **Documentation**: Include clear descriptions and usage examples
8. **Testing**: Thoroughly test all menu items and workflows

## Customization vs Extension

**Customization** (`bmad/_cfg/agents/`):
- Override existing agent properties
- Survives framework updates
- YAML format

**Extension** (new agent file):
- Create entirely new agent
- Add to source or project directly
- Full markdown with XML

## Validation

Use the BMB audit workflow to validate your agent:

```
/workflow audit-agent
```

This checks:
- XML structure validity
- Required fields presence
- Menu handler correctness
- BMAD v6 compliance
- Best practices adherence

## Troubleshooting

**Agent doesn't appear**:
- Check manifest was updated
- Verify file location
- Restart IDE

**Activation fails**:
- Validate XML structure
- Check config loading step
- Verify file paths in workflows

**Menu items don't work**:
- Check handler types (workflow, action, exec)
- Verify workflow paths exist
- Validate action IDs

**Persona not working**:
- Ensure activation loads persona
- Check communication style definition
- Verify identity is clear

## Resources

- [BMB Documentation](./bmad/bmb/README.md)
- [Agent Creation Guide](./bmad/bmb/workflows/create-agent/README.md)
- [BMAD Conventions](./docs/bmad-conventions.md)
- [Example Agents](./bmad/core/agents/)

## Next Steps

After creating your agent:

1. Create associated workflows if needed
2. Test thoroughly in real scenarios
3. Document usage examples
4. Share with team or community
5. Consider packaging as a module for distribution
