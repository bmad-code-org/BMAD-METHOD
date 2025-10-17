# BMAD Module Structure Guide

## What is a Module?

A BMAD module is a self-contained package of agents, workflows, tasks, and resources that work together to provide specialized functionality. Think of it as an expansion pack for the BMAD Method.

## Module Architecture

### Core Structure

```
project-root/
├── bmad/{module-code}/     # Source code
│   ├── agents/                    # Agent definitions
│   ├── workflows/                 # Workflow folders
│   ├── tasks/                     # Task files
│   ├── templates/                 # Shared templates
│   ├── data/                      # Static data
│   ├── config.yaml                # Module config
│   └── README.md                  # Documentation
│
└── bmad/{module-code}/            # Runtime instance
    ├── _module-installer/         # Installation files
    │   ├── install-module-config.yaml
    │   ├── installer.js          # Optional
    │   └── assets/               # Install assets
    ├── config.yaml               # User config
    ├── agents/                   # Agent overrides
    ├── workflows/                # Workflow instances
    └── data/                     # User data

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

## Installation Infrastructure

### Required: install-module-config.yaml

```yaml
module_name: 'Module Name'
module_code: 'module-code'

install_steps:
  - name: 'Create directories'
    action: 'mkdir'
    paths: [...]

  - name: 'Copy files'
    action: 'copy'
    mappings: [...]

  - name: 'Register module'
    action: 'register'
```

### Optional: installer.js

For complex installations requiring:

- Database setup
- API configuration
- System integration
- Permission management

### Optional: External Assets

Files that get copied outside the module:

- System configurations
- User templates
- Shared resources
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
