---
title: 'How to Install BMad in Claude Cowork'
description: Install BMad in Claude Cowork using the Claude Code plugin marketplace.
sidebar:
  order: 11
---

Claude.ai web and the Claude desktop chat have no access to your project files, so `npx bmad-method install` can't reach them. [Claude Cowork](https://www.claude.com/product/claude-code) does — it sandboxes your project in a VM and exposes a plugin manager. The `npx` installer still can't write into that sandbox, but Cowork accepts plugins via its marketplace API, which BMad's `.claude-plugin/marketplace.json` ships with.

## Install

Two steps — register the marketplace, then install the plugins:

```
/plugin marketplace add bmad-code-org/BMAD-METHOD
/plugin install bmad-pro-skills@bmad-method
/plugin install bmad-method-lifecycle@bmad-method
```

Restart the Cowork session, then `/bmad-pro-skills:*` and `/bmad-method-lifecycle:*` slash commands appear.

## Update

```
/plugin marketplace update bmad-method
```

The marketplace name is `bmad-method`, not the GitHub slug.

## Uninstall

```
/plugin uninstall bmad-pro-skills@bmad-method
/plugin uninstall bmad-method-lifecycle@bmad-method
```

## Known issue

Cowork's plugin reconciler currently has open bugs ([anthropics/claude-code#38429](https://github.com/anthropics/claude-code/issues/38429), [#39274](https://github.com/anthropics/claude-code/issues/39274)) that can purge third-party marketplace plugins on session sync. If your slash commands disappear, re-run the `/plugin install` lines.

## Pairing With TEA

To install TEA alongside BMad, register and install its marketplace too. See the [TEA README](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise#claude-cowork) for the exact commands.

## Related

- [How to Install BMad](./install-bmad.md) — the standard `npx bmad-method install` flow for non-Cowork tools.
