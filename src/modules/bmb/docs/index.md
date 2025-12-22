# BMB - BMad Builder Module

Specialized tools and workflows for creating, customizing, and extending BMad components including agents, workflows, and complete modules.

## Table of Contents

- [Module Structure](#module-structure)
- [Documentation](#documentation)
- [Reference Materials](#reference-materials)
- [Core Workflows](#core-workflows)
- [Agent Types](#agent-types)
- [Quick Start](#quick-start)
- [Best Practices](#best-practices)

## Module Structure

### 🤖 Agents

**BMad Builder** - Master builder agent orchestrating all creation workflows with deep knowledge of BMad architecture and conventions.

- Install Location: `_bmad/bmb/agents/bmad-builder.md`

### 📋 Workflows

### 📚 Documentation

- Comprehensive guides for agents, workflows, and modules
- Architecture patterns and best practices

### 🔍 Reference Materials

- Location: `../reference/`
- Working examples of custom stand alone agents and workflows
- Template patterns and implementation guides

## Documentation

### 📖 Agent Documentation

- **[Agent Index](./agents/index.md)** - Complete agent architecture guide
- **[Agent Types Guide](./agents/understanding-agent-types.md)** - Simple vs Expert vs Module agents
- **[Menu Patterns](./agents/agent-menu-patterns.md)** - YAML menu design and handler types
- **[Agent Compilation](./agents/agent-compilation.md)** - Auto-injection rules and compilation process

### 📋 Workflow Documentation

- **[Workflow Index](./workflows/index.md)** - Core workflow system overview
- **[Architecture Guide](./workflows/architecture.md)** - Step-file design and JIT loading
- **[Template System](./workflows/templates/step-template.md)** - Standard step file template
- **[Intent vs Prescriptive](./workflows/intent-vs-prescriptive-spectrum.md)** - Design philosophy

## Reference Materials

### 🤖 Agent Examples

- **[Simple Agent Example](../reference/agents/simple-examples/commit-poet.agent.yaml)** - Self-contained agent
- **[Expert Agent Example](../reference/agents/expert-examples/journal-keeper/journal-keeper.agent.yaml)** - Agent with persistent memory
- **[Module Add On Agent Examples](../reference/agents/module-examples/security-engineer.agent.yaml)** - Integration patterns (BMM, CIS)

### 📋 Workflow Examples

- **[Meal Prep & Nutrition](./reference/workflows/meal-prep-nutrition/)** - Complete step-file workflow demonstration
- **Template patterns** for document generation and state management

## Core Workflows

### Creation Workflows (Step-File Architecture)

**[create-agent](./workflows/create-agent/)** - Build BMad agents

- 11 guided steps from brainstorming to celebration
- 18 reference data files with validation checklists
- Template-based agent generation

**[create-workflow](./workflows/create-workflow/)** - Design workflows

- 12 structured steps from init to review
- 9 template files for workflow creation
- Step-file architecture implementation

### Editing Workflows

**[edit-agent](./workflows/edit-agent/)** - Modify existing agents

- 5 steps: discovery → validation
- Intent-driven analysis and updates
- Best practice compliance

**[edit-workflow](./workflows/edit-workflow/)** - Update workflows

- 5 steps: analyze → compliance check
- Structure maintenance and validation
- Template updates for consistency

### Quality Assurance

**[workflow-compliance-check](./workflows/workflow-compliance-check/)** - Validation

- 8 systematic validation steps
- Adversarial analysis approach
- Detailed compliance reporting

### Legacy Migration (Pending)

Workflows in `workflows-legacy/` are being migrated to step-file architecture:

- Module-specific workflows
- Historical implementations
- Conversion planning in progress

## Agent Types

BMB creates three agent architectures:

### Simple Agent

- **Self-contained**: All logic in single YAML file
- **Stateless**: No persistent memory across sessions
- **Purpose**: Single utilities and specialized tools
- **Example**: Commit poet, code formatter

### Expert Agent

- **Persistent Memory**: Maintains knowledge across sessions
- **Sidecar Resources**: External files and data storage
- **Domain-specific**: Focuses on particular knowledge areas
- **Example**: Journal keeper, domain consultant

### Module Agent

- **Team Integration**: Orchestrates within specific modules
- **Workflow Coordination**: Manages complex processes
- **Professional Infrastructure**: Enterprise-grade capabilities
- **Examples**: BMM project manager, CIS innovation strategist

## Quick Start

### Using BMad Builder Agent

1. **Load BMad Builder agent** in your IDE:
   ```
   /bmad:bmb:agents:bmad-builder
   ```
2. **Choose creation type:**
   - `[CA]` Create Agent - Build new agents
   - `[CW]` Create Workflow - Design workflows
   - `[EA]` Edit Agent - Modify existing agents
   - `[EW]` Edit Workflow - Update workflows
   - `[VA]` Validate Agent - Quality check agents
   - `[VW]` Validate Workflow - Quality check workflows

3. **Follow interactive prompts** for step-by-step guidance

### Example: Creating an Agent

```
User: I need a code review agent
Builder: [CA] Create Agent

[11-step guided process]
Step 1: Brainstorm agent concept
Step 2: Define persona and role
Step 3: Design command structure
...
Step 11: Celebrate and deploy
```

### Direct Workflow Execution

Workflows can also be run directly without the agent interface:

```yaml
# Execute specific workflow steps
workflow: ./workflows/create-agent/workflow.yaml
```

## Use Cases

### Custom Development Teams

Build specialized agents for:

- Domain expertise (legal, medical, finance)
- Company processes
- Tool integrations
- Automation tasks

### Workflow Extensions

Create workflows for:

- Compliance requirements
- Quality gates
- Deployment pipelines
- Custom methodologies

### Complete Solutions

Package modules for:

- Industry verticals
- Technology stacks
- Business processes
- Educational frameworks

## Architecture Principles

### Step-File Workflow Design

- **Micro-file Approach**: Each step is self-contained
- **Just-In-Time Loading**: Only current step in memory
- **Sequential Enforcement**: No skipping steps allowed
- **State Tracking**: Progress documented in frontmatter
- **Append-Only Building**: Documents grow through execution

### Intent vs Prescriptive Spectrum

- **Creative Workflows**: High user agency, AI as facilitator
- **Structured Workflows**: Clear process, AI as guide
- **Prescriptive Workflows**: Strict compliance, AI as validator

## Best Practices

1. **Study Reference Materials** - Review docs/ and reference/ examples
2. **Choose Right Agent Type** - Simple vs Expert vs Module based on needs
3. **Follow Step-File Patterns** - Use established templates and structures
4. **Document Thoroughly** - Clear instructions and frontmatter metadata
5. **Validate Continuously** - Use compliance workflows for quality
6. **Maintain Consistency** - Follow YAML patterns and naming conventions

## Integration

BMB components integrate with:

- **BMad Core** - Framework foundation and agent compilation
- **BMM** - Development workflows and project management
- **CIS** - Creative innovation and strategic workflows
- **Custom Modules** - Domain-specific solutions

## Getting Help

- **Documentation**: Check `docs/` for comprehensive guides
- **Reference Materials**: See `reference/` for working examples
- **Validation**: Use `workflow-compliance-check` for quality assurance
- **Templates**: Leverage workflow templates for consistent patterns

---

BMB provides a complete toolkit for extending BMad Method with disciplined, systematic approaches to agent and workflow development while maintaining framework consistency and power.
