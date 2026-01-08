---
title: "BMad Builder (BMB)"
description: Create custom agents, workflows, and modules for BMad
---


Create custom agents, workflows, and modules for BMad.

---

## Quick Start

- **[Agent Creation Guide](/docs/tutorials/advanced/create-custom-agent.md)** - Step-by-step guide to building your first agent

---

## Agent Architecture

Comprehensive guides for each agent type:

- **Simple Agent Architecture** - Self-contained, optimized, personality-driven
- **Expert Agent Architecture** - Memory, sidecar files, domain restrictions
- **Module Agent Architecture** - Workflow integration, professional tools

---

## Key Concepts

### YAML to XML Compilation

Agents are authored in YAML with Handlebars templating. The compiler auto-injects:

1. **Frontmatter** - Name and description from metadata
2. **Activation Block** - Steps, menu handlers, rules
3. **Menu Enhancement** - `*help` and `*exit` commands added automatically
4. **Trigger Prefixing** - Your triggers auto-prefixed with `*`

---

## Reference Examples

Production-ready examples available in the BMB reference folder:

### Simple Agents
- **commit-poet** - Commit message artisan with style customization

### Expert Agents
- **journal-keeper** - Personal journal companion with memory and pattern recognition

### Module Agents
- **security-engineer** - BMM security specialist with threat modeling
- **trend-analyst** - CIS trend intelligence expert

---

## Installation Guide

For installing standalone simple and expert agents, see:
- [Install Custom Modules](/docs/how-to/installation/install-custom-modules.md)

---

## Related

- [Custom Content Types](/docs/explanation/bmad-builder/custom-content-types.md) - Understanding content types
- [Create Custom Agent](/docs/tutorials/advanced/create-custom-agent.md) - Tutorial
