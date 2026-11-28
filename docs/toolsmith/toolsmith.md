---
title: 'Toolsmith'
description: 'Build your own BMad skills, agents, document templates, and shareable modules with Smithy (bmad-toolsmith) and verify them with bmad-eval.'
sidebar:
  order: 1
---

Toolsmith is the BMad module for building your own skills, agents, document templates, and shareable modules. **Smithy, the Toolsmith** (`bmad-toolsmith`), helps you turn any repeatable workflow or domain expertise into a working tool through conversation, and `bmad-eval` measures whether it actually works. You are not limited to software engineering: anything you can explain as a repeatable job can become a skill.

A skill is a folder with a `SKILL.md` file. Your AI tool reads the short description at the top of that file to decide when to load the skill, and then follows the instructions inside. Everything Smithy builds uses the open Agent Skills format, so it works across compatible AI coding tools. Real modules such as [Founder](../founder/founder.md) and [Creative](../creative/creative.md) are built on the exact same module structure.

## What You Can Build

Toolsmith builds four kinds of tools, from personal assistants to team-wide modules:

- Personal companions with memory that remember your history, goals, and preferences across sessions rather than starting from scratch every chat (see [Agents with Memory](agents-with-memory.md)).
- Domain specialists focused on fields such as legal review, finance, operations, teaching, writing, or software engineering.
- Repeatable workflows and coached document templates that guide anyone through complex work the same way every time.
- Shareable modules that package related skills and agents together so a team or the public can install and update them from any Git repository.

| Domain | Examples |
| --- | --- |
| **Personal** | A journal companion, a fitness coach that tracks every personal record, a language tutor that drills words you keep missing |
| **Creative** | A writing partner that tracks your characters and arcs, a tabletop game master who remembers every NPC, a songwriting collaborator |
| **Business** | A marketing brief writer in your brand voice, a contract reviewer against your legal checklist, a month-end close runbook, an executive coach |
| **Software** | A code coach, an architecture diagram reviewer, a release-notes generator from merged pull requests |
| **Any domain** | Any repeatable job where you keep retyping the same rules, format, or corrections |

## Capture Work You Already Do

Any job you do with an AI tool more than once can become a skill, without needing to study skill file formats first. Describe what you want in plain English and Smithy asks only for what is missing.

If you are not sure how to describe the job, Smithy can also read your recent session logs, spot the requests you keep making and the corrections you keep giving, and propose a skill that already bakes those lessons in. See [From Session Logs](approaches.md#from-session-logs).

## Built for Teams and Sharing

When a skill needs to work for a whole team rather than just one person, Toolsmith helps you build it to last:

- Let teams tailor output paths, rules, or templates in their own project without forking your skill. See [Make a Skill Customizable](make-a-skill-customizable.md).
- Package one skill or several as a BMad module so `bmad` sets it up, recommends it, and checks its Git source for updates. See [Modules and Registration](modules.md).
- Validate skills and modules before sharing so broken paths, bad metadata, or missing records are caught early. See [Work on an Existing Skill](modes.md).
- Measure whether a skill actually beats the bare model on real tasks and fires on the right user prompts. See [Eval Runner](bmad-eval.md).

## Install Toolsmith

If you have not installed BMad yet, start with [How to Install BMad](../start/install-bmad.md). Then add Toolsmith from your project folder:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/toolsmith --skill '*'
```

This installs both Smithy (`bmad-toolsmith`) and the eval runner (`bmad-eval`). Open your AI tool and ask the `bmad` skill to run `bmad setup toolsmith`.

## Talk to Smithy

Call Smithy with `/bmad-toolsmith` in tools that support slash commands (such as Claude Code), or speak to him directly in plain English in any tool. You do not need to memorize commands, shapes, or modes ahead of time. Ask `"Smithy, what can you help me with?"` anytime for a short overview.

:::note[Ways to start]
```text
/bmad-toolsmith Build a skill that turns merged pull requests since the last tag into customer-facing release notes.
```

```text
Hey Smithy, look at my recent sessions and propose a skill for the review checks I keep asking for.
```

```text
Hey Smithy, review my custom skill at skills/acme-release-notes and tell me what to tighten up.
```
:::

## How Smithy Builds a Skill

Every new skill follows the same five-stage path on both the coached path and the fast path.

![How Smithy builds a skill](/diagrams/toolsmith-build-path.svg)

Smithy coaches by default: he helps you sharpen the goal, pushes back when an idea is vague, and makes sure the output works for whoever will use it. If you tell him you are in a hurry or ask him to work on his own, he switches to the fast path, confirming one plan up front and listing his judgment calls at the end.

1. During discovery, Smithy reads what you already shared and asks only for what is missing, one or two questions at a time.
2. In the execution plan, Smithy shows the skill name, purpose, trigger description, shape, registration, approach, and files; nothing is written until you approve, and he saves the approved plan to his reports folder so a later session can pick up cleanly.
3. During the build stage, Smithy writes the skill and tries it on a real example when you have one.
4. During review, Smithy runs automated checks and focused review lenses over what he wrote, fixes clear defects, and asks before applying any change that alters behavior or tone.
5. At hand-off, Smithy validates the finished skill, offers a trigger test to confirm it loads on the right prompts, and tells you where the files live and what to try first.

## Tailoring Smithy

To change where Smithy writes new skills, where review reports and build plans land, or to give him your team's standing skill-authoring rules, invoke `bmad-customize` and describe what you want changed for `bmad-toolsmith`.

## In This Section

| Page | Read it when you want to |
| --- | --- |
| [Build Your First Skill](build-your-first-skill.md) | Walk through building one skill and growing it into a module |
| [Ways to Build a Skill](approaches.md) | Choose between lean builds, scaffolding, eval-driven loops, or mining session logs |
| [Shapes of a Skill](shapes.md) | See the kinds of skills, agents, utilities, and templates Smithy can build |
| [Work on an Existing Skill](modes.md) | Edit, convert, review, cut, package, or validate a skill |
| [Write a Good Skill](write-a-good-skill.md) | Learn the authoring standard Smithy writes to and reviews against |
| [Subagent Patterns](subagent-patterns.md) | Spread heavy skill work across parallel subagents |
| [Make a Skill Customizable](make-a-skill-customizable.md) | Let teams adapt your skill without forking it |
| [Agents with Memory](agents-with-memory.md) | Build an agent that keeps persistent memory between sessions |
| [Modules and Registration](modules.md) | Decide how skills register and organize inside BMad modules |
| [Distribute Your Module](distribute-your-module.md) | Publish a module from a Git repository for others to install |
| [Migrate an Old Module](migrate-an-old-module.md) | Bring an older `module.yaml` module to the current format |
| [Eval Runner](bmad-eval.md) | Measure quality, baseline lift, and trigger accuracy with `bmad-eval` |

For exact file schemas, see [Module Files](../reference/module-files.md) and [Eval Format](../reference/eval-format.md).
