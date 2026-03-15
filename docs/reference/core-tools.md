---
title: Core Tools
description: Reference for all built-in tasks and workflows available in every BMad installation without additional modules.
sidebar:
  order: 2
---

Every BMad installation includes a set of core skills that can be used in conjunction with any anything you are doing — standalone tasks and workflows that work across all projects, all modules, and all phases. These are always available regardless of which optional modules you install.

:::tip[Quick Path]
Run any core tool by typing its skill name (e.g., `bmad-help`) in your IDE. No agent session required.
:::

## Overview

| Tool | Type | Purpose |
| --- | --- | --- |
| [`bmad-help`](#bmad-help) | Task | Get context-aware guidance on what to do next |
| [`bmad-brainstorming`](#bmad-brainstorming) | Workflow | Facilitate interactive brainstorming sessions |
| [`bmad-party-mode`](#bmad-party-mode) | Workflow | Orchestrate multi-agent group discussions |
| [`bmad-distillator`](#bmad-distillator) | Task | Lossless LLM-optimized compression of documents |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation) | Task | Push LLM output through iterative refinement methods |
| [`bmad-review-adversarial-general`](#bmad-review-adversarial-general) | Task | Cynical review that finds what's missing and what's wrong |
| [`bmad-review-edge-case-hunter`](#bmad-review-edge-case-hunter) | Task | Exhaustive branching-path analysis for unhandled edge cases |
| [`bmad-editorial-review-prose`](#bmad-editorial-review-prose) | Task | Clinical copy-editing for communication clarity |
| [`bmad-editorial-review-structure`](#bmad-editorial-review-structure) | Task | Structural editing — cuts, merges, and reorganization |
| [`bmad-shard-doc`](#bmad-shard-doc) | Task | Split large markdown files into organized sections |
| [`bmad-index-docs`](#bmad-index-docs) | Task | Generate or update an index of all docs in a folder |

## bmad-help

**Your intelligent guide to what comes next.** — Inspects your project state, detects what's been done, and recommends the next required or optional step.

**Use it when:**

- You finished a workflow and want to know what's next
- You're new to BMad and need orientation
- You're stuck and want context-aware advice
- You installed new modules and want to see what's available

**How it works:**

1. Scans your project for existing artifacts (PRD, architecture, stories, etc.)
2. Detects which modules are installed and their available workflows
3. Recommends next steps in priority order — required steps first, then optional
4. Presents each recommendation with the skill command and a brief description

**Input:** Optional query in natural language (e.g., `bmad-help I have a SaaS idea, where do I start?`)

**Output:** Prioritized list of recommended next steps with skill commands

## bmad-brainstorming

**Generate diverse ideas through interactive creative techniques.** — A facilitated brainstorming session that loads proven ideation methods from a technique library and guides you toward 100+ ideas before organizing.

**Use it when:**

- You're starting a new project and need to explore the problem space
- You're stuck generating ideas and need structured creativity
- You want to use proven ideation frameworks (SCAMPER, reverse brainstorming, etc.)

**How it works:**

1. Sets up a brainstorming session with your topic
2. Loads creative techniques from a method library
3. Guides you through technique after technique, generating ideas
4. Applies anti-bias protocol — shifts creative domain every 10 ideas to prevent clustering
5. Produces an append-only session document with all ideas organized by technique

**Input:** Brainstorming topic or problem statement, optional context file

**Output:** `brainstorming-session-{date}.md` with all generated ideas

:::note[Quantity Target]
The magic happens in ideas 50–100. The workflow encourages generating 100+ ideas before organization.
:::

## bmad-party-mode

**Orchestrate multi-agent group discussions.** — Loads all installed BMad agents and facilitates a natural conversation where each agent contributes from their unique expertise and personality.

**Use it when:**

- You need multiple expert perspectives on a decision
- You want agents to challenge each other's assumptions
- You're exploring a complex topic that spans multiple domains

**How it works:**

1. Loads the agent manifest with all installed agent personalities
2. Analyzes your topic to select 2–3 most relevant agents
3. Agents take turns contributing, with natural cross-talk and disagreements
4. Rotates agent participation to ensure diverse perspectives over time
5. Exit with `goodbye`, `end party`, or `quit`

**Input:** Discussion topic or question, along with specification of personas you would like to participate (optional)

**Output:** Real-time multi-agent conversation with maintained agent personalities

## bmad-distillator

**Lossless LLM-optimized compression of source documents.** — Produces dense, token-efficient distillates that preserve all information for downstream LLM consumption. Verifiable through round-trip reconstruction.

**Use it when:**

- A document is too large for an LLM's context window
- You need token-efficient versions of research, specs, or planning artifacts
- You want to verify no information is lost during compression
- Agents will need to frequently reference and find information in it

**How it works:**

1. **Analyze** — Reads source documents, identifies information density and structure
2. **Compress** — Converts prose to dense bullet-point format, strips decorative formatting
3. **Verify** — Checks completeness to ensure all original information is preserved
4. **Validate** (optional) — Round-trip reconstruction test proves lossless compression

**Input:**

- `source_documents` (required) — File paths, folder paths, or glob patterns
- `downstream_consumer` (optional) — What consumes this (e.g., "PRD creation")
- `token_budget` (optional) — Approximate target size
- `--validate` (flag) — Run round-trip reconstruction test

**Output:** Distillate markdown file(s) with compression ratio report (e.g., "3.2:1")

## bmad-advanced-elicitation

**Push LLM output through iterative refinement methods.** — Selects from a library of elicitation techniques to systematically improve content through multiple passes.

**Use it when:**

- LLM output feels shallow or generic
- You want to explore a topic from multiple analytical angles
- You're refining a critical document and want deeper thinking

**How it works:**

1. Loads method registry with 5+ elicitation techniques
2. Selects 5 best-fit methods based on content type and complexity
3. Presents an interactive menu — pick a method, reshuffle, or list all
4. Applies the selected method to enhance the content
5. Re-presents options for iterative improvement until you select "Proceed"

**Input:** Content section to enhance

**Output:** Enhanced version of the content with improvements applied

## bmad-review-adversarial-general

**Cynical review that assumes problems exist and searches for them.** — Takes a skeptical, jaded reviewer perspective with zero patience for sloppy work. Looks for what's missing, not just what's wrong.

**Use it when:**

- You need quality assurance before finalizing a deliverable
- You want to stress-test a spec, story, or document
- You want to find gaps in coverage that optimistic reviews miss

**How it works:**

1. Reads the content with a cynical, critical perspective
2. Identifies issues across completeness, correctness, and quality
3. Searches specifically for what's missing — not just what's present and wrong
4. Must find a minimum of 10 issues or re-analyzes deeper

**Input:**

- `content` (required) — Diff, spec, story, doc, or any artifact
- `also_consider` (optional) — Additional areas to keep in mind

**Output:** Markdown list of 10+ findings with descriptions

## bmad-review-edge-case-hunter

**Walk every branching path and boundary condition, report only unhandled cases.** — Pure path-tracing methodology that mechanically derives edge classes. Orthogonal to adversarial review — method-driven, not attitude-driven.

**Use it when:**

- You want exhaustive edge case coverage for code or logic
- You need a complement to adversarial review (different methodology, different findings)
- You're reviewing a diff or function for boundary conditions

**How it works:**

1. Enumerates all branching paths in the content
2. Derives edge classes mechanically: missing else/default, unguarded inputs, off-by-one, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
3. Tests each path against existing guards
4. Reports only unhandled paths — silently discards handled ones

**Input:**

- `content` (required) — Diff, full file, or function
- `also_consider` (optional) — Additional areas to keep in mind

**Output:** JSON array of findings, each with `location`, `trigger_condition`, `guard_snippet`, and `potential_consequence`

:::note[Complementary Reviews]
Run both `bmad-review-adversarial-general` and `bmad-review-edge-case-hunter` together for orthogonal coverage. The adversarial review catches quality and completeness issues; the edge case hunter catches unhandled paths.
:::

## bmad-editorial-review-prose

**Clinical copy-editing focused on communication clarity.** — Reviews text for issues that impede comprehension. Applies Microsoft Writing Style Guide baseline. Preserves author voice.

**Use it when:**

- You've drafted a document and want to polish the writing
- You need to ensure clarity for a specific audience
- You want communication fixes without style opinion changes

**How it works:**

1. Reads the content, skipping code blocks and frontmatter
2. Identifies communication issues (not style preferences)
3. Deduplicates same issues across multiple locations
4. Produces a three-column fix table

**Input:**

- `content` (required) — Markdown, plain text, or XML
- `style_guide` (optional) — Project-specific style guide
- `reader_type` (optional) — `humans` (default) for clarity/flow, or `llm` for precision/consistency

**Output:** Three-column markdown table: Original Text | Revised Text | Changes

## bmad-editorial-review-structure

**Structural editing — proposes cuts, merges, moves, and condensing.** — Reviews document organization and proposes substantive changes to improve clarity and flow before copy editing.

**Use it when:**

- A document was produced from multiple subprocesses and needs structural coherence
- You want to reduce document length while preserving comprehension
- You need to identify scope violations or buried critical information

**How it works:**

1. Analyzes document against 5 structure models (Tutorial, Reference, Explanation, Prompt, Strategic)
2. Identifies redundancies, scope violations, and buried information
3. Produces prioritized recommendations: CUT, MERGE, MOVE, CONDENSE, QUESTION, PRESERVE
4. Estimates total reduction in words and percentage

**Input:**

- `content` (required) — Document to review
- `purpose` (optional) — Intended purpose (e.g., "quickstart tutorial")
- `target_audience` (optional) — Who reads this
- `reader_type` (optional) — `humans` or `llm`
- `length_target` (optional) — Target reduction (e.g., "30% shorter")

**Output:** Document summary, prioritized recommendation list, and estimated reduction

## bmad-shard-doc

**Split large markdown files into organized section files.** — Uses level-2 headers as split points to create a folder of self-contained section files with an index.

**Use it when:**

- A markdown document has grown too large to manage effectively (500+ lines)
- You want to break a monolithic doc into navigable sections
- You need separate files for parallel editing or LLM context management

**How it works:**

1. Validates the source file exists and is markdown
2. Splits on level-2 (`##`) headers into numbered section files
3. Creates an `index.md` with section manifest and links
4. Prompts you to delete, archive, or keep the original

**Input:** Source markdown file path, optional destination folder

**Output:** Folder with `index.md` and `01-{section}.md`, `02-{section}.md`, etc.

## bmad-index-docs

**Generate or update an index of all documents in a folder.** — Scans a directory, reads each file to understand its purpose, and produces an organized `index.md` with links and descriptions.

**Use it when:**

- You need a lightweight index for quick LLM scanning of available docs
- A documentation folder has grown and needs an organized table of contents
- You want an auto-generated overview that stays current

**How it works:**

1. Scans the target directory for all non-hidden files
2. Reads each file to understand its actual purpose
3. Groups files by type, purpose, or subdirectory
4. Generates concise descriptions (3–10 words each)

**Input:** Target folder path

**Output:** `index.md` with organized file listings, relative links, and brief descriptions
