---
title: "Custom Content"
---

BMad supports several categories of custom content that extend the platform's capabilities — from simple personal agents to full-featured professional modules.

:::tip[Recommended Approach]
Use the BMad Builder (BoMB) Module for guided workflows and expertise when creating custom content.
:::

This flexibility enables:

- Extensions and add-ons for existing modules (BMad Method, Creative Intelligence Suite)
- Completely new modules, workflows, templates, and agents outside software engineering
- Professional services tools
- Entertainment and educational content
- Science and engineering workflows
- Productivity and self-help solutions
- Role-specific augmentation for virtually any profession

## Categories

- [Categories](#categories)
- [Custom Stand-Alone Modules](#custom-stand-alone-modules)
- [Custom Add-On Modules](#custom-add-on-modules)
- [Custom Global Modules](#custom-global-modules)
- [Custom Agents](#custom-agents)
  - [BMad Tiny Agents](#bmad-tiny-agents)
  - [Simple and Expert Agents](#simple-and-expert-agents)
- [Custom Workflows](#custom-workflows)

## Custom Stand-Alone Modules

Custom modules range from simple collections of related agents, workflows, and tools designed to work independently, to complex, expansive systems like the BMad Method or even larger applications.

Custom modules are [installable](/docs/how-to/installation/install-custom-modules.md) using the standard BMad method and support advanced features:

- Optional user information collection during installation/updates
- Versioning and upgrade paths
- Custom installer functions with IDE-specific post-installation handling (custom hooks, subagents, or vendor-specific tools)
- Ability to bundle specific tools such as MCP, skills, execution libraries, and code

## Custom Add-On Modules

Custom Add-On Modules contain specific agents, tools, or workflows that expand, modify, or customize another module but cannot exist or install independently. These add-ons provide enhanced functionality while leveraging the base module's existing capabilities.

Examples include:

- Alternative implementation workflows for BMad Method agents
- Framework-specific support for particular use cases
- Game development expansions that add new genre-specific capabilities without reinventing existing functionality

Add-on modules can include:

- Custom agents with awareness of the target module
- Access to existing module workflows
- Tool-specific features such as rulesets, hooks, subprocess prompts, subagents, and more

## Custom Global Modules

Similar to Custom Stand-Alone Modules, but designed to add functionality that applies across all installed content. These modules provide cross-cutting capabilities that enhance the entire BMad ecosystem.

Examples include:

- The core module, which is always installed and provides all agents with party mode and advanced elicitation capabilities
- Installation and update tools that work with any BMad method configuration

Upcoming standards will document best practices for building global content that affects installed modules through:

- Custom content injections
- Agent customization auto-injection
- Tooling installers

## Custom Agents

Custom Agents can be designed and built for various use cases, from one-off specialized agents to more generic standalone solutions.

### BMad Tiny Agents

Personal agents designed for highly specific needs that may not be suitable for sharing. For example, a team management agent living in an Obsidian vault that helps with:

- Team coordination and management
- Understanding team details and requirements
- Tracking specific tasks with designated tools

These are simple, standalone files that can be scoped to focus on specific data or paths when integrated into an information vault or repository.

### Simple and Expert Agents

The distinction between simple and expert agents lies in their structure:

**Simple Agent:**

- Single file containing all prompts and configuration
- Self-contained and straightforward

**Expert Agent:**

- Similar to simple agents but includes a sidecar folder
- Sidecar folder contains additional resources: custom prompt files, scripts, templates, and memory files
- When installed, the sidecar folder (`[agentname]-sidecar`) is placed in the user memory location
- has metadata type: expert

:::note[Key Distinction]
The key distinction is the presence of a sidecar folder. As web and consumer agent tools evolve to support common memory mechanisms, storage formats, and MCP, the writable memory files will adapt to support these evolving standards.
:::

Custom agents can be:

- Used within custom modules
- Designed as standalone tools
- Integrated with existing workflows and systems, if this is to be the case, should also include a module: <module name> if a specific module is intended for it to require working with

## Custom Workflows

Workflows are powerful, progressively loading sequence engines capable of performing tasks ranging from simple to complex, including:

- User engagements
- Business processes
- Content generation (code, documentation, or other output formats)

A custom workflow created outside of a larger module can still be distributed and used without associated agents through:

- Slash commands
- Manual command/prompt execution when supported by tools

:::tip[Core Concept]
At its core, a custom workflow is a single or series of prompts designed to achieve a specific outcome.
:::
