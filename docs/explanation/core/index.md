---
title: "Core Module"
---


The Core Module is installed with all installations of BMAD modules and provides common functionality that any module, workflow, or agent can take advantage of.

## Core Module Components

- **[Global Core Config](../../reference/configuration/global-config.md)** — Inheritable configuration that impacts all modules and custom content
- **[Core Workflows](../../reference/workflows/core-workflows.md)** — Domain-agnostic workflows usable by any module
  - [Party Mode](../../explanation/features/party-mode.md) — Multi-agent conversation orchestration
  - [Brainstorming](../../explanation/features/brainstorming-techniques.md) — Structured creative sessions with 60+ techniques
  - [Advanced Elicitation](../../explanation/features/advanced-elicitation.md) — LLM rethinking with 50+ reasoning methods
- **[Core Tasks](../../reference/configuration/core-tasks.md)** — Common tasks available across modules
  - [Index Docs](../../reference/configuration/core-tasks.md#index-docs) — Generate directory index files
  - [Adversarial Review](../../reference/configuration/core-tasks.md#adversarial-review-general) — Critical content review
  - [Shard Document](../../reference/configuration/core-tasks.md#shard-document) — Split large documents into sections
