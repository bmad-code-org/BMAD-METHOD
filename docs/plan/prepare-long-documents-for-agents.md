---
title: 'Prepare Long Documents for Agents'
description: 'When bmad-shard-pro splits a long document into small files, when it adds a contents list instead, and when it leaves the document alone.'
sidebar:
  order: 8
---

Use the `bmad-shard-pro` skill to make a long document, such as a large PRD, an imported spec, or a vendor manual, inexpensive and reliable for AI agents to read and maintain. This page explains which of its three outcomes fits your document.

## When to Use This

- A document agents work from is past about 50 KB (roughly 8,000 words).
- You are about to plan from a large existing document, such as a legacy specification or a vendor manual.
- Agents miss details in a long document, read only its beginning, or run slowly and burn extra tokens because of its size.

## When to Skip This

A document under about 50 KB works fine as a single file. An agent can read the whole file cheaply, and splitting it would add an index to maintain without much gain.

## The Three Outcomes

| Outcome | What happens | Fits when |
| --- | --- | --- |
| Leave it | Nothing changes. | The file is under about 50 KB, or it must stay one file and already has an accurate contents list near the top. |
| Split | The document is cut word for word into small, clearly named files with an index in a main file. | The file is long and will be kept and edited over time. This is the default for long project documents. |
| Contents list | The file stays intact and gains a section list with line ranges near the top. | The file is long but must stay a single file, or it is a fixed reference nobody edits. |

## Why a Split Is the Default

Small files with descriptive names help agents find exact facts fast. File names show where topics live, an agent loads only the pieces it needs, and edits touch one small file at a time. Multiple people or agents can update different parts with fewer merge conflicts. A split also maps cleanly onto a wiki tree, so a document synced to Confluence or Notion can publish each shard as a child page under the main page.

## When One File Is Better

Keep the document as a single file with a contents list when any of these apply:

| Reason | Example |
| --- | --- |
| An external tool expects one file | You export it to Word or PDF, upload it to another tool, attach it to an email, or pass a single file path to a script. |
| People read or review it straight through | A contract or proposal that stakeholders read from start to end, or review in a single diff. |
| It is usually checked whole | A document audited end to end for consistency, where reading many shards increases total reads and risks skipping one. |
| It is a fixed reference | A vendor manual, standard, or signed contract that nobody edits piece by piece. |
| Sections depend heavily on earlier prose | Procedures that span sections or rely on frequent "as described above" references, since splitting keeps the original words intact. |

## Run the Skill

Ask for `bmad-shard-pro` by name, or say "this file is too long for agents". The skill measures the file. Past about 50 KB, it asks whether you plan to keep editing the document and whether it has to stay one file, then recommends one outcome with a short reason and waits for your approval before changing anything.

`bmad-shard-pro` never rewrites your prose. For a split, a script divides the text, verifies that joining the shards reproduces the original byte for byte, and archives the original inside `.source/`.

:::note[Not for transcripts]
Transcripts, chat exports, and raw meeting notes are not documents to shard. Use `bmad-ingest` instead to distill them into cited notes.
:::

## What You Get

A contents list is inserted directly into the file right after its title. A split replaces the file with a folder:

```text
prd-billing/
├── prd-billing.md          # main file: instructions and index map
├── pricing-and-plans.md    # a shard
├── invoicing.md            # a shard
├── identifier-lookup.md    # added when readers look things up by ID
└── .source/prd-billing.md  # original file, archived
```

When another skill needs the document, point it at the main file (`prd-billing.md`). It reads the index map and opens only the shards relevant to its task.

## Change a Sharded Document

Any agent can edit a sharded document without invoking `bmad-shard-pro`, because the instructions at the top of the main file explain the rules. Each shard's frontmatter names the main file and records its title, one-line summary, and group.

- Add new content to the shard a reader would check first.
- When a shard's scope changes, update its one-line summary in both its frontmatter and the main index map.
- When adding a new shard, copy the frontmatter structure and add its entry to the map.

Re-running `bmad-shard-pro` later is optional; it rebuilds the index map from shard frontmatter and validates the folder. A single-file contents list works the same way: add a line for a new section and let the skill refresh line ranges later.

:::tip[Catch drift in CI]
Run `uv run <skills-folder>/bmad-shard-pro/scripts/shard_tool.py check <folder> --all` in a pre-commit hook or CI job (replacing `<skills-folder>` with where your tool installed skills, such as `.agents/skills` or `.claude/skills`). It checks every sharded folder and contents list under that path and fails if an index map, identifier lookup, or shard frontmatter falls out of sync.
:::
