---
title: 'Modules and Registration'
description: 'What a BMad module is, what registering a skill gives you, the three ways a skill can register, and when to use configuration or customization.'
sidebar:
  order: 10
---

A module is a set of skills that belong together, with a record that tells the `bmad` skill about them. Registering a skill with a module is what lets BMad set it up, recommend it, and check it for updates. This page explains the choices. The exact keys are in [Module Files](../reference/module-files.md).

## What Registering Gives You

| With a record | Without one |
| --- | --- |
| `bmad setup <code>` asks the skill's questions | Setup never sees the skill |
| The `bmad` skill recommends it from help | Help does not know it exists |
| Update checks follow its source | You update it yourself |
| Other skills can require it at a minimum version | Other skills can require it by name only |

A skill with no record still works, and it can still read BMad config and customization.

## Three Ways to Register

Smithy asks whether a skill is part of a module and whether more are planned, then puts the answer in the execution plan.

| Registration | What it is | Use it when |
| --- | --- | --- |
| Single-skill module | One folder is both the skill and its record | The default for one skill |
| Member of a module | A small `bmod.toml` names the record, and the record lists the skill | You are building or expanding that module |
| Plain skill | No `bmod.toml` | You want no record, or the project has no `_bmad/` folder |

A planned module of several skills starts as a single-skill module under its code and prefix, so nothing is renamed later. Smithy moves the record to a `bmod-<code>` folder when the second skill arrives, either when you package the skills or when you build the second one into the module. Smithy never writes a record folder for one skill.

A plain skill can register later: [convert mode](modes.md#convert) adds a record to one skill, and [package mode](modes.md#package) wraps several.

## What a Module Holds

**A single-skill module** keeps everything in the skill's folder. Its `bmod.toml` has a `[bmod]` table and an empty `[skill]` table, and a `help/help.md` sits beside it. A skill with nothing to ask has no configuration questions.

**A multi-skill module** has a record folder, `bmod-<code>`, beside the skills it ships.

| In the record | Purpose |
| --- | --- |
| `SKILL.md` | Tells anyone who opens it to run `bmad setup <code>`, and does nothing else |
| `bmod.toml` | Code, version, source, members, dependencies, questions, and install messages |
| `help/help.md` | What the `bmad` skill reads to guide users, with optional topic files |
| `roster.toml` | The module's agents, so `bmad` and party mode know who is available |
| `retired.toml` | Skills renamed or removed, so setup can clean up |

Each member has its own small `bmod.toml` that names the record and its source, and lists what that skill alone requires. A skill belongs to one module. A skill it uses from another module is a dependency, not a member.

## Name Skills and Modules

Skills carry the module's code as a prefix: `acme-release-notes`, and agents `acme-agent-scout`. `bmad` finds a module by its `[bmod]` table, and validation requires a multi-skill record folder to be `bmod-<code>`. The code is the configuration namespace and what users type in `bmad setup <code>`.

A prefix of your own tells your skills from BMad's, keeps a module's skills together in listings, and lets you group them in traces and usage reports. Reserve `bmad-` for skills shipped by the bmad-code-org. A custom skill named `bmad-` reads as official, and it could collide with a future core skill.

## Configuration or Customization

Modules offer two ways to change behavior, and they answer different questions.

| | Configuration | Customization |
| --- | --- | --- |
| Answers | What does this project need to tell the module? | How should this skill behave differently here? |
| Defined in | `[[bmod.config_questions]]` in the record | `customize.toml` in each skill |
| Set by | `bmad setup <code>` | `bmad-customize` |
| Read as | `modules.<code>.<key>` with `resolve_config.py` | `{workflow.<key>}` or `{agent.<key>}` after `resolve_customization.py` |
| Example | A shared path every member reads | An activation step for one skill |

Use a configuration question for a value several skills read the same way. It is asked once, and every member reads the answer. Skip the question when a good default will do, because every question is a cost at setup. See [Make a Skill Customizable](make-a-skill-customizable.md) for the other side.

A `scope = "user"` question is a personal preference and is not committed. A path the team shares stays team scope.

## Write the Help

`help/help.md` has one reader: the `bmad` skill, answering a user. Write what each skill gives, when to recommend it, and what to offer next. Leave out what `bmad` cannot act on, such as install mechanics and manifest keys.

Add a `help/<topic>.md` for depth, and name it in `help.md` with when to read it. A topic that `help.md` does not name is never read.

## Depend on Other Skills

Use `required_skills` for a skill yours invokes, and `recommended_skills` for one that helps beside it. A plain name is a skill from the same source, and a table names one from elsewhere. Module-wide needs go in the record, and one member's needs go in its own file. Smithy asks during a build, and names anything you need to install.

## Add to the BMad Method

Two different things are often called this.

- **Contribute to the method.** Open a pull request to the BMAD-METHOD repository. The skill lives under `skills/`, takes a `bmad-` name, and its `bmod.toml` names `bmod-method`.
- **Extend the method in your project.** Make your own module with your own prefix, whose skills require or recommend the method skills they build on. Do not edit the installed method record, because the next update overwrites it.

Build any change to an installed module in its source repository for the same reason.
