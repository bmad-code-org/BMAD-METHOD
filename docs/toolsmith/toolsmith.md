---
title: 'Toolsmith'
description: 'What the Toolsmith module is: one agent, Smithy, that builds skills, agents, and modules for BMad, and an eval runner beside it.'
sidebar:
  order: 1
---

Toolsmith is the module for authoring BMad content. Its agent, Smithy (`bmad-toolsmith`), builds a skill, an agent, or a module from a conversation about what you need. `bmad-eval` measures whether a skill works. Use Toolsmith when you want an agent to do a job the same way every time, and when you want to share that job with a team or publish it.

A skill is a folder with a `SKILL.md` file. Your coding tool reads the description in that file to decide when to load the skill, and the agent follows the rest of the file once it does. Everything Toolsmith builds starts from that folder.

## Install Toolsmith

Toolsmith installs from the BMAD-METHOD repository. If you do not have BMad yet, start with [Install BMad](../start/install-bmad.md). Then add the module from your project folder:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill bmad-toolsmith --skill bmad-eval --skill bmod-toolsmith
```

Ask the `bmad` skill to run `bmad setup toolsmith`. The module asks no setup questions.

## Talk to Smithy

Start the `bmad-toolsmith` skill, or ask for Smithy by name, and say what you want. You do not need to know the shape of the result, or which mode to use. Smithy shows a menu when you give no request.

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

1. **Discovery.** Smithy reads what you have already said and asks only for what is missing, one or two questions at a time.
2. **Smithy execution plan.** Smithy shows the name, purpose, description, shape, registration, approach, location, and files. Nothing is written until you approve it, and you can change any line.
3. **Build.** Smithy writes the skill, and tries it on a real input when you have one.
4. **Review.** Five review lenses read everything Smithy wrote. Smithy fixes the defects they find and tells you what changed.
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
