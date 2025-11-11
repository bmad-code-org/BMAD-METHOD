# Create Agent Workflow

Interactive agent builder creating BMad Core compliant agents as YAML source files that compile to .md during installation.

## Table of Contents

- [Quick Start](#quick-start)
- [Agent Types](#agent-types)
- [Workflow Phases](#workflow-phases)
- [Output Structure](#output-structure)
- [Installation](#installation)
- [Examples](#examples)

## Quick Start

```bash
# Direct workflow
workflow create-agent

# Via BMad Builder
*create-agent
```

## Agent Types

### Simple Agent

- Self-contained functionality
- Basic command structure
- No external resources

### Expert Agent

- Sidecar resources for domain knowledge
- Extended capabilities
- Knowledge base integration

### Module Agent

- Full-featured with workflows
- Module-specific commands
- Integrated with module structure

## Workflow Phases

### Phase 0: Optional Brainstorming

- Creative ideation session
- Explore concepts and personalities
- Generate command ideas
- Output feeds into persona development

### Phase 1: Agent Setup

1. Choose agent type (Simple/Expert/Module)
2. Define identity (name, title, icon, filename)
3. Assign to module (if Module agent)

### Phase 2: Persona Development

- Define role and responsibilities
- Craft unique identity/backstory
- Select communication style
- Establish guiding principles
- Add critical actions (optional)

### Phase 3: Command Building

- Add required commands (*help, *exit)
- Define workflow commands
- Add task commands
- Create action commands
- Configure attributes

### Phase 4: Finalization

- Generate .agent.yaml file
- Create customize file (optional)
- Setup sidecar resources (Expert agents)
- Validate and compile
- Provide usage instructions

## Output Structure

### Generated Files

**Standalone Agents:**

- Source: `.bmad/agents/{filename}.agent.yaml`
- Compiled: `.bmad/agents/{filename}.md`

**Module Agents:**

- Source: `src/modules/{module}/agents/{filename}.agent.yaml`
- Compiled: `.bmad/{module}/agents/{filename}.md`

### YAML Structure

```yaml
agent:
  metadata:
    id: .bmad/{module}/agents/{filename}.md
    name: Agent Name
    title: Agent Title
    icon: 🤖
    module: module-name
  persona:
    role: '...'
    identity: '...'
    communication_style: '...'
    principles: ['...', '...']
  menu:
    - trigger: command-name
      workflow: path/to/workflow.yaml
      description: Command description
```

### Optional Customize File

Location: `.bmad/_cfg/agents/{module}-{filename}.customize.yaml`

Allows persona and menu overrides that persist through updates.

## Installation

### Compilation Methods

**Quick Rebuild:**

```bash
bmad compile-agents
```

**During Module Install:**
Automatic compilation when installing modules

**Manual Compilation:**

```bash
node tools/cli/bmad-cli.js compile-agents
```

## Examples

### Creating a Code Review Agent

```
User: I need a code review agent
Builder: Let's brainstorm first...

[Brainstorming generates ideas for strict vs friendly reviewer]

Builder: Now let's build your agent:
- Type: Simple
- Name: Code Reviewer
- Role: Senior developer conducting thorough reviews
- Style: Professional but approachable
- Commands:
  - *review-pr: Review pull request
  - *review-file: Review single file
  - *review-standards: Check coding standards
```

### Creating a Domain Expert

```
Type: Expert
Name: Legal Advisor
Sidecar: legal-knowledge/
Commands:
  - *contract-review
  - *compliance-check
  - *risk-assessment
```

## Workflow Files

```
create-agent/
├── workflow.yaml              # Configuration
├── instructions.md            # Step guide
├── checklist.md              # Validation
├── README.md                 # This file
├── agent-types.md            # Type details
├── agent-architecture.md     # Patterns
├── agent-command-patterns.md # Commands
└── communication-styles.md   # Styles
```

## Best Practices

1. **Use brainstorming** for complex agents
2. **Start simple** - Add commands incrementally
3. **Test commands** before finalizing
4. **Document thoroughly** in descriptions
5. **Follow naming conventions** consistently

## Related Documentation

- [Agent Types](./agent-types.md)
- [Command Patterns](./agent-command-patterns.md)
- [Communication Styles](./communication-styles.md)
- [BMB Module](../../README.md)
