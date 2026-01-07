---
title: "How to Document an Existing Project"
description: How to document an existing brownfield codebase using BMad Method
---


Use the `document-project` workflow to scan your entire codebase and generate comprehensive documentation about its current state.

---

## When to Use This

- Starting work on an undocumented legacy project
- Documentation is outdated and needs refresh
- AI agents need context about existing code patterns
- Onboarding new team members

---

## Prerequisites

- BMad Method installed in your project
- Access to the codebase you want to document

---

## Steps

### 1. Load the Analyst Agent

Start a fresh chat and load the Analyst agent.

### 2. Run the document-project Workflow

Tell the agent:

```
Run the document-project workflow
```

### 3. Let the Agent Scan Your Codebase

The workflow will:

- Scan your codebase structure
- Identify architecture patterns
- Document the technology stack
- Create reference documentation
- Generate a PRD-like document from existing code

### 4. Review the Generated Documentation

The output will be saved to `project-documentation-{date}.md` in your output folder.

Review the documentation for:

- Accuracy of detected patterns
- Completeness of architecture description
- Any missing business rules or intent

---

## What You Get

- **Project overview** - High-level description of what the project does
- **Technology stack** - Detected frameworks, libraries, and tools
- **Architecture patterns** - Code organization and design patterns found
- **Business rules** - Logic extracted from the codebase
- **Integration points** - External APIs and services

---

## Tips

- Run this before any major brownfield work
- Keep the documentation updated as the project evolves
- Use it as input for future PRD creation

---

## Related

- [Brownfield Development Guide](./index.md)
- [Add Feature to Existing Project](./add-feature-to-existing.md)
