# Module Agent Architecture

Full integration agents with workflow orchestration, module-specific paths, and professional tooling.

## When to Use

- Professional development workflows (business analysis, architecture design)
- Team-oriented tools (project management, sprint planning)
- Agents that orchestrate multiple workflows
- Module-specific functionality (BMM, BMB, CIS, custom modules)
- Agents with complex multi-step operations

## File Location

```
src/modules/{module-code}/agents/{agent-name}.agent.yaml
```

Compiles to:

```
.bmad/{module-code}/agents/{agent-name}.md
```

## YAML Structure

```yaml
agent:
  metadata:
    id: '{bmad_folder}/{module-code}/agents/{agent-name}.md'
    name: 'Persona Name'
    title: 'Professional Title'
    icon: 'emoji'
    module: '{module-code}'

  persona:
    role: 'Primary expertise and function'
    identity: 'Background, experience, specializations'
    communication_style: 'Interaction approach, tone, methodology'
    principles: 'Core beliefs and methodology'

  menu:
    - trigger: workflow-action
      workflow: '{project-root}/{bmad_folder}/{module-code}/workflows/{workflow-name}/workflow.yaml'
      description: 'Execute module workflow'

    - trigger: another-workflow
      workflow: '{project-root}/{bmad_folder}/core/workflows/{workflow-name}/workflow.yaml'
      description: 'Execute core workflow'

    - trigger: task-action
      exec: '{project-root}/{bmad_folder}/{module-code}/tasks/{task-name}.xml'
      description: 'Execute module task'

    - trigger: cross-module
      workflow: '{project-root}/{bmad_folder}/other-module/workflows/{workflow-name}/workflow.yaml'
      description: 'Execute workflow from another module'

    - trigger: with-template
      exec: '{project-root}/{bmad_folder}/core/tasks/create-doc.xml'
      tmpl: '{project-root}/{bmad_folder}/{module-code}/templates/{template-name}.md'
      description: 'Create document from template'

    - trigger: with-data
      exec: '{project-root}/{bmad_folder}/{module-code}/tasks/{task-name}.xml'
      data: '{project-root}/{bmad_folder}/_cfg/agent-manifest.csv'
      description: 'Execute task with data file'
```

## Key Components

### Metadata

- **id**: Path with `{bmad_folder}` variable (resolved at install time)
- **name**: Agent persona name
- **title**: Professional role
- **icon**: Single emoji
- **module**: Module code (bmm, bmb, cis, custom)

### Persona (Professional Voice)

Module agents typically use **professional** communication styles:

```yaml
persona:
  role: Strategic Business Analyst + Requirements Expert

  identity: Senior analyst with deep expertise in market research, competitive analysis, and requirements elicitation. Specializes in translating vague needs into actionable specs.

  communication_style: Systematic and probing. Connects dots others miss. Structures findings hierarchically. Uses precise unambiguous language. Ensures all stakeholder voices heard.

  principles: Every business challenge has root causes waiting to be discovered. Ground findings in verifiable evidence. Articulate requirements with absolute precision.
```

**Note:** Module agents usually don't use Handlebars templating since they're not user-customized - they're professional tools with fixed personalities.

### Menu Handlers

#### Workflow Handler (Most Common)

```yaml
menu:
  - trigger: create-prd
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/prd/workflow.yaml'
    description: 'Create Product Requirements Document'
```

Invokes BMAD workflow engine to execute multi-step processes.

#### Task/Exec Handler

```yaml
menu:
  - trigger: validate
    exec: '{project-root}/{bmad_folder}/core/tasks/validate-workflow.xml'
    description: 'Validate document structure'
```

Executes single-operation tasks.

#### Template Handler

```yaml
menu:
  - trigger: create-brief
    exec: '{project-root}/{bmad_folder}/core/tasks/create-doc.xml'
    tmpl: '{project-root}/{bmad_folder}/bmm/templates/brief.md'
    description: 'Create project brief from template'
```

Combines task execution with template file.

#### Data Handler

```yaml
menu:
  - trigger: team-standup
    exec: '{project-root}/{bmad_folder}/bmm/tasks/standup.xml'
    data: '{project-root}/{bmad_folder}/_cfg/agent-manifest.csv'
    description: 'Run team standup with agent roster'
```

Provides data file to task.

#### Placeholder Handler

```yaml
menu:
  - trigger: future-feature
    workflow: 'todo'
    description: 'Feature planned but not yet implemented'
```

Marks unimplemented features - compiler handles gracefully.

### Platform-Specific Menu Items

Control visibility based on platform:

```yaml
menu:
  - trigger: advanced-elicitation
    exec: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
    description: 'Advanced elicitation techniques'
    web-only: true # Only shows in web bundle

  - trigger: git-operations
    exec: '{project-root}/{bmad_folder}/bmm/tasks/git-flow.xml'
    description: 'Git workflow operations'
    ide-only: true # Only shows in IDE environments
```

## Variable System

### Core Variables

- `{project-root}` - Root directory of installed project
- `{bmad_folder}` - BMAD installation folder (usually `.bmad`)
- `{user_name}` - User's name from module config
- `{communication_language}` - Language preference
- `{output_folder}` - Document output directory

### Path Construction

