---
title: "Brownfield Development FAQ"
description: Common questions about brownfield development in the BMad Method
---
Quick answers to common questions about brownfield (existing codebase) development in the BMad Method (BMM).

## Questions

- [What is brownfield vs greenfield?](#what-is-brownfield-vs-greenfield)
- [Do I have to run document-project for brownfield?](#do-i-have-to-run-document-project-for-brownfield)
- [What if I forget to run document-project?](#what-if-i-forget-to-run-document-project)
- [Can I use Quick Spec Flow for brownfield projects?](#can-i-use-quick-spec-flow-for-brownfield-projects)
- [How does workflow-init handle old planning docs?](#how-does-workflow-init-handle-old-planning-docs)
- [What if my existing code doesn't follow best practices?](#what-if-my-existing-code-doesnt-follow-best-practices)

### What is brownfield vs greenfield?

- **Greenfield** — New project, starting from scratch, clean slate
- **Brownfield** — Existing project, working with established codebase and patterns

### Do I have to run document-project for brownfield?

Highly recommended, especially if:

- No existing documentation
- Documentation is outdated
- AI agents need context about existing code
- Level 2-4 complexity

You can skip it if you have comprehensive, up-to-date documentation including `docs/index.md`.

### What if I forget to run document-project?

Workflows will lack context about existing code. You may get:

- Suggestions that don't match existing patterns
- Integration approaches that miss existing APIs
- Architecture that conflicts with current structure

Run document-project and restart planning with proper context.

### Can I use Quick Spec Flow for brownfield projects?

Yes! Quick Spec Flow works great for brownfield. It will:

- Auto-detect your existing stack
- Analyze brownfield code patterns
- Detect conventions and ask for confirmation
- Generate context-rich tech-spec that respects existing code

Perfect for bug fixes and small features in existing codebases.

### How does workflow-init handle old planning docs?

workflow-init asks about YOUR current work first, then uses old artifacts as context:

1. Shows what it found (old PRD, epics, etc.)
2. Asks: "Is this work in progress, previous effort, or proposed work?"
3. If previous effort: Asks you to describe your NEW work
4. Determines level based on YOUR work, not old artifacts

This prevents old Level 3 PRDs from forcing Level 3 workflow for a new Level 0 bug fix.

### What if my existing code doesn't follow best practices?

Quick Spec Flow detects your conventions and asks: "Should I follow these existing conventions?" You decide:

- **Yes** → Maintain consistency with current codebase
- **No** → Establish new standards (document why in tech-spec)

BMM respects your choice — it won't force modernization, but it will offer it.

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
