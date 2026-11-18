---
title: 'Toolsmith'
description: 'What the Toolsmith module is and what you can build with it: agents with memory, domain experts, workflows, and modules, for yourself, your business, or your team.'
sidebar:
  order: 1
---

Toolsmith is the module for building your own skills, agents, and modules. Its agent, Smithy (`bmad-toolsmith`), builds one from a conversation about what you need. `bmad-eval` measures whether it works. What you build is not limited to software: it can be any job you can describe.

A skill is a folder with a `SKILL.md` file. Your AI tool reads the description in that file to decide when to load the skill, and the agent follows the rest of the file once it does. Everything Toolsmith builds starts from that folder, and it works in any tool that reads the open Agent Skills format.

## The Dream

What if your AI remembered everything? A fitness coach that remembers every PR. A writing partner that knows your characters better than you do. A research assistant that already knows how you work.

With Toolsmith you can build:

- **Personal companions:** agents with memory that know their owner and grow with them over time
- **Domain experts:** specialists for any field, such as legal, medical, finance, teaching, creative, or technical
- **Workflows:** structured processes that take you, or an agent working alone, through complex work the same way every time
- **Modules:** agents and workflows bundled together, to share with a team or publish for anyone

## What You Can Build

| Domain | Examples |
| --- | --- |
| **Personal** | A journal companion, a fitness coach that tracks every PR, a dream journal that learns your recurring symbols, a language tutor that knows which words you keep missing |
| **Creative** | A creative muse, a writing partner that knows your characters, a game master who remembers every character your party has met, a songwriting partner |
| **Business** | A marketing brief in your brand voice, a contract review against your legal team's checklist, a month-end close runbook, an executive coach who keeps you to your stated priorities |
| **Software** | A code coach, an architecture diagram reviewer, release notes from merged pull requests |
| **Any domain** | Anything you can describe as a job you repeat |

## Capture Your Own Work

Any job you do with an agent more than once can become a skill, whether it is marketing, legal, operations, research, teaching, or your own life outside work. You describe the job and Smithy asks for what is missing. You do not need to know how skills are built.

