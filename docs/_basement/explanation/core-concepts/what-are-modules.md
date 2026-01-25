---
title: "Modules"
---

Modules are organized collections of agents and workflows that solve specific problems or address particular domains.

## What is a Module?

A module is a self-contained package that includes:

- **Agents** - Specialized AI assistants
- **Workflows** - Step-by-step processes
- **Configuration** - Module-specific settings
- **Documentation** - Usage guides and reference

## Official BMad Method and Builder Modules

:::note[Core is Always Installed]
The Core module is automatically included with every BMad installation. It provides the foundation that other modules build upon.
:::

### Core Module
Always installed, provides shared functionality:
- Global configuration
- Core workflows (Party Mode, Advanced Elicitation, Brainstorming)
- Common tasks (document indexing, sharding, review)

### BMad Method (BMM)
Software and game development:
- Project planning workflows
- Implementation agents (Dev, PM, QA, Scrum Master)
- Testing and architecture guidance

### BMad Builder (BMB)
Create custom solutions:
- Agent creation workflows
- Workflow authoring tools
- Module scaffolding

## Additional Official BMad Modules

These are officially maintained modules by BMad but have their own repo's and docs.
These give a good idea also of what can be done with the BMad builder and creating your own custom modules.

### Creative Intelligence Suite (CIS)
Innovation and creativity:
- Creative thinking techniques
- Innovation strategy workflows
- Storytelling and ideation
- [Available Here](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)

### BMad Game Dev (BMGD)
Game development specialization:
- Game design workflows
- Narrative development
- Performance testing frameworks
- [Available Here](https://github.com/bmad-code-org/bmad-module-game-dev-studio)

## Module Structure

Installed modules follow this structure:

```
_bmad/
├── core/           # Always present
├── bmm/            # BMad Method (if installed)
├── bmb/            # BMad Builder (if installed)
├── cis/            # Creative Intelligence (if installed)
└── bmgd/           # Game Dev (if installed)
```

## Custom Modules

You can create your own modules containing:
- Custom agents for your domain
- Organizational workflows
- Team-specific configurations

Custom modules are installed the same way as official modules.

## Installing Modules

During BMad installation, you choose which modules to install. You can also add or remove modules later by re-running the installer.

See [Installation Guide](/docs/how-to/installation/index.md) for details.
