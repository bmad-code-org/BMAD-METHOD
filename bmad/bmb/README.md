# BMB - BMad Builder Module

The BMB (BMad Builder Module) provides specialized tools and workflows for creating, customizing, and extending BMad Method components, including custom agents, workflows, and integrations.

## Module Structure

### 🤖 `/agents`

Builder-specific agents that help create and customize BMad Method components:

- Agent creation and configuration specialists
- Workflow designers
- Integration builders

### 📋 `/workflows`

Specialized workflows for building and extending BMad Method capabilities:

#### Core Builder Workflows

- `create-agent` - Design and implement custom agents
- `create-workflow` - Build new workflow definitions
- `create-team` - Configure agent teams
- `bundle-agent` - Package agents for distribution
- `create-method` - Design custom development methodologies

#### Integration Workflows

- `integrate-tool` - Connect external tools and services
- `create-adapter` - Build API adapters
- `setup-environment` - Configure development environments

## Key Features

### Agent Builder

Create custom agents with:

- Role-specific instructions
- Tool configurations
- Behavior patterns
- Integration points

### Workflow Designer

Design workflows that:

- Orchestrate multiple agents
- Define process flows
- Handle different project scales
- Integrate with existing systems

### Team Configuration

Build teams that:

- Combine complementary agent skills
- Coordinate on complex tasks
- Share context effectively
- Deliver cohesive results

## Quick Start

```bash
# Create a new custom agent
bmad bmb create-agent

# Design a new workflow
bmad bmb create-workflow

# Bundle an agent for sharing
bmad bmb bundle-agent

# Create a custom team configuration
bmad bmb create-team
```

## Use Cases

### Custom Agent Development

Build specialized agents for:

- Domain-specific expertise
- Company-specific processes
- Tool integrations
- Automation tasks

### Workflow Customization

Create workflows for:

- Unique development processes
- Compliance requirements
- Quality gates
- Deployment pipelines

### Team Orchestration

Configure teams for:

- Large-scale projects
- Cross-functional collaboration
- Specialized domains
- Custom methodologies

## Integration with BMM

BMB works alongside BMM to:

- Extend core BMM capabilities
- Create custom implementations
- Build domain-specific solutions
- Integrate with existing tools

## Best Practices

1. **Start with existing patterns** - Study BMM agents and workflows before creating new ones
2. **Keep it modular** - Build reusable components
3. **Document thoroughly** - Clear documentation helps others use your creations
4. **Test extensively** - Validate agents and workflows before production use
5. **Share and collaborate** - Contribute useful components back to the community

## Related Documentation

- [BMM Module](../bmm/README.md) - Core method implementation
- [Agent Creation Guide](./workflows/create-agent/README.md) - Detailed agent building instructions
- [Workflow Design Patterns](./workflows/README.md) - Best practices for workflow creation

---

BMB empowers you to extend and customize the BMad Method to fit your specific needs while maintaining the power and consistency of the core framework.
