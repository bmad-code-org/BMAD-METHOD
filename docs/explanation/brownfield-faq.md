---
title: "Brownfield Development FAQ"
description: Common questions about brownfield development in the BMad Method
---
Quick answers to common questions about brownfield (existing codebase) development in the BMad Method (BMM).

## Questions

- [Questions](#questions)
  - [What is brownfield vs greenfield?](#what-is-brownfield-vs-greenfield)
  - [Do I have to run document-project for brownfield?](#do-i-have-to-run-document-project-for-brownfield)
  - [What if I forget to run document-project?](#what-if-i-forget-to-run-document-project)
  - [Can I use Quick Spec Flow for brownfield projects?](#can-i-use-quick-spec-flow-for-brownfield-projects)
  - [What if my existing code doesn't follow best practices?](#what-if-my-existing-code-doesnt-follow-best-practices)

### What is brownfield vs greenfield?

- **Greenfield** — New project, starting from scratch, clean slate
- **Brownfield** — Existing project, working with established codebase and patterns

### Do I have to run document-project for brownfield?

Highly recommended, especially if:

- No existing documentation
- Documentation is outdated
- AI agents need context about existing code

You can skip it if you have comprehensive, up-to-date documentation including `docs/index.md` or will use other tools or techniques to aid in discovery for the agent to build on an existing system.

### What if I forget to run document-project?

Don't worry about it - you can do it at any time. You can even do it during or after a project to help keep docs up to date.

### Can I use Quick Spec Flow for brownfield projects?

Yes! Quick Spec Flow works great for brownfield. It will:

- Auto-detect your existing stack
- Analyze brownfield code patterns
- Detect conventions and ask for confirmation
- Generate context-rich tech-spec that respects existing code

Perfect for bug fixes and small features in existing codebases.

### What if my existing code doesn't follow best practices?

Quick Spec Flow detects your conventions and asks: "Should I follow these existing conventions?" You decide:

- **Yes** → Maintain consistency with current codebase
- **No** → Establish new standards (document why in tech-spec)

BMM respects your choice — it won't force modernization, but it will offer it.

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
