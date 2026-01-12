---
title: "BMad Builder (BMB)"
description: Create custom agents, workflows, and modules for BMad
---

Create custom agents, workflows, and modules for BMad — from simple personal assistants to full-featured professional tools.

## Quick Start

| Resource | Description |
|----------|-------------|
| **[Agent Creation Guide](/docs/tutorials/advanced/create-custom-agent.md)** | Step-by-step guide to building your first agent |
| **[Install Custom Modules](/docs/how-to/installation/install-custom-modules.md)** | Installing standalone simple and expert agents |

## Agent Architecture

| Type | Description |
|------|-------------|
| **Simple Agent** | Self-contained, optimized, personality-driven |
| **Expert Agent** | Memory, sidecar files, domain restrictions |
| **Module Agent** | Workflow integration, professional tools |

## Key Concepts

Agents are authored in YAML with Handlebars templating. The compiler auto-injects:

1. **Frontmatter** — Name and description from metadata
2. **Activation Block** — Steps, menu handlers, rules
3. **Menu Enhancement** — `*help` and `*exit` commands added automatically
4. **Trigger Prefixing** — Your triggers auto-prefixed with `*`

:::note[Learn More]
See [Custom Content Types](/docs/explanation/bmad-builder/custom-content-types.md) for detailed explanations of all content categories.
:::

## Reference Examples

Production-ready examples available in the BMB reference folder:

| Agent | Type | Description |
|-------|------|-------------|
| **commit-poet** | Simple | Commit message artisan with style customization |
| **journal-keeper** | Expert | Personal journal companion with memory and pattern recognition |
| **security-engineer** | Module | BMM security specialist with threat modeling |
| **trend-analyst** | Module | CIS trend intelligence expert |
