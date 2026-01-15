---
title: "Core Module"
---


The Core Module is installed with all installations of BMad modules and provides common functionality that any module, workflow, or agent can take advantage of.

## Core Module Components

- **[Global Core Config](/docs/reference/configuration/global-config.md)** — Inheritable configuration that impacts all modules and custom content
- **[Core Workflows](/docs/reference/workflows/core-workflows.md)** — Domain-agnostic workflows usable by any module
  - [Party Mode](/docs/explanation/features/party-mode.md) — Multi-agent conversation orchestration
  - [Brainstorming](/docs/explanation/features/brainstorming-techniques.md) — Structured creative sessions with 60+ techniques
  - [Advanced Elicitation](/docs/explanation/features/advanced-elicitation.md) — LLM rethinking with 50+ reasoning methods
- **[Core Tasks](/docs/reference/configuration/core-tasks.md)** — Common tasks available across modules
  - [Index Docs](/docs/reference/configuration/core-tasks.md#index-docs) — Generate directory index files
  - [Adversarial Review](/docs/reference/configuration/core-tasks.md#adversarial-review) — Critical content review
  - [Shard Document](/docs/reference/configuration/core-tasks.md#shard-document) — Split large documents into sections
