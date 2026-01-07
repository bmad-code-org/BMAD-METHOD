---
title: "Getting Started FAQ"
description: Common questions about getting started with the BMad Method
---


Quick answers to common questions about getting started with the BMad Method.

---

## Q: Do I always need to run workflow-init?

**A:** No, once you learn the flow you can go directly to workflows. However, workflow-init is helpful because it:

- Determines your project's appropriate level automatically
- Creates the tracking status file
- Routes you to the correct starting workflow

For experienced users: use the [Quick Start Guide](../../tutorials/getting-started/getting-started-bmadv6.md) to go directly to the right agent/workflow.

## Q: Why do I need fresh chats for each workflow?

**A:** Context-intensive workflows (like brainstorming, PRD creation, architecture design) can cause AI hallucinations if run in sequence within the same chat. Starting fresh ensures the agent has maximum context capacity for each workflow. This is particularly important for:

- Planning workflows (PRD, architecture)
- Analysis workflows (brainstorming, research)
- Complex story implementation

Quick workflows like status checks can reuse chats safely.

## Q: Can I skip workflow-status and just start working?

**A:** Yes, if you already know your project level and which workflow comes next. workflow-status is mainly useful for:

- New projects (guides initial setup)
- When you're unsure what to do next
- After breaks in work (reminds you where you left off)
- Checking overall progress

## Q: What's the minimum I need to get started?

**A:** For the fastest path:

1. Install BMad Method: `npx bmad-method@alpha install`
2. For small changes: Load PM agent → run tech-spec → implement
3. For larger projects: Load PM agent → run prd → architect → implement

## Q: How do I know if I'm in Phase 1, 2, 3, or 4?

**A:** Check your `bmm-workflow-status.md` file (created by workflow-init). It shows your current phase and progress. If you don't have this file, you can also tell by what you're working on:

- **Phase 1** - Brainstorming, research, product brief (optional)
- **Phase 2** - Creating either a PRD or tech-spec (always required)
- **Phase 3** - Architecture design (Level 2-4 only)
- **Phase 4** - Actually writing code, implementing stories

---

## Related Documentation

- [Quick Start Guide](../../tutorials/getting-started/getting-started-bmadv6.md) - Get started with BMM
- [Glossary](../../reference/glossary/index.md) - Terminology reference

---

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!
