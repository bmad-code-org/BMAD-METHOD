---
title: "Brownfield Development"
description: How to use BMad Method on existing codebases
---


How to effectively use BMad Method when working on existing projects and legacy codebases.

## What is Brownfield Development?

**Brownfield** refers to working on existing projects with established codebases and patterns, as opposed to **greenfield** which means starting from scratch with a clean slate.

This tutorial covers the essential workflow for onboarding to brownfield projects with BMad Method.

---

## Prerequisites

- BMad Method installed (`npx bmad-method install`)
- An existing codebase you want to work on
- Access to an AI-powered IDE (Claude Code, Cursor, or Windsurf)

---

## Step 1: Clean Up Completed Planning Artifacts

If you have completed all PRD epics and stories through the BMad process, clean up those files. Archive them, delete them, or rely on version history if needed. Do not keep these files in:

- `docs/`
- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

---

## Step 2: Maintain Quality Project Documentation

Your `docs/` folder should contain succinct, well-organized documentation that accurately represents your project:

- Intent and business rationale
- Business rules
- Architecture
- Any other relevant project information

For complex projects, consider using the `document-project` workflow. It offers runtime variants that will scan your entire project and document its actual current state.

---

## Step 3: Initialize for Brownfield Work

Run `workflow-init`. It should recognize you are in an existing project. If not, explicitly clarify that this is brownfield development for a new feature.

### Choosing Your Approach

You have two primary options depending on the scope of changes:

| Scope                          | Recommended Approach                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Small updates or additions** | Use `quick-flow-solo-dev` to create a tech-spec and implement the change. The full four-phase BMad method is likely overkill. |
| **Major changes or additions** | Start with the BMad method, applying as much or as little rigor as needed.                                                    |

### During PRD Creation

When creating a brief or jumping directly into the PRD, ensure the agent:

- Finds and analyzes your existing project documentation
- Reads the proper context about your current system

You can guide the agent explicitly, but the goal is to ensure the new feature integrates well with your existing system.

### UX Considerations

UX work is optional. The decision depends not on whether your project has a UX, but on:

- Whether you will be working on UX changes
- Whether significant new UX designs or patterns are needed

If your changes amount to simple updates to existing screens you are happy with, a full UX process is unnecessary.

### Architecture Considerations

When doing architecture, ensure the architect:

- Uses the proper documented files
- Scans the existing codebase

Pay close attention here to prevent reinventing the wheel or making decisions that misalign with your existing architecture.

---

## Next Steps

- **[Document Existing Project](../../how-to/brownfield/document-existing-project.md)** - How to document your brownfield codebase
- **[Add Feature to Existing Project](../../how-to/brownfield/add-feature-to-existing.md)** - Adding new functionality
- **[Quick Fix in Brownfield](../../how-to/brownfield/quick-fix-in-brownfield.md)** - Bug fixes and ad-hoc changes
- **[Brownfield FAQ](../../explanation/faq/brownfield-faq.md)** - Common questions about brownfield development

---

## Related Documentation

- [Quick Start Guide](../../tutorials/getting-started/getting-started-bmadv6.md) - Getting started with BMM
- [Quick Spec Flow](../../explanation/features/quick-flow.md) - Fast path for small changes
