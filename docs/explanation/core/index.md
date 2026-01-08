---
title: "Core Module"
---


The Core Module is installed with all installations of BMAD modules and provides common functionality that any module, workflow, or agent can take advantage of.

## Core Module Components

- **[Global Core Config](/reference/configuration/global-config/)** — Inheritable configuration that impacts all modules and custom content
- **[Core Workflows](/reference/workflows/core-workflows/)** — Domain-agnostic workflows usable by any module
  - [Party Mode](/explanation/features/party-mode/) — Multi-agent conversation orchestration
  - [Brainstorming](/explanation/features/brainstorming-techniques/) — Structured creative sessions with 60+ techniques
  - [Advanced Elicitation](/explanation/features/advanced-elicitation/) — LLM rethinking with 50+ reasoning methods
- **[Core Tasks](/reference/configuration/core-tasks/)** — Common tasks available across modules
  - [Index Docs](/reference/configuration/core-tasks/#index-docs) — Generate directory index files
  - [Adversarial Review](/reference/configuration/core-tasks/#adversarial-review-general) — Critical content review
  - [Shard Document](/reference/configuration/core-tasks/#shard-document) — Split large documents into sections
