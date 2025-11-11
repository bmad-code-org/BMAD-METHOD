# Create Module Workflow

Interactive scaffolding system creating complete BMad modules with agents, workflows, tasks, and installation infrastructure.

## Table of Contents

- [Quick Start](#quick-start)
- [Workflow Phases](#workflow-phases)
- [Output Structure](#output-structure)
- [Module Components](#module-components)
- [Best Practices](#best-practices)

## Quick Start

```bash
# Basic invocation
workflow create-module

# With module brief input
workflow create-module --input module-brief-{name}-{date}.md

# Via BMad Builder
*create-module
```

## Workflow Phases

### Phase 1: Concept Definition

- Define module purpose and audience
- Establish module code (kebab-case) and name
- Choose category (Domain, Creative, Technical, Business, Personal)
- Plan component architecture

**Module Brief Integration:**

- Auto-detects existing briefs
- Uses as pre-populated blueprint
- Accelerates planning phase

### Phase 2: Architecture Planning

- Create directory hierarchy
- Setup configuration system
- Define installer structure
- Establish component folders

### Phase 3: Component Creation

- Optional first agent creation
- Optional first workflow creation
- Component placeholder generation
- Integration validation

### Phase 4: Installation Setup

- Create install-config.yaml
- Configure deployment questions
- Setup installer logic
- Post-install messaging

### Phase 5: Documentation

- Generate comprehensive README
- Create development roadmap
- Provide quick commands
- Document next steps

## Output Structure

### Generated Directory

```
.bmad/{module-code}/
├── agents/              # Agent definitions
├── workflows/           # Workflow processes
├── tasks/              # Reusable tasks
├── templates/          # Document templates
├── data/               # Module data files
├── _module-installer/  # Installation logic
│   ├── install-config.yaml
│   └── installer.js
├── README.md           # Module documentation
├── TODO.md            # Development roadmap
└── config.yaml        # Runtime configuration
```

### Configuration Files

**install-config.yaml** - Installation questions

```yaml
questions:
  - id: user_name
    prompt: 'Your name?'
    default: 'User'
  - id: output_folder
    prompt: 'Output location?'
    default: './output'
```

**config.yaml** - Generated from user answers during install

```yaml
user_name: 'John Doe'
output_folder: './my-output'
```

## Module Components

### Agents

- Full module agents with workflows
- Expert agents with sidecars
- Simple utility agents

### Workflows

- Multi-step guided processes
- Configuration-driven
- Web bundle support

### Tasks

- Reusable operations
- Agent-agnostic
- Modular components

### Templates

- Document structures
- Output formats
- Report templates

## Best Practices

### Planning

1. **Use module-brief workflow first** - Creates comprehensive blueprint
2. **Define clear scope** - Avoid feature creep
3. **Plan component interactions** - Map agent/workflow relationships

### Structure

1. **Follow conventions** - Use established patterns
2. **Keep components focused** - Single responsibility
3. **Document thoroughly** - Clear README and inline docs

### Development

1. **Start with core agent** - Build primary functionality first
2. **Create key workflows** - Essential processes before edge cases
3. **Test incrementally** - Validate as you build

### Installation

1. **Minimal config questions** - Only essential settings
2. **Smart defaults** - Sensible out-of-box experience
3. **Clear post-install** - Guide users to first steps

## Integration Points

### With Other Workflows

- **module-brief** - Strategic planning input
- **create-agent** - Agent component creation
- **create-workflow** - Workflow building
- **redoc** - Documentation maintenance

### With BMad Core

- Uses core framework capabilities
- Integrates with module system
- Follows BMad conventions

## Examples

### Domain-Specific Module

```
Category: Domain-Specific
Code: legal-advisor
Components:
- Contract Review Agent
- Compliance Workflow
- Legal Templates
```

### Creative Module

```
Category: Creative
Code: story-builder
Components:
- Narrative Agent
- Plot Workflow
- Character Templates
```

### Technical Module

```
Category: Technical
Code: api-tester
Components:
- Test Runner Agent
- API Validation Workflow
- Test Report Templates
```

## Workflow Files

```
create-module/
├── workflow.yaml          # Configuration
├── instructions.md        # Step guide
├── checklist.md          # Validation
├── module-structure.md   # Architecture
├── installer-templates/  # Install files
└── README.md            # This file
```

## Related Documentation

- [Module Structure](./module-structure.md)
- [Module Brief Workflow](../module-brief/README.md)
- [Create Agent](../create-agent/README.md)
- [Create Workflow](../create-workflow/README.md)
- [BMB Module](../../README.md)
