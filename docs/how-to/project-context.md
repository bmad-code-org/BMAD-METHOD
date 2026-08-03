---
title: 'Manage Project Context'
description: Build and maintain your project's verified context system with bmad-project-context
sidebar:
  order: 8
---

Use `bmad-project-context` to give every AI agent session the minimum verified, non-derivable knowledge it needs — a small always-loaded kernel plus a knowledge bundle — for a new project or an existing codebase, with or without a BMad install.

:::note[Prerequisites]

- BMad Method installed — or nothing at all: the skill also runs standalone in any repo (it bootstraps its own mechanics script on first run)
  :::

## When to use this

- You're starting AI-assisted work in an existing codebase (this is the brownfield on-ramp)
- You're starting a new project and want your stack, conventions, and constraints captured before implementation
- Agents keep making decisions that don't match your project
- Your context feels stale or bloated — run an audit

## Step 1: Run it

```bash
bmad-project-context
```

Say what you want in plain language — "set up project context", "refresh the context", "audit our context" — and the skill routes itself (ingest is the default). On first run it confirms where the context lives (your `project_knowledge` folder) and asks how agents should load it: through BMad customization arrays, through managed blocks in your `AGENTS.md` files, or both.

## Step 2: Answer only what the code can't

For an existing codebase the skill scans first — code, configs, planning docs, any docs folders — and then asks in short rounds: confirmations of what it inferred (with evidence, so a confirm takes seconds), then only the genuinely unknowable things — landmines, frozen areas, org requirements. It never asks a question the code could answer. Anything you bring from outside the repo (org handbooks, wiki exports, an MCP knowledgebase) gets mined the same way — mention it when asked what sources you have.

## Step 3: Review what exists

You get a kernel (`kernel.md`) that stays under its instruction budget and a bundle of small entries, each marked `verified` (you confirmed it) or `generated` (inferred, unconfirmed). The `index.md` is script-generated. Nothing describes what the code already says — if an entry does, the audit deletes it.

Keep it healthy over time:

- **Refresh** after real change — it diffs against the last run and never re-asks what you already settled
- **Audit** on demand — staleness sweep, path checks, and the pruning test; total size holds or shrinks
- **Query** — other skills (and you) can ask questions answered from the bundle with trust metadata attached

## Deprecated predecessors

:::note[Looking for bmad-generate-project-context or bmad-document-project?]
Both are deprecated and forward here — their trigger phrases still work. An existing `project-context.md` keeps loading for backwards compatibility and becomes a mining source on your next ingest.
:::

## Next steps

- [**Project Context Explanation**](../explanation/project-context.md) — the design and the evidence behind it
- [**Workflow Map**](../reference/workflow-map.md) — where context fits in the method