**Always use variables, never hardcoded paths:**

```yaml
# GOOD
workflow: "{project-root}/{bmad_folder}/bmm/workflows/prd/workflow.yaml"

# BAD
workflow: "/Users/john/project/.bmad/bmm/workflows/prd/workflow.yaml"

# BAD
workflow: "../../../bmm/workflows/prd/workflow.yaml"
```

## What Gets Injected at Compile Time

Module agents use the same injection process as simple agents:

1. **Frontmatter** with name and description
2. **Activation block** with standard steps
3. **Menu handlers** based on usage (workflow, exec, tmpl, data)
4. **Rules section** for consistent behavior
5. **Auto-injected** *help and *exit commands

**Key difference:** Module agents load **module-specific config** instead of core config:

```xml
<step n="2">Load and read {project-root}/{bmad_folder}/{module}/config.yaml...</step>
```

## Reference Examples

See: `src/modules/bmm/agents/`

**analyst.agent.yaml** - Business Analyst

- Workflow orchestration for analysis phase
- Multiple workflow integrations
- Cross-module workflow access (core/workflows/party-mode)

**architect.agent.yaml** - System Architect

- Technical workflow management
- Architecture decision workflows

**pm.agent.yaml** - Product Manager

- Planning and coordination workflows
- Sprint management integration

## Module Configuration

Each module has `config.yaml` providing:

```yaml
# src/modules/{module}/config.yaml
user_name: 'User Name'
communication_language: 'English'
output_folder: '{project-root}/docs'
custom_settings: 'module-specific values'
```

Agents load this at activation for consistent behavior.

## Workflow Integration Patterns

### Sequential Workflow Execution

```yaml
menu:
  - trigger: init
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/workflow-init/workflow.yaml'
    description: 'Initialize workflow path (START HERE)'

  - trigger: status
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/workflow-status/workflow.yaml'
    description: 'Check current workflow status'

  - trigger: next-step
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/next-step/workflow.yaml'
    description: 'Execute next workflow in sequence'
```

### Phase-Based Organization

```yaml
menu:
  # Phase 1: Analysis
  - trigger: brainstorm
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/1-analysis/brainstorm/workflow.yaml'
    description: 'Guided brainstorming session'

  - trigger: research
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/1-analysis/research/workflow.yaml'
    description: 'Market and technical research'

  # Phase 2: Planning
  - trigger: prd
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/2-planning/prd/workflow.yaml'
    description: 'Create PRD'

  - trigger: architecture
    workflow: '{project-root}/{bmad_folder}/bmm/workflows/2-planning/architecture/workflow.yaml'
    description: 'Design architecture'
```

### Cross-Module Access

```yaml
menu:
  - trigger: party-mode
    workflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.yaml'
    description: 'Bring all agents together'

  - trigger: brainstorm
    workflow: '{project-root}/{bmad_folder}/cis/workflows/brainstorming/workflow.yaml'
    description: 'Use CIS brainstorming techniques'
```

## Best Practices

1. **Use {bmad_folder} paths** - Portable across installations
2. **Organize workflows by phase** - Clear progression for users
3. **Include workflow-status** - Help users track progress
4. **Reference module config** - Consistent behavior
5. **No Handlebars templating** - Module agents are fixed personalities
6. **Professional personas** - Match module purpose
7. **Clear trigger names** - Self-documenting commands
8. **Group related workflows** - Logical menu organization

## Common Patterns

### Entry Point Agent

```yaml
menu:
  - trigger: start
    workflow: '{project-root}/{bmad_folder}/{module}/workflows/init/workflow.yaml'
    description: 'Start new project (BEGIN HERE)'
```

### Status Tracking

```yaml
menu:
  - trigger: status
    workflow: '{project-root}/{bmad_folder}/{module}/workflows/status/workflow.yaml'
    description: 'Check workflow progress'
```

### Team Coordination

```yaml
menu:
  - trigger: party
    workflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.yaml'
    description: 'Multi-agent discussion'
```

## Module Agent vs Simple/Expert

| Aspect        | Module Agent                     | Simple/Expert Agent             |
| ------------- | -------------------------------- | ------------------------------- |
| Location      | `{bmad_folder}/{module}/agents/` | `{bmad_folder}/custom/agents/`  |
| Persona       | Fixed, professional              | Customizable via install_config |
| Handlebars    | No templating                    | Yes, extensive                  |
| Menu actions  | Workflows, tasks, templates      | Prompts, inline actions         |
| Configuration | Module config.yaml               | Core config or none             |
| Purpose       | Professional tooling             | Personal utilities              |

## Validation Checklist

- [ ] Valid YAML syntax
- [ ] Metadata includes `module: "{module-code}"`
- [ ] id uses `{bmad_folder}/{module}/agents/{name}.md`
- [ ] All workflow paths use `{project-root}/{bmad_folder}/` prefix
- [ ] No hardcoded paths
- [ ] No duplicate triggers
- [ ] Each menu item has description
- [ ] Triggers don't start with `*` (auto-added)
- [ ] Professional persona appropriate for module
- [ ] Workflow paths resolve to actual workflows (or "todo")
- [ ] File named `{agent-name}.agent.yaml`
- [ ] Located in `src/modules/{module}/agents/`
