---
title: 'Modules and Registration'
description: 'What a BMad module is, why the bmod format installs anywhere skills do, what registering gives you, how to design a module, and when to use configuration or customization.'
sidebar:
  order: 10
---

A module is a set of skills that belong together, with a record that tells the `bmad` skill about them. The format is called bmod, after the `bmod.toml` file that holds the record. Registering a skill with a module is what lets BMad set it up, recommend it, and check it for updates. This page explains the choices. The exact keys are in [Module Files](../reference/module-files.md).

## Why the bmod Format

A module is plain skills plus a small record, and the record is itself a skill folder. Nothing in it needs a BMad installer, so a module travels the way any Agent Skills repository does:

- **It installs with `npx skills add`** from GitHub, from any other Git URL, or from a local folder, into every AI tool the user picks. The record is one more skill folder, added beside the others.
- **It can be listed in skill marketplaces.** A public repository appears on [skills.sh](https://skills.sh/) once people install it with the Skills CLI, and it can be listed in other Agent Skills marketplaces like any skill repository. A module that ships inside a plugin sets `update_source = "plugin:<name>"`, and `bmad` leaves its updates to that plugin's marketplace.
- **A single-skill module is one folder.** The skill, its record, and its help sit together, so the folder installs on its own with nothing else to fetch. It needs the `bmad` skill to ask its setup questions and read the answers.

Once the skills are installed, `bmad setup <code>` reads the record where it sits. Nothing is merged into a shared file, so an update to the module updates its record too.

The v6 format worked differently:

| | v6 module | bmod |
| --- | --- | --- |
| Install | The BMad installer | `npx skills add`, the same as any skill |
| Setup | A `<code>-setup` skill in each module | `bmad setup <code>` for every module |
| Configuration | `module.yaml`, with answers merged into `_bmad/config.yaml` | Questions in `bmod.toml`, read as `modules.<code>.<key>` |
| Help | `module-help.csv`, merged into `_bmad/module-help.csv` | `help/help.md`, read where it is installed |
| Distribution | A `.claude-plugin/marketplace.json` listing the skills | A Git repository with a `skills/` folder, and no manifest |

To convert a v6 module, see [Migrate an Old Module](migrate-an-old-module.md).

## What Registering Gives You

| With a record | Without one |
| --- | --- |
| `bmad setup <code>` asks the skill's questions once, and every member of the module reads the answers | Setup never sees the skill |
| The `bmad` skill recommends it from help | Help does not know it exists |
| Update checks follow its source | You update it yourself |
| Other skills can require or recommend it at a minimum version, and setup reports what is missing or too old | Other skills can require it by name only |
| `retired.toml` lets setup clean up a renamed or removed skill, and move its customizations to the new name | Old copies stay until someone deletes them |
| `roster.toml` makes its agents known to `bmad` and party mode | Party mode leaves the agent out of its default room |

A skill with no record still works, and it can still read BMad config and customization.

## Three Ways to Register

Smithy asks whether a skill is part of a module and whether more are planned, then puts the answer in the execution plan.

| Registration | What it is | Use it when |
| --- | --- | --- |
| Single-skill module | One folder is both the skill and its record | The default for one skill |
| Member of a module | A small `bmod.toml` names the record, and the record lists the skill | You are building or expanding that module |
| Plain skill | No `bmod.toml` | You want no record, or the project has no `_bmad/` folder |

When you describe several skills that ship together, Smithy settles a module plan in discovery before it builds any of them: the code and folder, each member with its shape, the configuration questions the members share, the roster of agents, and the build order. Smithy records the plan, then builds the members one at a time, each with its own execution plan. The first member writes the `bmod-<code>` record, and each later member joins it.

If you build one skill and only expect more later, it starts as a single-skill module under the planned code and prefix, so nothing is renamed later. Smithy moves the record to a `bmod-<code>` folder when the second skill arrives, either when you package the skills or when you build the second one into the module.

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

## Design a Module

Before you split a domain into skills, decide how many agents it needs and what they share.

### One Agent or Several

Many people start with a set of single-purpose agents. Consider one agent with a rich menu of capabilities first. One agent keeps the whole context of the work, has one memory of its owner, and gives the user one place to go. A dream journal that logs dreams, interprets them, finds patterns, and coaches lucid dreaming is one agent, not four.

Split into several agents when the capabilities serve different people or different journeys, or when the user wants several voices in the room. Each agent should do its own job without the others, even if that means some duplication: a podcast expert that can run a whole session alone is better than one that needs the blog expert present.

Plain skills fit beside agents. A job with one output and no persona stays a skill, and an agent's menu item can run it.

### Agents That Share What They Know

Each memory agent keeps its own memory, but agents in one module can share what they learn through a folder they all reach. Take a content module with a podcast expert, a short-video expert, and a blog expert. Each remembers its own work with you: episode topics, video formats, blog themes. All three also need your brand voice, your audience, and the phrases you use. One agent owns a `brand/` folder as a writable area of its dominion, and the others list the same folder as a read area. See [Dominion](agents-with-memory.md#dominion).

A module can also define a group in `roster.toml`, so its agents meet together in party mode. A group with `memory = true` remembers its past sessions with you.

### Modules That Extend Another

A module can add to another one, such as a module of extra review skills for the BMad Method. List the skills it invokes in `required_skills`, and the ones that help beside it in `recommended_skills`. Prefer recommending: a module that still does useful work when the other is absent is easier to adopt. See [Depend on Other Skills](#depend-on-other-skills).

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

`help.md` loads on every help question for every installed module, so keep it a short index. Add a `help/<topic>.md` for depth, and name it in `help.md` with when to read it. A topic that `help.md` does not name is never read.

## Depend on Other Skills

Use `required_skills` for a skill yours invokes, and `recommended_skills` for one that helps beside it. A plain name is a skill from the same source, and a table names one from elsewhere. Module-wide needs go in the record, and one member's needs go in its own file. Smithy asks during a build, and names anything you need to install.

## Add to the BMad Method

Two different things are often called this.

- **Contribute to the method.** Open a pull request to the BMAD-METHOD repository. The skill lives under `skills/method/`, takes a `bmad-` name, and its `bmod.toml` names `bmod-method`.
- **Extend the method in your project.** Make your own module with your own prefix, whose skills require or recommend the method skills they build on. Do not edit the installed method record, because the next update overwrites it.

Build any change to an installed module in its source repository for the same reason.
