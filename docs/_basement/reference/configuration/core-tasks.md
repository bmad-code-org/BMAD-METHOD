---
title: "Core Tasks"
---

Reusable task definitions that can be invoked by any BMad module, workflow, or agent.

## Contents

- [Index Docs](#index-docs) — Generate directory index files
- [Adversarial Review](#adversarial-review) — Critical content review
- [Shard Document](#shard-document) — Split large documents into sections

## Index Docs

**Generates or updates an index.md file documenting all files in a specified directory.**

**Use it when:**
- You need navigable documentation for a folder of markdown files
- You want to maintain an updated index as content evolves

**How it works:**
1. Scan the target directory for files and subdirectories
2. Group content by type, purpose, or location
3. Read each file to generate brief (3-10 word) descriptions
4. Create or update index.md with organized listings

**Output:** Markdown index with sections for Files and Subdirectories, each entry containing a relative link and description.

## Adversarial Review

**Performs a cynical, skeptical review of any content to identify issues and improvement opportunities.**

**Use it when:**
- Reviewing code diffs before merging
- Finalizing specifications or user stories
- Releasing documentation
- Any artifact needs a critical eye before completion

**How it works:**
1. Load the content to review (diff, branch, document, etc.)
2. Perform adversarial analysis — assume problems exist
3. Find at least ten issues to fix or improve
4. Output findings as a markdown list

:::note[Unbiased Review]
This task runs in a separate subagent with read access but no prior context, ensuring an unbiased review.
:::

## Shard Document

**Splits large markdown documents into smaller files based on level 2 (`##`) sections.**

**Use it when:**
- A markdown file has grown too large to work with effectively
- You want to break a monolithic document into manageable sections
- Individual sections need to be edited independently

**How it works:**
1. Confirm source document path (must be markdown)
2. Determine destination folder (defaults to folder named after document)
3. Execute sharding via `npx @kayvan/markdown-tree-parser`
4. Verify output files and index.md were created
5. Handle original document — delete, move to archive, or keep

:::caution[Original File]
After sharding, delete or archive the original to avoid confusion. Updates should happen in the sharded files only.
:::
