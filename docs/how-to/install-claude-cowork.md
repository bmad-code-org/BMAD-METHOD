---
title: 'How to Install BMad in Claude Cowork'
description: Install BMad in Claude Cowork using the Customize menu.
sidebar:
  order: 11
---

Claude.ai web and the Claude desktop chat have no access to your project files, so `npx bmad-method install` can't reach them. [Claude Cowork](https://www.claude.com/product/claude-code) is different — it runs your project in a sandboxed VM and supports a plugin marketplace. BMad ships a `.claude-plugin/marketplace.json` at the repo root that Cowork can consume directly.

## Install

In the Cowork desktop app, open **Customize → Browse plugins → Add marketplace** and enter:

```
bmad-code-org/BMAD-METHOD
```

Cowork pulls the marketplace, surfaces two plugins to install:

- **`bmad-pro-skills`** — brainstorming, editorial review, party mode, document sharding, and more
- **`bmad-method-lifecycle`** — full agile lifecycle: analyst, PM, architect, dev, sprint planning, code review, …

Accept both, restart the session, and `/bmad-pro-skills:*` and `/bmad-method-lifecycle:*` slash commands appear.

## Update

Re-open **Customize**, find the marketplace, and sync/refresh it. Cowork pulls the latest committed tree.

## Pairing With TEA

To install the Test Architect module alongside BMad, add its marketplace the same way:

```
bmad-code-org/bmad-method-test-architecture-enterprise
```

## Known issue

Cowork's personal plugin install has a [known persistence bug](https://github.com/anthropics/claude-code/issues/38429) — plugins may disappear after an app restart. The org-level install (Organisation settings → Plugins → Add plugin) is more reliable for teams.

## Related

- [How to Install BMad](./install-bmad.md) — the standard `npx bmad-method install` flow for other IDEs.
