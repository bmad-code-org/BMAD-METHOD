---
title: 'Modules and Registration'
description: 'What a BMad module is, why the bmod format installs anywhere skills do, what registering gives you, how to design a module, and when to use configuration or customization.'
sidebar:
  order: 10
---

A module is a set of related skills paired with a small record that tells the `bmad` skill how to set them up, recommend them, and check them for updates. The format is called `bmod`, named after its `bmod.toml` manifest file. This page explains the design choices; see [Module Files](../reference/module-files.md) for the exact schemas and keys.

## Why the bmod Format

A module is plain skills plus a small record folder (which is itself a skill folder). Because nothing requires a separate proprietary installer, a module travels anywhere Agent Skills work:

- Add a module with `npx skills add` from GitHub, any Git URL, or a local folder into whichever AI coding tools you use, with the record installed right beside its skills.
- Public repositories appear on [skills.sh](https://skills.sh/) once installed through the Skills CLI, and modules shipped inside external plugins can set `update_source = "plugin:<name>"` so `bmad` defers updates to that marketplace.
- When a module has just one skill, its instructions, record, and help file live together in one folder with nothing extra to fetch.

Once installed, `bmad setup <code>` reads the record in place without merging into a global manifest, so updating the module updates its record automatically. If you are bringing forward an older `module.yaml` module from BMad v6, see [Migrate an Old Module](migrate-an-old-module.md).

## What Registering Gives You

| With a module record | Without a record |
| --- | --- |
| `bmad setup <code>` asks the module's setup questions once and every member reads the answers | Setup never sees the skill |
| The `bmad` skill recommends your skills from `help/help.md` | Help does not know the skill exists |
| `bmad setup` and `bmad status` check the source repository for newer versions | You track updates manually |
| Other skills can declare required or recommended dependencies with minimum versions | Dependencies can only be named informally |
| `retired.toml` lets setup clean up renamed or removed skills and migrate `_bmad/custom/` overrides | Old skill folders and custom overrides remain behind |
| `roster.toml` exposes your agents to `bmad` and `bmad-party-mode` | Multi-agent party mode leaves your agent out |

An unregistered plain skill still works in your AI tool and can still read BMad config and customization if BMad is set up in the project.

## Three Ways to Register

During discovery, Smithy asks whether a skill stands alone or belongs to a module and records the choice in his execution plan:

| Registration | What it is | Use it when |
| --- | --- | --- |
| Single-skill module | One folder holds both the skill and its module record | The default for one standalone skill |
| Member of a module | A small `bmod.toml` points to a shared `bmod-<code>` record | You are building or extending a multi-skill module |
| Plain skill | No `bmod.toml` | You want no module record, or the project has no `_bmad/` folder |

When you describe several skills that ship together, Smithy settles a module plan during discovery before he builds any member: the module code and folder, each member's shape, shared setup questions, agent roster, and build order. He writes the `bmod-<code>` record with the first member and attaches each subsequent skill as it is built.

If you start with one skill and expect to add more later, Smithy builds it as a single-skill module using your planned module code and prefix so nothing has to be renamed later. When the second skill arrives (through a new build or [package mode](modes.md#package)), he moves the shared record into a `bmod-<code>` folder automatically.

A plain skill can also register later: [convert mode](modes.md#convert) adds a record to one skill, and [package mode](modes.md#package) bundles several into a module.

## What a Module Holds

A **single-skill module** keeps everything in one skill folder: its `bmod.toml` carries both the module metadata and skill marker, with `help/help.md` beside it.

A **multi-skill module** adds a sibling record folder named `bmod-<code>` beside its member skills:

| File in `bmod-<code>` | Purpose |
| --- | --- |
| `SKILL.md` | Tells anyone who invokes the record directly to run `bmad setup <code>` |
| `bmod.toml` | Code, version, update source, member list, dependencies, setup questions, and install messages |
| `help/help.md` | Short guidance the `bmad` skill reads to recommend your skills, plus optional topic files |
| `roster.toml` | Agent personas and multi-agent rooms available to `bmad` and `bmad-party-mode` |
| `retired.toml` | Renamed or removed skills so setup can clean up stale files safely |

Each member skill keeps its own small `bmod.toml` naming the record and any skill-specific dependencies. A skill belongs to one module; any skill it calls from another module is listed as a dependency rather than a member.

## Design a Module

Before splitting a domain into multiple skills, decide how many agents you actually need and what context they share.

### One Agent or Several

Start by testing whether one agent with several capabilities covers the domain better than a crowd of narrow agents. One agent keeps full context, maintains one memory of its owner, and gives users one obvious person to call: a dream journal that logs entries, analyzes recurring symbols, and coaches lucid dreaming belongs in one agent rather than three.

Split into multiple agents when capabilities serve distinct roles or workflows, or when users benefit from contrasting voices in the same room. Make each agent capable of completing its own sessions independently rather than forcing constant hand-offs. Plain skills sit cleanly alongside agents for single-output tasks that need no persona, and an agent's menu can invoke them directly.

### Agents That Share What They Know

Each memory agent keeps its own private memory, while multiple agents in the same module can share common artifacts through workspace folders. For example, in a content module with podcast, video, and blog agents, one agent can own a writable `brand/` folder while the other two read from that same folder. See [Shared Workspace Folders (Dominion)](agents-with-memory.md#shared-workspace-folders-dominion).

A module can also declare named multi-agent groups in `roster.toml` for `bmad-party-mode`; setting `memory = true` on a group lets that room remember insights across sessions.

### Modules That Extend Another

A module can build on another module, such as shipping extra review skills for BMad Method. List skills your module directly invokes under `required_skills` and helpful companion skills under `recommended_skills`. Prefer recommending whenever your module still provides useful work without the companion installed.

## Name Skills and Modules

Prefix every skill in a module with the module code (for example `acme-release-notes` and `acme-agent-scout`), and name a multi-skill record folder `bmod-<code>`. The module code serves as both your configuration namespace and the identifier users pass to `bmad setup <code>`.

Using your own prefix separates your skills from official BMad skills, groups them together in tool listings, and prevents collisions with future core releases. Reserve the `bmad-` prefix for skills published in the official `bmad-code-org` repositories.

## Configuration or Customization

Modules support two distinct override mechanisms:

| | Configuration | Customization |
| --- | --- | --- |
| Question it answers | What project facts must the user tell this module once? | How should one skill behave differently here? |
| Defined in | `[[bmod.config_questions]]` in the record's `bmod.toml` | `customize.toml` inside each skill |
| Set by | `bmad setup <code>` | `bmad-customize` |
| Read as | `modules.<code>.<key>` via `resolve_config.py` | `{workflow.<key>}` or `{agent.<key>}` via `resolve_customization.py` |
| Example | A shared workspace path read by every member | An extra activation step or custom template for one skill |

Ask a setup question only when several skills share the value and no default covers everyone, since every question adds friction to setup. Mark personal preferences `scope = "user"` so they stay out of version control, and leave team paths in team scope. See [Make a Skill Customizable](make-a-skill-customizable.md) for per-skill overrides and [Configuration](../reference/configuration.md) for full details.

## Write the Help

`help/help.md` has one reader: the `bmad` skill answering a user's question. State what each skill produces, when to recommend it, and what comes next, leaving out internal schema keys and install mechanics. Because `help.md` loads on every help question across all installed modules, keep it concise and put deeper guidance in `help/<topic>.md` files explicitly referenced from `help.md`.

## Depend on Other Skills

Declare skills your module invokes in `required_skills` and companion skills in `recommended_skills`. Use a plain skill name for another skill from the same repository, or a table with `source` (and optional minimum `version`) for external repositories. Put module-wide dependencies in the record and single-skill needs in that member's `bmod.toml`.

## Add to the BMad Method

People mean two different things when they talk about extending BMad Method:

- To contribute upstream, open a pull request to the `BMAD-METHOD` repository, placing the skill under `skills/method/` with a `bmad-` prefix and `bmod-method` as its record.
- To extend locally or in your own module, create your own module with your own prefix that requires or recommends the BMad Method skills it builds on. Never edit installed `bmod-method` files directly, because the next update overwrites them; always develop changes to any module inside its source repository.
