# Modules

Modules are organized collections of agents and workflows that solve specific problems or address particular domains.

## What is a Module?

A module is a self-contained package that includes:

- **Agents** - Specialized AI assistants
- **Workflows** - Step-by-step processes
- **Configuration** - Module-specific settings
- **Documentation** - Usage guides and reference

## Official Modules

### Core Module
Always installed, provides shared functionality:
- Global configuration
- Core workflows (Party Mode, Advanced Elicitation, Brainstorming)
- Common tasks (document indexing, sharding, review)

### BMAD Method (BMM)
Software and game development:
- Project planning workflows
- Implementation agents (Dev, PM, QA, Scrum Master)
- Testing and architecture guidance

### BMAD Builder (BMB)
Create custom solutions:
- Agent creation workflows
- Workflow authoring tools
- Module scaffolding

### Creative Intelligence Suite (CIS)
Innovation and creativity:
- Creative thinking techniques
- Innovation strategy workflows
- Storytelling and ideation

### BMAD Game Dev (BMGD)
Game development specialization:
- Game design workflows
- Narrative development
- Performance testing frameworks

## Module Structure

Installed modules follow this structure:

```
_bmad/
├── core/           # Always present
├── bmm/            # BMAD Method (if installed)
├── bmb/            # BMAD Builder (if installed)
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

During BMAD installation, you choose which modules to install. You can also add or remove modules later by re-running the installer.

See [Installation Guide](./installing/) for details.

---

**Next:** Read the [Installation Guide](./installing/) to set up BMAD with the modules you need.
