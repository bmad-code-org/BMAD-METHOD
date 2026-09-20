# BMad modules

Open this when the user asks what a BMad module is, what is in one, how to make or share one, or how to package agents and parties for others.

## What a module is

A module is a set of skills that belong together, plus one folder that tells `bmad` about them. There is no installer plugin, registry, or build step. A module is installed with `npx skills add <owner>/<repo>`, and `bmad` finds it on its next run. In return the module gets setup and config questions, help that `bmad` answers from, agents and parties in party mode, dependency prompts, and update checks.

## The module folder

One skill folder named `bmod-<code>`, for example `bmod-method`. Nobody runs it; `bmad` reads it. Its files:

| File | What it is |
|---|---|
| `bmod.toml` | The module record, under a `[bmod]` table: the module's code, version, where updates come from, the list of its skills, the skills it requires or recommends, and any questions `bmad setup` should ask. |
| `SKILL.md` | A stub that marks the folder as a skill so it installs with the others. It says never to invoke it. |
| `help/help.md` | What `bmad` reads to guide users: what each skill is for, when to recommend it, what comes next. Written for an agent, short. |
| `help/<topic>.md` | Optional deeper files on one subject each. `help.md` says what each covers, and `bmad` opens one only when a question needs it. |
| `roster.toml` | Optional. The personas the module offers and the parties they form, for `bmad-party-mode` and any skill that casts personas. |

## Each skill in the module

Every member skill carries its own small `bmod.toml` with a `[skill]` table naming its module folder and source. It can also list skills that this one skill requires or recommends. A skill belongs to one module. Depending on a skill from another module is fine.

## A module that is one skill

A standalone skill can be its own module: one `bmod.toml` holding both `[bmod]` and `[skill]`, with no separate `bmod-` folder. That is how a single skill brings its own config questions and help.

## A module that only adds personas and parties

A module with no skills is valid. A `bmod-<code>` folder holding `bmod.toml`, the stub `SKILL.md`, `help/help.md`, and a `roster.toml` is enough to distribute a cast.

- A roster member has a `code`, `name`, `icon`, `title`, and a `persona` paragraph. A member with a `skill` is an agent and appears only while that skill is installed. A member without one is a guest, available to parties.
- A roster group is a party: an `id`, a `name`, a `scene` describing how the room behaves, and its `members` by code.
- Once installed, the personas and parties appear in party mode with no setup. For a cast used in one repository or one team, a party saved through customization is simpler (`help/party-mode.md`).

## Setup and config questions

A module can declare questions in its `bmod.toml`. `bmad setup` asks them once: a team answer goes to the committed `_bmad/config.toml`, a personal answer to `_bmad/custom/config.user.toml`. A skill reads an answer without needing to know which file holds it.

## Building one

The BMad Builder module has skills for authoring modules, agents, and workflows. Recommend it when installed. Otherwise the file list above is the whole contract, and an existing `bmod-*` folder is a working example to copy.
