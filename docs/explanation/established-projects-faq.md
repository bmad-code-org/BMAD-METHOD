---
title: "Established Projects FAQ"
description: Common questions about using BMad Method on established projects
sidebar:
  order: 12
---
Quick answers to common questions about working on established projects with the BMad Method (BMM).

## Questions

- [Do I have to run document-project first?](#do-i-have-to-run-document-project-first)
- [What if I forget to run document-project?](#what-if-i-forget-to-run-document-project)
- [How does implementation work in established projects?](#how-does-implementation-work-in-established-projects)
- [What if my existing code doesn't follow best practices?](#what-if-my-existing-code-doesnt-follow-best-practices)

### Do I have to run document-project first?

`bmad-document-project` is deprecated — its replacement is [`bmad-project-context`](project-context.md), which writes a small verified block into your repo's `AGENTS.md` instead of generated documentation. Running it first is highly recommended, especially if:

- No existing documentation
- Documentation is outdated
- AI agents need context about existing code

You can skip it if your repo already has maintained agent instructions, or you'll use other tools or techniques to aid discovery for the agent to build on an existing system.

### What if I forget to run document-project?

Don't worry about it — run `bmad-project-context` at any time. Its refresh and audit intents also keep the context true during and after a project, and it treats any docs you already generated as sources to verify.

### How does implementation work in established projects?

Run `bmad-build`, just as you would for new development. It will:

- Auto-detect your existing stack
- Analyze existing code patterns
- Detect conventions and ask for confirmation
- Generate context-rich spec that respects existing code

You can enter directly for a clear change or provide a planned story and its upstream artifacts for larger work.

### What if my existing code doesn't follow best practices?

Build detects your conventions and asks: "Should I follow these existing conventions?" You decide:

- **Yes** → Maintain consistency with current codebase
- **No** → Establish new standards (document why in spec)

BMM respects your choice — it won't force modernization, but it will offer it.

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
