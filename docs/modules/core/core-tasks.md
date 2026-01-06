# Core Tasks

Core Tasks are reusable task definitions that can be invoked by any BMAD module, workflow, or agent. These tasks provide standardized functionality for common operations.

## Table of Contents

- [Index Docs](#index-docs) — Generate directory index files
- [Adversarial Review](#adversarial-review-general) — Critical content review
- [Shard Document](#shard-document) — Split large documents into sections

---

## Index Docs

**Generates or updates an index.md file documenting all documents in a specified directory.**

This task scans a target directory, reads file contents to understand their purpose, and creates a well-organized index with accurate descriptions. Files are grouped by type, purpose, or subdirectory, and descriptions are generated from actual content rather than guessing from filenames.

**Use it when:** You need to create navigable documentation for a folder of markdown files, or you want to maintain an updated index as content evolves.

**How it works:**
1. Scan the target directory for files and subdirectories
2. Group content by type, purpose, or location
3. Read each file to generate brief (3-10 word) descriptions based on actual content
4. Create or update index.md with organized listings using relative paths

**Output format:** A markdown index with sections for Files and Subdirectories, each entry containing a relative link and description.

---

## Adversarial Review (General)

**Performs a cynical, skeptical review of any content to identify issues and improvement opportunities.**

This task applies adversarial thinking to content review—approaching the material with the assumption that problems exist. It's designed to find what's missing, not just what's wrong, and produces at least ten specific findings. The reviewer adopts a professional but skeptical tone, looking for gaps, inconsistencies, oversights, and areas that need clarification.

**Use it when:** You need a critical eye on code diffs, specifications, user stories, documentation, or any artifact before finalizing. It's particularly valuable before merging code, releasing documentation, or considering a specification complete.

**How it works:**
1. Load the content to review (diff, branch, uncommitted changes, document, etc.)
2. Perform adversarial analysis with extreme skepticism—assume problems exist
3. Find at least ten issues to fix or improve
4. Output findings as a markdown list

**Note:** This task is designed to run in a separate subagent/process with read access to the project but no prior context, ensuring an unbiased review.

---

## Shard Document

**Splits large markdown documents into smaller, organized files based on level 2 (##) sections.**

Uses the `@kayvan/markdown-tree-parser` tool to automatically break down large documents into a folder structure. Each level 2 heading becomes a separate file, and an index.md is generated to tie everything together. This makes large documents more maintainable and allows for easier navigation and updates to individual sections.

**Use it when:** A markdown file has grown too large to effectively work with, or you want to break a monolithic document into manageable sections that can be edited independently.

**How it works:**
1. Confirm source document path and verify it's a markdown file
2. Determine destination folder (defaults to same location as source, folder named after document)
3. Execute the sharding command using npx @kayvan/markdown-tree-parser
4. Verify output files and index.md were created
5. Handle the original document—delete, move to archive, or keep with warning

**Handling the original:** After sharding, the task prompts you to delete, archive, or keep the original document. Deleting or archiving is recommended to avoid confusion and ensure updates happen in the sharded files only.
