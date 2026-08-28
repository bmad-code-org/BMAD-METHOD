---
title: 'Established Projects'
description: How to use BMad Method on existing codebases
sidebar:
  order: 4
---

Use BMad Method effectively when working on existing projects and legacy codebases.

This guide covers the essential workflow for onboarding to existing projects with BMad Method.

:::note[Prerequisites]

- BMad Method installed (`npx bmad-method install`)
- An existing codebase you want to work on
- Access to an AI-powered IDE (Claude Code or Cursor)
  :::

## Step 1: Clean Up Completed Planning Artifacts

If you have completed all PRD epics and stories through the BMad process, clean up those files. Archive them, delete them, or rely on version history if needed. Do not keep these files in:

- `docs/`
- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

## Step 2: Create Project Context

:::tip[Recommended for Existing Projects]
Build your project's context system so AI agents follow your established practices when implementing changes — this is the brownfield on-ramp.
:::

Run the project context skill:

```bash
bmad-project-context
```

It reads what you already have and tells you how it measures up, asks what rules you want followed, then discovers and verifies the rest — running every command before writing it down. You end up with a small verified block in your repo's `AGENTS.md` instead of generated documentation volume. An existing hand-written file is a baseline it improves; a bloated `docs/` folder is a source to verify against code, not something to add to.

[Learn more about project context](../explanation/project-context.md)

## Step 3: Maintain Quality Project Documentation

Your `docs/` folder should contain succinct, well-organized documentation that accurately represents your project:

- Intent and business rationale
- Business rules
- Architecture
- Any other relevant project information

`bmad-project-context` audits and maintains the agent-facing part of this — run its audit any time the context feels stale; it shrinks and re-verifies rather than accreting. (The earlier `bmad-document-project` workflow is deprecated and forwards there.)

## Step 3: Get Help

### BMad-Help: Your Starting Point

**Run `bmad-help` anytime you're unsure what to do next.** This intelligent guide:

- Inspects your project to see what's already been done
- Shows options based on your installed modules
- Understands natural language queries

```
bmad-help I have an existing Rails app, where should I start?
bmad-help How much planning does this change need before implementation?
bmad-help Show me what workflows are available
```

BMad-Help also **automatically runs at the end of every workflow**, providing clear guidance on exactly what to do next.

### Choose Planning Depth

All implementation uses `bmad-build`; scope determines what context you prepare first:

| Scope | Recommended preparation |
| --- | --- |
| **Clear updates or additions** | Enter `bmad-build` directly with the request, issue, or existing spec. |
| **Major changes or additions** | Prepare the useful PRD, UX, architecture, epic, story, readiness, and sprint context, then pass the selected work to `bmad-build`. |

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

## More Information

- **[Build a Change](../build/build-a-change.md)** - Attended implementation for a request, issue, spec, or story
- **[Established Projects FAQ](../explanation/established-projects-faq.md)** - Common questions about working on established projects
