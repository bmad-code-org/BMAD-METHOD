# Discover

The outcome is an execution plan the user approves before any file exists. A user with a hardened idea or who wants to move fast gets a confirmation and an execution plan, not an interview.

## Mine before you ask

Ask only for the gaps in what the user already gave, this conversation included.

## What you need to learn

Five things settle a skill:

- What it gets done and for whom. Two purposes are two skills.
- Who or what consumes the output, and what must be true of it for them to act without this conversation. This sets every bar.
- The phrases a user would type to reach it, and the nearby requests it must stay quiet on.
- What it runs on, and where the know-how lives that a model would not have, the corrections the user keeps making included.
- Whether the output can be checked objectively.

Ask where it will run: the user's own agent and model, an organisation whose harness and model are known, or distributed to people whose model is unknown.

Name only the one shape the answers reach:

- A persona with a menu is an agent.
- A persona whose capabilities teams must change without forking is a rendered agent.
- Memory across sessions is a memory agent.
- Teams swapping steps without forking is a rendered skill.
- Mostly deterministic work is a script-backed utility.
- Anything else is a plain skill.

Push back where the idea is thin:

- Is this a skill at all, or a one-off the user could ask for directly?
- A project convention belongs in the project's instructions file.
- A constraint a script could check belongs in a script.
- What input would break it?
- What should it require or recommend from the installed skills?

A skill whose job is to hold what the user would otherwise type every time (a format, a preference, a persona) is warranted by that alone. Do not test whether the model can follow it when told.

Where the skill instead claims to teach the model something, the target model is the user's own or their organisation's, and the user has not asked to move fast or run on their own, ask for one real input and run its trigger phrase alone, not the specification, through a subagent with no skill. If that gives what the user wants, say so and propose no skill, or one for only the part it got wrong. If it fails, the trace is the first evidence of what the skill has to teach.

For a distributed skill, offer a baseline eval on the user's cases at ship.

Offer what the outcome implies but nobody named: the sibling intent (update beside create), the unmentioned input. One line each; a decline is not re-proposed.

## Registration

Run `uv run {skill-root}/scripts/registry.py --project-root {project-root}`. Ask whether it is part of a module, naming any it could plausibly join, and whether the user plans more skills.

The guess is a single-skill module, except:

- Building or expanding an installed module, or a name carrying its prefix: member of that module.
- Planning more skills starts a module: settle its code now so nothing is renamed later. Built alone, the first skill takes the single-skill form; the record moves out when the second arrives.
- Several skills described: multi-skill module.
- No `_bmad/` and nothing said about BMad, or a user who wants no record: plain skill outside the registry.

A skill joining or starting a module takes the module's prefix.

## The Smithy execution plan

Present it under that title, and wait for a yes or changes:

- Name, kebab-case, proposed and asked. Suggest a prefix of the user's own, their org or module code, and say why in a line: it tells custom from core BMad, and a module's skills sort together. Do not propose `bmad-`; it belongs to modules shipped by the bmad-code-org, whose skills are `bmad-<code>-<skill>`, agents `bmad-<code>-agent-<name>`, the code dropped for core.
- One line on what it is for, who consumes the output, and what must be true of it for them to act.
- The description draft, as it will ship, written to the canon's description rule.
- Shape, with one line on why.
- Registration, with one line on why, naming the planned module and its code when this is its first skill. A `bmod-<code>/` record folder is never part of a one-skill execution plan. One of:
  - Single-skill module, the default: its own `bmod.toml` and `help/help.md` in the one folder, visible to `bmad` setup, help and updates.
  - Member of `bmod-<code>`: its `bmod.toml` names the record, whose skill list, help and, for an agent, roster change.
  - Plain skill outside the registry.
- Approach, with one line on why:
  - `lean` (default) when the user wants the skill.
  - `eval-first` when the output is checkable and the user wants proof.
  - `skill-creator-loop` when they want to iterate on measured results.
  - `scaffold` when they will write it themselves.
- Where it will live, proposed, not asked:
  - `{workflow.skills_folder}/<name>` when set.
  - Inside the module it joins.
  - Else `skills/<name>` at `{project-root}` when that folder holds `*/SKILL.md` (a skill repo, whose source is what to edit).
  - Else the folder the user's agent reads skills from (`.agents/skills/`, `.claude/skills/` or the like, writing at the symlink's target when one links to the other), live once written.
  - Else `~/.claude/skills/<name>` or `~/.agents/skills/<name>` when the skill is for the user everywhere or there is no project.
- The files it will have, one line each, and any script worth writing because the work is deterministic or would be rewritten every run.

Approval sets `{target}` and fixes the execution plan; later files work from it and do not re-ask. Then load `approaches/<approach>.md`.
