# BMAD Module Structure Guide

## What is a Module?

A BMAD module is a self-contained package of agents, workflows, tasks, and resources that work together to provide specialized functionality. Think of it as an expansion pack for the BMAD Method.

## Module Architecture

### Core Structure

```
# SOURCE MODULE (in BMAD-METHOD project)
src/modules/{module-code}/
├── agents/                        # Agent definitions (.agent.yaml)
├── workflows/                     # Workflow folders
├── tasks/                         # Task files
├── tools/                         # Tool files
├── templates/                     # Shared templates
├── data/                          # Static data
├── _module-installer/             # Installation configuration
│   ├── install-config.yaml  # Installation questions & config
│   ├── installer.js              # Optional custom install logic
│   └── assets/                   # Files to copy during install
└── README.md                      # Module documentation

# INSTALLED MODULE (in target project)
{project-root}/.bmad/{module-code}/
├── agents/                        # Compiled agent files (.md)
├── workflows/                     # Workflow instances
├── tasks/                         # Task files
├── tools/                         # Tool files
├── templates/                     # Templates
├── data/                          # Module data
├── config.yaml                    # Generated from install-config.yaml
└── README.md                      # Module documentation
```

## Module Types by Complexity

### Simple Module (1-2 agents, 2-3 workflows)

Perfect for focused, single-purpose tools.

**Example: Code Review Module**

- 1 Reviewer Agent
- 2 Workflows: quick-review, deep-review
- Clear, narrow scope

### Standard Module (3-5 agents, 5-10 workflows)

Comprehensive solution for a domain.

**Example: Project Management Module**

- PM Agent, Scrum Master Agent, Analyst Agent
- Workflows: sprint-planning, retrospective, roadmap, user-stories
- Integrated component ecosystem

### Complex Module (5+ agents, 10+ workflows)

Full platform or framework.

**Example: RPG Toolkit Module**

- DM Agent, NPC Agent, Monster Agent, Loot Agent, Map Agent
- 15+ workflows for every aspect of game management
- Multiple interconnected systems

## Module Naming Conventions

### Module Code (kebab-case)

- `data-viz` - Data Visualization
- `team-collab` - Team Collaboration
- `rpg-toolkit` - RPG Toolkit
- `legal-assist` - Legal Assistant

### Module Name (Title Case)

- "Data Visualization Suite"
- "Team Collaboration Platform"
- "RPG Game Master Toolkit"
- "Legal Document Assistant"

## Component Guidelines

### Agents per Module

**Recommended Distribution:**

- **Primary Agent (1)**: The main interface/orchestrator
- **Specialist Agents (2-4)**: Domain-specific experts
- **Utility Agents (0-2)**: Helper/support functions

**Anti-patterns to Avoid:**

- Too many overlapping agents
- Agents that could be combined
- Agents without clear purpose

### Workflows per Module

**Categories:**

- **Core Workflows (2-3)**: Essential functionality
- **Feature Workflows (3-5)**: Specific capabilities
- **Utility Workflows (2-3)**: Supporting operations
- **Admin Workflows (0-2)**: Maintenance/config

**Workflow Complexity Guide:**

- Simple: 3-5 steps, single output
- Standard: 5-10 steps, multiple outputs
- Complex: 10+ steps, conditional logic, sub-workflows

### Tasks per Module

Tasks should be used for:

- Single-operation utilities
- Shared subroutines
- Quick actions that don't warrant workflows

## Module Dependencies

### Internal Dependencies

- Agents can reference module workflows
- Workflows can invoke module tasks
- Tasks can use module templates

### External Dependencies

- Reference other modules via full paths
- Declare dependencies in config.yaml
- Version compatibility notes

### Workflow Vendoring (Advanced)

For modules that need workflows from other modules but want to remain standalone, use **workflow vendoring**:

**In Agent YAML:**

```yaml
menu:
  - trigger: command-name
    workflow: '{project-root}/.bmad/SOURCE_MODULE/workflows/path/workflow.yaml'
    workflow-install: '{project-root}/.bmad/THIS_MODULE/workflows/vendored/workflow.yaml'
    description: 'Command description'
```

**What Happens:**

- During installation, workflows are copied from `workflow` to `workflow-install` location
- Vendored workflows get `config_source` updated to reference this module's config
- Compiled agent only references the `workflow-install` path
- Module becomes fully standalone - no source module dependency required

**Use Cases:**

- Specialized modules that reuse common workflows with different configs
- Domain-specific adaptations (e.g., game dev using standard dev workflows)
- Testing workflows in isolation

**Benefits:**

