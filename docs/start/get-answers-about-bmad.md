---
title: 'Get Answers About BMad'
description: Use the BMad Agent, the repository source, or the community to get quick, accurate answers about BMad.
---

Use the BMad Agent, the source repository, or the community to get answers, ordered from fastest to most thorough.

## 1. Ask the BMad Agent

The fastest way to get answers is inside your AI coding tool. [The BMad Agent](./the-bmad-agent.md) (`bmad`) is your advisor across every module you have installed: it reads your installed modules, inspects your active initiative and existing planning documents, coaches how to use BMad cohesively with any other skills in your tool, recommends what to do next, and routes to or runs skills for you when you ask.

```text
/bmad I have a SaaS idea and know all the features. Where do I start?
/bmad What are my options for UX design?
/bmad How does John handle updating an existing PRD?
Hey BMad, customize the build skill to always run thorough reviews for our team.
```

:::tip[Invoking the BMad Agent across tools]
Depending on your coding tool, invoke the BMad Agent with `/bmad`, `$bmad`, or plain `bmad` (or `"Hey BMad, ..."`) in chat. The same agent runs `/bmad setup`, checks installation health with `/bmad status`, migrates older project artifacts after a module upgrade, switches your active initiative, and launches or customizes skills on request.
:::

## 2. Go Deeper with the Source

The BMad Agent draws on your installed configuration and module help files. If you want to understand BMad's internals, check exact behavior, or explore BMad before installing it, point an agent-capable coding tool (such as Claude Code, Codex, or Cursor) directly at the [BMAD-METHOD repository](https://github.com/bmad-code-org/BMAD-METHOD).

:::note[Example]
**Question:** "Tell me the fastest way to build something with BMad."

**Answer:** Run `bmad-build`. Give it a plain description, an issue link, a specification, or a planned story; it inspects the codebase and picks the right amount of planning, implementation, and review for the change.
:::

Two habits produce much better answers when asking an AI tool about the source:

- Ask a concrete question such as "How does John handle updating an existing PRD?" rather than a broad question like "How do PRDs work?"
- Verify surprising claims by checking the referenced file directly or asking in the community forum.

### Not using an agent? Use the docs site

If you are using a web chat interface that cannot read local repository files, browse [the BMad docs site](https://docs.bmad-method.org/).

## 3. Ask the Community

If neither the `bmad` skill nor the repository source answered your question, bring what you found to the community:

| Channel | Use For |
| --- | --- |
| `help-requests` forum on [Discord](https://discord.gg/gk8jAdXWmj) | Troubleshooting and workflow questions |
| `#suggestions-feedback` on [Discord](https://discord.gg/gk8jAdXWmj) | Ideas and feature feedback |
| [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) | Reproducible bugs and enhancement proposals |
