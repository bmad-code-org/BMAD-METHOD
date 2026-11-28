---
title: 'Customize BMad'
description: Change how BMad agents, workflows, and documents behave using bmad-customize, without editing installed files.
sidebar:
  order: 1
---

You can tailor BMad so agents follow your organization's rules, workflows match your review depth, documents include your required sections, and multi-agent rooms use your own personas. Customizations live under `_bmad/custom/` beside BMad's defaults, so updates never overwrite your changes and you never edit installed skill files.

## Start with the BMad Agent or `bmad-customize`

Describe what you want changed in plain English inside your AI coding tool's chat. You can invoke `bmad-customize` directly, or ask the BMad Agent (`bmad`), which knows how to route your request to `bmad-customize` and apply it for you. It inspects your installed skills, chooses the right override file or document template, shows you the proposed change before writing, and verifies that the merged configuration includes your edit.

```text
Hey BMad, customize the build skill to always check our API compatibility rules when modifying endpoints, and ensure we are always in thorough review mode.
```

```text
/bmad-customize Add a Security Sign-off section to every PRD for the whole team.
```

Other everyday requests work the same way:

- "Hey BMad, tell Amelia to always check our internal component library before writing new UI primitives."
- "Hey BMad, make Mary always include a one-line risk summary when she creates a brief, just for me."
- "Hey BMad, set my personal writing voice guide at `~/.bmad/voice-bible.md` for facilitated documents."

`bmad-customize` handles agent behavior, workflow settings, and document templates end to end. You do not need to know which underlying skill or file owns a setting before asking.

:::note[Prerequisites]
You need BMad installed and set up in your project (see [Install BMad](../start/install-bmad.md)) plus [`uv`](https://docs.astral.sh/uv/) on your PATH so BMad can run its configuration scripts.
:::

## What You Can Customize

Every customization falls into one of four areas:

| What you want to change | How to do it | Examples |
| --- | --- | --- |
| **An agent's behavior** | Tell `bmad-customize` what to change on that agent | Change role focus, communication style, principles, standing facts, startup hooks, or custom menu shortcuts |
| **A workflow's settings** | Tell `bmad-customize` which workflow behavior to change | Raise `bmad-build` review depth to `thorough`, add `on_complete` publishing steps, or set `bmad-facilitate` defaults |
| **A document's structure or look** | Tell `bmad-customize` what a document should ask for, contain, or render | Add a required PRD section, change default facilitation mode, or set HTML view preferences |
| **Shared settings and custom casts** | Run `bmad setup` for shared project config, or ask `bmad-party-mode` / `bmad-customize` for custom discussion casts | Change your output folder, set a shared brand design system, or save a custom party cast |

## Team Scope vs. Personal Scope

Every customization can apply to the whole team or to you alone:

- Team overrides live in committed files such as `_bmad/custom/<skill>.toml` and `_bmad/custom/facilitate-templates/`, so anyone who pulls the repository inherits them automatically.
- Personal overrides live in gitignored files such as `_bmad/custom/<skill>.user.toml` and `~/.bmad/facilitate-templates/`, layering on top of team defaults for preferences only you want, such as tone, extra estimates, or a personal voice guide.

When `bmad-customize` writes an override, tell it whether the rule is for your team or just for you. To undo a customization, ask `bmad-customize` to remove it or delete the file from `_bmad/custom/`.

## Customizing Agents

Each named agent in [Meet the Agents](../agents/agents.md) has a fixed name and domain so prompts like "talk to Mary" or "ask Winston" stay predictable. Everything else about how the agent works is customizable through `bmad-customize`:

- Adjust the agent's role focus, communication style, principles, or icon.
- Give the agent persistent standing context, such as facts or file paths (for example, a compliance handbook or glossary) that load on every session.
- Add startup hooks to run extra steps before or after the agent greets you.
- Add custom menu shortcuts that launch one of your own skills or run a saved prompt (for example, adding a `COMPLIANCE` shortcut to John or replacing one of Sofia's shortcuts).

Changes to an agent apply whenever that agent is active. Changes to a single workflow (such as raising review depth in `bmad-build`) apply only to that workflow. If you are not sure whether a rule belongs on an agent or a workflow, ask `bmad-customize`; it explains the tradeoff and recommends the cleaner fit.

## Customizing Documents and Facilitated Workflows

Every structured document across BMad Method (Mary, John, Sally, and Winston), [Founder](../founder/founder.md) (Nadia), and [Creative](../creative/creative.md) (Clio) runs through one shared facilitation skill (`bmad-facilitate`) and a markdown template per document type.

- To change one document type (for example, adding a Support Readiness section to every PRD), tell `bmad-customize` what the document needs. It writes a small template extension in `_bmad/custom/facilitate-templates/` so future updates to the shipped template still reach you. See [Customize a Document for Your Team](./customize-a-document-for-your-team.md).
- To change settings across every facilitated document (such as default review standards, external handoffs, visuals, HTML views, or a personal voice guide), ask `bmad-customize` to update `bmad-facilitate`.
- To configure a project-wide brand or design system for HTML outputs, run `bmad setup` to set the core tools design system path.

## Customizing Multi-Agent Casts

Multi-agent features (`bmad-party-mode`, `bmad-forge-idea`, and `bmad-advanced-elicitation`, as well as team discussions that `bmad-retrospective` launches through `bmad-party-mode`) draw their default cast from the agents installed by your modules.

To build custom personas, themed casts, or reusable focus groups, ask `bmad-party-mode` to create or edit a party, or run `/bmad-customize bmad-party-mode` to manage custom members, saved groups, default party, and memory settings. See [Run Multi-Agent Discussions](./run-multi-agent-discussions.md) for examples.

## Shared Project Configuration

Shared project settings such as where BMad writes output, your active initiative, and module setup answers (such as your design system or Founder and Creative record folders) are managed by `bmad setup`. Ask the BMad Agent whenever you want to switch initiatives or change a setup answer.

## How Configuration Layers Work

If you want to understand how team overrides, personal overrides, and defaults layer and merge under `_bmad/custom/`, see [Configuration and Customization Reference](../reference/configuration.md). For team rollout patterns, see [Adopt BMad Across a Team](./adopt-bmad-across-a-team.md).
