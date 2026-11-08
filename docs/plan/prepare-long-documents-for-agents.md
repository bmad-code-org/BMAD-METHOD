---
title: 'Prepare Long Documents for Agents'
description: 'When bmad-shard-pro splits a long document into small files, when it adds a contents list instead, and when it leaves the document alone.'
sidebar:
  order: 9
---

Use the `bmad-shard-pro` skill to make a long document, such as a large PRD, an imported spec or a vendor manual, cheap for agents to read and maintain. This page explains which of its three outcomes fits your document.

## When to Use This

- A document agents work from is past about 50 KB (roughly 8,000 words).
- You are about to plan from a large existing document, such as an old spec or a vendor manual.
- Agents miss things in a long document, read only its first part, or run slowly or expensively because of it.

## When to Skip This

A document under about 50 KB works as it is. An agent reads it whole for little, and splitting it would add a map to keep current.

## The Three Outcomes

| Outcome | What happens | Fits when |
| --- | --- | --- |
| Leave it | Nothing changes. | It is under about 50 KB, or it has to stay one file and already has a good contents list near the top. |
| Split | The document is cut word for word into small, well-named files, with a map in a main file. | It is long and will be kept and edited. This is the default for long project documents. |
| Contents list | The file stays one file and gains a list of every section with its line range, near the top. | It is long but has to stay one file, or it is a fixed reference. |

## Why a Split Is the Default

Small files with clear names serve agents better than one long file. The file names alone show where things are, an agent loads only the part it needs, and an edit touches one small file. Several people or agents can work on different parts with fewer merge conflicts. A split also maps directly onto a page tree, so a document that syncs to Confluence or a wiki can publish each shard as a child page of the main page.

## When One File Is Better

Keep the document as one file, with a contents list, when any of these is true.

| Reason | Example |
| --- | --- |
| Something outside the agent needs one file | You export it to Word or PDF, upload it to another AI tool, attach it to an email, or a tool takes it as one path. |
| People read or review it straight through | A contract or proposal that stakeholders read from start to end, or review in one diff. |
| It is usually read whole | A document checked end to end for consistency, where reading many shards means more reads and a missed shard goes unnoticed. |
| It is a fixed reference | A vendor manual, a standard or a signed contract that nobody will edit, so there is nothing to maintain piece by piece. |
| Its sections depend on each other | Steps that run across sections, or frequent "as described above". A split keeps the original words, so cut pieces would not read on their own. |

## Run the Skill

Ask for `bmad-shard-pro` by name, or say "this file is too long for agents". The skill measures the document. When it is past about 50 KB, the skill asks whether it will be kept and edited and whether it has to stay one file, then recommends one outcome with one line on why. It waits for you to agree before it changes anything.

It never rewrites content. For a split, a script cuts the text, checks that the shards join back into the original exactly, and moves the original into `.source/`.

:::note[Not for transcripts]
Transcripts, chat exports and meeting notes are not documents to shard. Use `bmad-ingest`, which turns them into a note.
:::

## What You Get

A contents list is added to the file itself, after its title. A split replaces the document with a folder:

```
prd-billing/
├── prd-billing.md          # main file: a note and the map
├── pricing-and-plans.md    # a shard
├── invoicing.md            # a shard
├── identifier-lookup.md    # only when readers look things up by identifier
└── .source/prd-billing.md  # the original, frozen
```

When another skill needs the document, give it the main file. It reads the map and opens only the shards it needs.

## Change a Sharded Document

Any agent can change a sharded document without the skill, because the note at the top of the main file says how. Each shard's frontmatter names the main file and holds the shard's title, one-line summary and map group.

- Add new content to the shard a reader would look in first.
- When a shard's coverage changes, update its summary in its frontmatter and in its map line.
- For a new shard, create a file with the same frontmatter and add its line to the map.

Running the skill again is optional. It rebuilds the map from the shards' frontmatter and rechecks the folder. A contents list is changed the same way: add a line to the list for a new section, and the skill refreshes the line ranges later.

:::tip[Catch drift in CI]
Run `uv run .agents/skills/bmad-shard-pro/scripts/shard_tool.py check <folder> --all` in a pre-commit hook or CI (in Claude Code the skill is under `.claude/skills/`). It checks every sharded folder and contents list under the folder, and fails when a shard is missing from its map or its frontmatter does not parse.
:::