- Module independence (no forced dependencies)
- Clean namespace (workflows in your module)
- Config isolation (use your module's settings)
- Customization ready (modify vendored workflows freely)

## Installation Infrastructure

### Required: module-installer/install-config.yaml

This file defines both installation questions AND static configuration values:

```yaml
# Module metadata
code: module-code
name: 'Module Name'
default_selected: false

# Welcome message during installation
prompt:
  - 'Welcome to Module Name!'
  - 'Brief description here'

# Core values automatically inherited from installer:
## user_name
## communication_language
## document_output_language
## output_folder

# INTERACTIVE fields (ask user during install)
output_location:
  prompt: 'Where should module outputs be saved?'
  default: 'output/module-code'
  result: '{project-root}/{value}'

feature_level:
  prompt: 'Which feature set?'
  default: 'standard'
  result: '{value}'
  single-select:
    - value: 'basic'
      label: 'Basic - Core features only'
    - value: 'standard'
      label: 'Standard - Recommended features'
    - value: 'advanced'
      label: 'Advanced - All features'

# STATIC fields (no prompt, just hardcoded values)
module_version:
  result: '1.0.0'

data_path:
  result: '{project-root}/.bmad/module-code/data'
```

**Key Points:**

- File is named `install-config.yaml` (NOT install-config.yaml)
- Supports both interactive prompts and static values
- `result` field uses placeholders: `{value}`, `{project-root}`, `{directory_name}`
- Installer generates final `config.yaml` from this template

### Optional: module-installer/installer.js

For complex installations requiring custom logic:

```javascript
/**
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - Target project directory
 * @param {Object} options.config - Config from install-config.yaml
 * @param {Array} options.installedIDEs - IDEs being configured
 * @param {Object} options.logger - Logger (log, warn, error)
 * @returns {boolean} - true if successful
 */
async function install(options) {
  // Custom installation logic here
  // - Database setup
  // - API configuration
  // - External downloads
  // - Integration setup

  return true;
}

module.exports = { install };
```

### Optional: module-installer/assets/

Files to copy during installation:

- External configurations
- Documentation
- Example files
- Integration scripts

## Module Lifecycle

### Development Phases

1. **Planning Phase**
   - Define scope and purpose
   - Identify components
   - Design architecture

2. **Scaffolding Phase**
   - Create directory structure
   - Generate configurations
   - Setup installer

3. **Building Phase**
   - Create agents incrementally
   - Build workflows progressively
   - Add tasks as needed

4. **Testing Phase**
   - Test individual components
   - Verify integration
   - Validate installation

5. **Deployment Phase**
   - Package module
   - Document usage
   - Distribute/share

## Best Practices

### Module Cohesion

- All components should relate to module theme
- Clear boundaries between modules
- No feature creep

### Progressive Enhancement

- Start with MVP (1 agent, 2 workflows)
- Add components based on usage
- Refactor as patterns emerge

### Documentation Standards

- Every module needs README.md
- Each agent needs purpose statement
- Workflows need clear descriptions
- Include examples and quickstart

### Naming Consistency

- Use module code prefix for uniqueness
- Consistent naming patterns within module
- Clear, descriptive names

## Example Modules

### Example 1: Personal Productivity

```
productivity/
├── agents/
│   ├── task-manager.md      # GTD methodology
│   └── focus-coach.md        # Pomodoro timer
├── workflows/
│   ├── daily-planning/       # Morning routine
│   ├── weekly-review/        # Week retrospective
│   └── project-setup/        # New project init
└── config.yaml
```

### Example 2: Content Creation

```
content/
├── agents/
│   ├── writer.md            # Blog/article writer
│   ├── editor.md            # Copy editor
│   └── seo-optimizer.md     # SEO specialist
├── workflows/
│   ├── blog-post/           # Full blog creation
│   ├── social-media/        # Social content
│   ├── email-campaign/      # Email sequence
│   └── content-calendar/    # Planning
└── templates/
    ├── blog-template.md
    └── email-template.md
```

### Example 3: DevOps Automation

```
devops/
├── agents/
│   ├── deploy-master.md     # Deployment orchestrator
│   ├── monitor.md           # System monitoring
│   ├── incident-responder.md # Incident management
│   └── infra-architect.md   # Infrastructure design
├── workflows/
│   ├── ci-cd-setup/         # Pipeline creation
│   ├── deploy-app/          # Application deployment
│   ├── rollback/            # Emergency rollback
│   ├── health-check/        # System verification
│   └── incident-response/   # Incident handling
├── tasks/
│   ├── check-status.md      # Quick status check
│   └── notify-team.md       # Team notifications
└── data/
    └── runbooks/            # Operational guides
```

## Module Evolution Pattern

```
Simple Module → Standard Module → Complex Module → Module Suite
     (MVP)          (Enhanced)        (Complete)      (Ecosystem)
```

## Common Pitfalls

1. **Over-engineering**: Starting too complex
2. **Under-planning**: No clear architecture
3. **Poor boundaries**: Module does too much
4. **Weak integration**: Components don't work together
5. **Missing docs**: No clear usage guide

## Success Metrics

A well-designed module has:

- ✅ Clear, focused purpose
- ✅ Cohesive components
- ✅ Smooth installation
- ✅ Comprehensive docs
- ✅ Room for growth
- ✅ Happy users!
