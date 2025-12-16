# BMAD Agent Menu Patterns

Design patterns for agent menus in YAML source files.

## Menu Structure

Agents define menus in YAML, with triggers auto-prefixed with `*` during compilation:

```yaml
menu:
  - trigger: action-name
    [handler]: [value]
    description: 'What this command does'
```

**Note:** `*help` and `*exit` are auto-injected by the compiler - DO NOT include them.

## Handler Types

### 1. Action Handler (Prompts & Inline)

For simple and expert agents with self-contained logic.

**Reference to Prompt ID:**

```yaml
prompts:
  - id: analyze-code
    content: |
      <instructions>
      Analyze the provided code for patterns and issues.
      </instructions>

      <process>
      1. Identify code structure
      2. Check for anti-patterns
      3. Suggest improvements
      </process>

menu:
  - trigger: analyze
    action: '#analyze-code'
    description: 'Analyze code patterns'
```

**Inline Instruction:**

```yaml
menu:
  - trigger: quick-check
    action: 'Perform a quick syntax validation on the current file'
    description: 'Quick syntax check'
```

**When to Use:**

- Simple/Expert agents with self-contained operations
- `#id` for complex, multi-step prompts
- Inline text for simple, one-line instructions

### 2. Workflow Handler

For module agents orchestrating multi-step processes.

```yaml
menu:
  - trigger: create-prd
    workflow: '{project-root}/_bmad/bmm/workflows/prd/workflow.yaml'
    description: 'Create Product Requirements Document'

  - trigger: brainstorm
    workflow: '{project-root}/_bmad/core/workflows/brainstorming/workflow.yaml'
    description: 'Guided brainstorming session'

  # Placeholder for unimplemented workflows
  - trigger: future-feature
    workflow: 'todo'
    description: 'Coming soon'
```

**When to Use:**

- Module agents with workflow integration
- Multi-step document generation
- Complex interactive processes
- Use "todo" for planned but unimplemented features

### 3. Exec Handler

For executing tasks directly.

```yaml
menu:
  - trigger: validate
    exec: '{project-root}/_bmad/core/tasks/validate-workflow.xml'
    description: 'Validate document structure'

  - trigger: advanced-elicitation
    exec: '{project-root}/_bmad/core/tasks/advanced-elicitation.xml'
    description: 'Advanced elicitation techniques'
```

**When to Use:**

- Single-operation tasks
- Core system operations
- Utility functions

### 4. Template Handler

For document generation with templates.

```yaml
menu:
  - trigger: create-brief
    exec: '{project-root}/_bmad/core/tasks/create-doc.xml'
    tmpl: '{project-root}/_bmad/bmm/templates/brief.md'
    description: 'Create a Product Brief'
```

**When to Use:**

- Template-based document creation
- Combine `exec` with `tmpl` path
- Structured output generation

### 5. Data Handler

Universal attribute for supplementary information.

```yaml
menu:
  - trigger: team-standup
    exec: '{project-root}/_bmad/bmm/tasks/standup.xml'
    data: '{project-root}/_bmad/_config/agent-manifest.csv'
    description: 'Run team standup'

  - trigger: analyze-metrics
    action: 'Analyze these metrics and identify trends'
    data: '{project-root}/_data/metrics.json'
    description: 'Analyze performance metrics'
```

**When to Use:**

- Add to ANY handler type
- Reference data files (CSV, JSON, YAML)
- Provide context for operations

## Platform-Specific Menus

Control visibility based on deployment target:

```yaml
menu:
  - trigger: git-flow
    exec: '{project-root}/_bmad/bmm/tasks/git-flow.xml'
    description: 'Git workflow operations'
    ide-only: true # Only in IDE environments

  - trigger: advanced-elicitation
    exec: '{project-root}/_bmad/core/tasks/advanced-elicitation.xml'
    description: 'Advanced elicitation'
    web-only: true # Only in web bundles
```

