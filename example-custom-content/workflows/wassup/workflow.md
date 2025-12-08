---
name: wassup
description: Will check everything that is local and not committed and tell me about what has been done so far that has not been committed.
web_bundle: true
---

# Wassup Workflow

**Goal:** To think about all local changes and tell me what we have done but not yet committed so far.

## Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** read partial unchanged files and assume you know all the details
- 📖 **ALWAYS** read entire files with uncommited changes to understand the full scope.
- 🚫 **NEVER** assume you know what changed just by looking at a file name

---

## INITIALIZATION SEQUENCE

- 1. Find all uncommitted changed files
- 2. Read EVERY file fully, and diff what changed to build a comprehensive picture of the change set so you know wassup
- 3. If you need more context read other files as needed.
- 4. Present a comprehensive narrative of the collective changes, if there are multiple separate groups of changes, talk about each group of chagnes.
- 5. Ask the user at least 2-3 clarifying questions to add further context.
- 6. Suggest a commit message and offer to commit the changes thus far.
