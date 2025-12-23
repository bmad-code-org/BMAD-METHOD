# BMB Module Documentation

Reference documentation for building BMAD agents and workflows.

## Agent Architecture

Comprehensive guides for each agent type (choose based on use case):

- [Understanding Agent Types](./understanding-agent-types.md) - **START HERE** - Architecture vs capability, "The Same Agent, Three Ways"
- [Simple Agent Architecture](./simple-agent-architecture.md) - Self-contained, optimized, personality-driven
- [Expert Agent Architecture](./expert-agent-architecture.md) - Memory, sidecar files, domain restrictions
- Module Agent Architecture _(TODO)_ - Workflow integration, professional tools

## Agent Design Patterns

- [Agent Menu Patterns](./agent-menu-patterns.md) - Menu handlers, triggers, prompts, organization
- [Agent Compilation](./agent-compilation.md) - What compiler auto-injects (AVOID DUPLICATION)

## Reference Examples

Production-ready examples in [bmb/reference/agents/](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents):

**Simple Agents** ([simple-examples/](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/simple-examples))

- [commit-poet.agent.yaml](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/src/modules/bmb/reference/agents/simple-examples/commit-poet.agent.yaml) - Commit message artisan with style customization

**Expert Agents** ([expert-examples/](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/expert-examples))

- [journal-keeper/](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/expert-examples/journal-keeper) - Personal journal companion with memory and pattern recognition

**Module Agents** ([module-examples/](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/modules/bmb/reference/agents/module-examples))

- [security-engineer.agent.yaml](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/src/modules/bmb/reference/agents/module-examples/security-engineer.agent.yaml) - BMM security specialist with threat modeling
- [trend-analyst.agent.yaml](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/src/modules/bmb/reference/agents/module-examples/trend-analyst.agent.yaml) - CIS trend intelligence expert

## Installation Guide

For installing standalone simple and expert agents, see:

- [Custom Agent Installation](/docs/custom-content-installation.md)

## Key Concepts

### YAML to XML Compilation

Agents are authored in YAML with Handlebars templating. The compiler auto-injects:

1. **Frontmatter** - Name and description from metadata
2. **Activation Block** - Steps, menu handlers, rules (YOU don't write this)
3. **Menu Enhancement** - `*help` and `*exit` commands added automatically
4. **Trigger Prefixing** - Your triggers auto-prefixed with `*`

**Critical:** See [Agent Compilation](./agent-compilation.md) to avoid duplicating auto-injected content.

Source: `tools/cli/lib/agent/compiler.js`