## Trigger Naming Conventions

### Action-Based (Recommended)

```yaml
# Creation
- trigger: create-prd
- trigger: build-module
- trigger: generate-report

# Analysis
- trigger: analyze-requirements
- trigger: review-code
- trigger: validate-architecture

# Operations
- trigger: update-status
- trigger: sync-data
- trigger: deploy-changes
```

### Domain-Based

```yaml
# Development
- trigger: brainstorm
- trigger: architect
- trigger: refactor

# Project Management
- trigger: sprint-plan
- trigger: retrospective
- trigger: standup
```

### Bad Patterns

```yaml
# TOO VAGUE
- trigger: do
- trigger: run
- trigger: process

# TOO LONG
- trigger: create-comprehensive-product-requirements-document

# NO VERB
- trigger: prd
- trigger: config
```

## Menu Organization

### Recommended Order

```yaml
menu:
  # Note: *help auto-injected first by compiler

  # 1. Primary workflows (main value)
  - trigger: workflow-init
    workflow: '...'
    description: 'Start here - initialize workflow'

  - trigger: create-prd
    workflow: '...'
    description: 'Create PRD'

  # 2. Secondary operations
  - trigger: validate
    exec: '...'
    description: 'Validate document'

  # 3. Utilities
  - trigger: party-mode
    workflow: '...'
    description: 'Multi-agent discussion'

  # Note: *exit auto-injected last by compiler
```

### Grouping by Phase

```yaml
menu:
  # Analysis Phase
  - trigger: brainstorm
    workflow: '{project-root}/_bmad/bmm/workflows/1-analysis/brainstorm/workflow.yaml'
    description: 'Brainstorm ideas'

  - trigger: research
    workflow: '{project-root}/_bmad/bmm/workflows/1-analysis/research/workflow.yaml'
    description: 'Conduct research'

  # Planning Phase
  - trigger: prd
    workflow: '{project-root}/_bmad/bmm/workflows/2-planning/prd/workflow.yaml'
    description: 'Create PRD'

  - trigger: architecture
    workflow: '{project-root}/_bmad/bmm/workflows/2-planning/architecture/workflow.yaml'
    description: 'Design architecture'
```

## Description Best Practices

### Good Descriptions

```yaml
# Clear action + object
- description: 'Create Product Requirements Document'

# Specific outcome
- description: 'Analyze security vulnerabilities'

# User benefit
- description: 'Optimize code for performance'

# Context when needed
- description: 'Start here - initialize workflow path'
```

### Poor Descriptions

```yaml
# Too vague
- description: 'Process'

# Technical jargon
- description: 'Execute WF123'

# Missing context
- description: 'Run'

# Redundant with trigger
- description: 'Create PRD' # trigger: create-prd (too similar)
```

## Prompts Section (Simple/Expert Agents)

### Prompt Structure

```yaml
prompts:
  - id: unique-identifier
    content: |
      <instructions>
      What this prompt accomplishes
      </instructions>

      <process>
      1. First step
      {{#if custom_option}}
      2. Conditional step
      {{/if}}
      3. Final step
      </process>

      <output_format>
      Expected structure of results
      </output_format>
```

### Semantic XML Tags in Prompts

Use XML tags to structure prompt content:

- `<instructions>` - What to do
- `<process>` - Step-by-step approach
- `<output_format>` - Expected results
- `<examples>` - Sample outputs
- `<constraints>` - Limitations
- `<context>` - Background information

### Handlebars in Prompts

Customize based on install_config:

```yaml
prompts:
  - id: analyze
    content: |
      {{#if detailed_mode}}
      Perform comprehensive analysis with full explanations.
      {{/if}}
      {{#unless detailed_mode}}
      Quick analysis focusing on key points.
      {{/unless}}

      Address {{user_name}} in {{communication_style}} tone.
```

## Path Variables

### Always Use Variables

