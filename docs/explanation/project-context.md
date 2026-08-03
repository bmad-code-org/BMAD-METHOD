---
title: "Project Context"
description: How bmad-project-context curates the verified knowledge AI agents load — a small kernel plus a knowledge bundle
sidebar:
  order: 11
---

`bmad-project-context` owns everything the code can't tell an AI agent: why the architecture is shaped this way, which conventions are deliberate, what the org requires, which landmines a fresh session must know before touching anything. It maintains that knowledge as a small, verified context system instead of generated documentation.

The evidence behind the design is blunt: LLM-generated context docs measurably make agents *worse* (lower correctness at higher cost), and long overview documents add wasted exploration. What works is a tiny always-loaded file, small verified entries loaded on demand, and mechanical maps produced fresh on demand. So the skill curates the minimum non-derivable set and never describes what the code already says. For the full reasoning — including what is deliberately *not* captured and why — see [The Theory of Project Context](project-context-theory.md).

## The two artifacts

**The kernel** (`kernel.md`) is one small file loaded into every agent session — exact commands where the obvious guess fails, conventions that differ from ecosystem defaults, landmines, hard org requirements. It lives under an instruction budget (~150–200 instructions), is priority-ordered, and every line must pass the pruning test: *would removing this line change agent behavior?* Small projects need the kernel and nothing else.

**The bundle** is a directory of small markdown entries behind the kernel — architecture rationale, the *why* behind conventions, domain facts, decision history. Each entry carries frontmatter with trust signals: `verified` (a human confirmed it, or it was path-checked with a human in the loop) or `generated` (inferred, unconfirmed — everything a headless run writes). `index.md` is the sole entry point; entries are loaded on demand, never wholesale.

Both live in your `project_knowledge` folder (the standard install setting, default `docs/`). A mechanics script (`context.py`) handles everything mechanical — validation, indexing, staleness sweeps, repo maps, cross-project resolution — so no agent ever guesses at mechanical facts.

## Three intents

| Intent | What it does |
|--------|--------------|
| **Ingest** | Build or refresh the context. Brownfield: mine the repo and docs first, then ask only what's genuinely unknowable. Greenfield: seed from a spec or architecture doc, or a short interview. Refresh: diff against the last run — never start over. |
| **Query** | Answer a question from the bundle without loading all of it, with trust metadata attached. |
| **Audit** | Keep the set small and true: staleness sweeps, path verification, the pruning test. Context shrinks or holds — it never accretes. |

## How agents load it

On first run the skill asks your **placement** preference:

- **bmad** — the kernel loads through BMad customization arrays; your agent files are never touched.
- **agent-files** — the script maintains managed `<!-- bmad:context -->` blocks in your root and nested `AGENTS.md` files, preserving everything around them. This is the default when there's no BMad install — the skill works standalone in any repo, with no framework at all.
- **both** — arrays plus agent files, kept in sync.

## Interaction with architecture

Decisions are *born* in `bmad-architecture`; they *live* in project-context. The architecture spine is the premier ingest source, and if ingest surfaces a genuinely contested decision, the skill says it deserves `bmad-architecture` rather than quietly making the call.

## Replaces two earlier skills

:::note[Deprecated: bmad-document-project and bmad-generate-project-context]
Both earlier skills are deprecated and now forward here. `bmad-generate-project-context` produced a single `project-context.md`; `bmad-document-project` scanned a brownfield repo into documentation. Their trigger phrases still work, any existing `project-context.md` keeps loading (and becomes a mining source on the next ingest), and the ideas they carried — "capture unobvious rules only" — are now the whole architecture.
:::