You do not even need to describe it. Smithy can read your session logs, find the requests you keep making and the corrections you keep giving, and propose a skill that already knows them. See [From Session Logs](approaches.md#from-session-logs).

When a person talks something through and a document comes out, such as an appraisal report or a patient intake, Smithy builds a document template that `bmad-facilitate` coaches anyone through.

## Agents That Know You

A memory agent meets you in a first conversation, keeps what it learns in a folder in your project, and wakes as the same self every session. It does not start over. It remembers your goals, your past work, and how you like to work, and it raises what it wants to follow up. You can hand it material to keep, teach it new capabilities, and let it work on a schedule while you are away.

The thirtieth session with a memory agent is different from the first, because it knows you. See [Agents with Memory](agents-with-memory.md).

## For Teams

A skill is a team's way of doing a job, written down so that every agent that loads it follows it. Toolsmith adds what a team needs to rely on one:

- **Change it per team without forking.** A `customize.toml` exposes what varies, and each team's overrides live in its own project, so they survive updates. A rendered skill lets a team replace rules inside its steps. See [Make a Skill Customizable](make-a-skill-customizable.md).
- **Version and update it from its source.** `bmad setup` compares each module's version with its source and offers the update.
- **Validate before install.** Smithy's validate mode reports what would stop a skill or module installing, loading, or firing.
- **Prove it works.** `bmad-eval` shows whether a skill beats the bare model on real cases, and whether its description fires on the right requests. See [Eval Runner](bmad-eval.md).

## Share It as a Module

A module is plain skills plus a small record. It installs with `npx skills add` from any Git repository, the same way as any other skill, so it needs no BMad installer and can be listed wherever Agent Skills are. The record lets `bmad` set the module up, recommend its skills, and check it for updates. See [Modules and Registration](modules.md#why-the-bmod-format).

## Install Toolsmith

Toolsmith installs from the BMAD-METHOD repository. If you do not have BMad yet, start with [Install BMad](../start/install-bmad.md). Then add the module from your project folder:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/toolsmith --skill '*'
```

This installs both Smithy and `bmad-eval`, which Smithy requires. Ask the `bmad` skill to run `bmad setup toolsmith`. The module asks no setup questions.

## Talk to Smithy

Start the `bmad-toolsmith` skill, or ask for Smithy by name, and say what you want. You do not need to know the shape of the result, or which mode to use. Asked what he does, Smithy answers in a few sentences and shows the codes below when you want them.

| Code | What it does |
| --- | --- |
| `BUILD` | Build a new skill, agent, or module from a conversation |
| `SCAFFOLD` | Lay out a skill you will write yourself |
| `LOGS` | Propose a skill from your session logs, then build it |
| `EDIT` | Change, fix, or extend a skill |
| `CONVERT` | Rebuild a skill, prompt, or command from another tool as a BMad skill |
| `REVIEW` | Review a skill and write a report of findings |
| `CUT` | Cut a skill's prose to what changes what the model does |
| `PACKAGE` | Package one skill or several into a module |
| `VALIDATE` | Check a skill or module for what would stop it installing, loading, or firing |
| `MIGRATE` | Convert an old-format module to the current format |
| `EVAL` | Run, benchmark, or trigger-test a skill with `bmad-eval` |

## How a Build Works

Every new skill follows the same path. If you use the scaffold approach to write the skill yourself, steps 3 and 4 are yours.

Smithy coaches by default. It helps you decide well, pushes back where an idea is thin, and aims for a tool that works for whoever uses its output. If you say you are in a hurry, or ask Smithy to work on its own, it takes the fast path: it confirms a plan instead of asking questions, and lists its judgment calls at the end.

1. **Discovery.** Smithy reads what you have already said and asks only for what is missing, one or two questions at a time.
2. **Smithy execution plan.** Smithy shows the name, purpose, description, shape, registration, approach, location, and files. Nothing is written until you approve it, and you can change any line. Smithy writes the approved plan to a `plan.md` in its reports folder, so a later session can pick it up.
3. **Build.** Smithy writes the skill, and tries it on a real input when you have one.
4. **Review.** Five review lenses read everything Smithy wrote. Smithy fixes the defects they find. It asks before it applies a finding that changes what the skill does or how it sounds; on the fast path it lists those instead. A small skill, one `SKILL.md` with no scripts and no `customize.toml`, gets only the leanness and trigger lenses, in one round.
5. **Hand-off.** Smithy validates the skill, offers a trigger eval, and tells you where the skill is and what to try first.

## In This Section

| Page | Read it when you want to |
| --- | --- |
| [Build Your First Skill](build-your-first-skill.md) | Go from an idea to a working skill, then a module |
| [Ways to Build a Skill](approaches.md) | Choose how a build runs |
| [Shapes of a Skill](shapes.md) | See what Smithy can make |
| [Work on an Existing Skill](modes.md) | Edit, convert, review, cut, package, or validate a skill |
| [Write a Good Skill](write-a-good-skill.md) | Learn the standard Smithy writes to and reviews against |
| [Subagent Patterns](subagent-patterns.md) | Spread a skill's work across subagents |
| [Make a Skill Customizable](make-a-skill-customizable.md) | Let teams change a skill without forking it |
| [Agents with Memory](agents-with-memory.md) | Build an agent that remembers you between sessions |
| [Modules and Registration](modules.md) | Decide how a skill registers with BMad |
| [Distribute Your Module](distribute-your-module.md) | Publish a module so others can install it |
| [Migrate an Old Module](migrate-an-old-module.md) | Bring a `module.yaml` module to the current format |
| [Eval Runner](bmad-eval.md) | Measure whether a skill works |

The exact file formats are in [Module Files](../reference/module-files.md) and [Eval Format](../reference/eval-format.md).