```yaml
# GOOD - Portable paths
workflow: "{project-root}/_bmad/bmm/workflows/prd/workflow.yaml"
exec: "{project-root}/_bmad/core/tasks/validate.xml"
data: "{project-root}/_data/metrics.csv"

# BAD - Hardcoded paths
workflow: "/Users/john/project/_bmad/bmm/workflows/prd/workflow.yaml"
exec: "../../../core/tasks/validate.xml"
```

### Available Variables

- `{project-root}` - Project root directory
- `_bmad` - BMAD installation folder
- `{output_folder}` - Document output location
- `{user_name}` - User's name from config
- `{communication_language}` - Language preference

## Complete Examples

### Simple Agent Menu

```yaml
prompts:
  - id: format-code
    content: |
      <instructions>
      Format the provided code according to style guidelines.
      </instructions>

      Apply:
      - Consistent indentation
      - Proper spacing
      - Clear naming conventions

menu:
  - trigger: format
    action: '#format-code'
    description: 'Format code to style guidelines'

  - trigger: lint
    action: 'Check code for common issues and anti-patterns'
    description: 'Lint code for issues'

  - trigger: suggest
    action: 'Suggest improvements for code readability'
    description: 'Suggest improvements'
```

### Expert Agent Menu

```yaml
critical_actions:
  - 'Load ./memories.md'
  - 'Follow ./instructions.md'
  - 'ONLY access ./'

prompts:
  - id: reflect
    content: |
      Guide {{user_name}} through reflection on recent entries.
      Reference patterns from memories.md naturally.

menu:
  - trigger: write
    action: '#reflect'
    description: 'Write journal entry'

  - trigger: save
    action: 'Update ./memories.md with session insights'
    description: "Save today's session"

  - trigger: patterns
    action: 'Analyze recent entries for recurring themes'
    description: 'View patterns'
```

### Module Agent Menu

```yaml
menu:
  - trigger: workflow-init
    workflow: '{project-root}/_bmad/bmm/workflows/workflow-status/init/workflow.yaml'
    description: 'Initialize workflow path (START HERE)'

  - trigger: brainstorm
    workflow: '{project-root}/_bmad/bmm/workflows/1-analysis/brainstorm/workflow.yaml'
    description: 'Guided brainstorming'

  - trigger: prd
    workflow: '{project-root}/_bmad/bmm/workflows/2-planning/prd/workflow.yaml'
    description: 'Create PRD'

  - trigger: architecture
    workflow: '{project-root}/_bmad/bmm/workflows/2-planning/architecture/workflow.yaml'
    description: 'Design architecture'

  - trigger: party-mode
    workflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.yaml'
    description: 'Multi-agent discussion'
```

## Validation Checklist

- [ ] No duplicate triggers
- [ ] Triggers don't start with `*` (auto-added)
- [ ] Every item has a description
- [ ] Paths use variables, not hardcoded
- [ ] `#id` references exist in prompts section
- [ ] Workflow paths resolve or are "todo"
- [ ] No `*help` or `*exit` (auto-injected)
- [ ] Descriptions are clear and action-oriented
- [ ] Platform-specific flags used correctly (ide-only, web-only)

## Common Mistakes

### Duplicate Triggers

```yaml
# BAD - compiler will fail
- trigger: analyze
  action: '#first'
  description: 'First analysis'

- trigger: analyze
  action: '#second'
  description: 'Second analysis'
```

### Including Auto-Injected Items

```yaml
# BAD - these are auto-injected
menu:
  - trigger: help
    description: 'Show help'

  - trigger: exit
    description: 'Exit agent'
```

### Missing Prompt Reference

```yaml
# BAD - prompt id doesn't exist
menu:
  - trigger: analyze
    action: '#nonexistent-prompt'
    description: 'Analysis'
```

### Hardcoded Paths

```yaml
# BAD - not portable
menu:
  - trigger: run
    workflow: '/absolute/path/to/workflow.yaml'
    description: 'Run workflow'
```
