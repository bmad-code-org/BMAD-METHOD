# Discover

The outcome is an execution plan the user approves before any file exists. Bare paths resolve from `{skill-root}`.

## Mine before you ask

Ask only for the gaps in what the user already gave, this conversation included.

## What you need to learn

These settle a skill:

- What it gets done and for whom. Two purposes are two skills.
- Who or what consumes the output, and what must be true of it for them to act without this conversation. This sets every bar.
- The phrases a user would type to reach it, and the nearby requests it must stay quiet on.
- What it runs on, and where the know-how lives that a model would not have, the corrections the user keeps making included.
- Where it will run: the user's own agent and model, an organisation whose harness and model are known, or people whose model is unknown.
- Whether the output can be checked objectively.

Name only the one shape the answers reach; an agent that writes documents also names the document template:

- A person talking something through until a document comes out is a document template, alone or carried by an agent. Settle here whether it stands alone or an agent carries it. A template alone needs only the document, its reader, a real example, who offers it and where it goes; the rest of this section and Registration are skipped.
- A persona with a menu is an agent.
- Memory across sessions is a memory agent: used daily for a month, its thirtieth session would differ from the first. "Nice if it remembered" is a stateless agent with `persistent_facts`. For a memory agent, also ask: will the owner hand it material to keep, teach it new capabilities, have it work on a schedule with nobody present, and does it own or tend anything beyond its memory that people or other agents rely on and that must outlive it? The answers set its files in the plan.
- Mostly deterministic work is a script-backed utility.
- Anything else is a plain skill.

How customizable it is follows who runs it. A skill for the user alone ships no `customize.toml`, and an agent keeps only its persona and activation steps there. Declare more only when other people or teams will run it and want it to behave differently. Build a rendered skill or rendered agent only when the user asks for one.

Push back where the idea is thin:

- Is this a skill at all, or a one-off the user could ask for directly?
- A project convention belongs in the project's instructions file.
- A constraint a script could check belongs in a script.
- What input would break it?
- What should it require or recommend from the installed skills?
- Does a person talk this through and a document come out? Propose the smallest fit: a template alone, then an agent with templates, a skill only when coaching cannot do the job.

A skill whose job is to hold what the user would otherwise type every time (a format, a preference, a persona) is warranted by that alone. Do not test whether the model can follow it when told.

Run a bare check when all three hold: the skill claims to teach the model something; the target model is the user's own or their organisation's; the user has not asked to move fast. Ask for one real input and run its trigger phrase alone, without the specification, through a subagent with no skill.

- It gives what the user wants: say so and propose no skill, or one for only the part it got wrong.
- It fails: the trace is the first evidence of what the skill has to teach.

Offer what the outcome implies but nobody named: the sibling intent (update beside create), the unmentioned input. One line each; a decline is not re-proposed.

## Registration

Run `uv run "{skill-root}/scripts/registry.py" --project-root "{project-root}"`. Ask whether it is part of a module, naming any it could plausibly join, and whether the user plans more skills.

The guess is a single-skill module: its own `bmod.toml` and `help/help.md` in the one folder, visible to `bmad` setup, help and updates. Except:

- Building or expanding an installed module, or a name carrying its prefix: member of that module.
- Planning more skills starts a module: settle its code now so nothing is renamed later.
- Several skills that belong together: a module plan first, below.
- No `_bmad/` and nothing said about BMad, or a user who wants no record: plain skill outside the registry.

## Module plan

When the user is building several skills that ship together, settle the module before any one skill. Load `shapes/multi-skill-module/shape.md` for what the plan holds, present it, wait for a yes, and record it as below with `<name>` as `bmod-<code>`. Then run this discovery for each member in the plan's build order, one at a time; what the module plan settled is not asked again.

## The Smithy execution plan

Present it under that title, and wait for a yes or changes:

- Name, kebab-case, proposed and asked. A skill joining or starting a module takes its code as prefix; otherwise suggest the user's own or their org's, and say why in a line: it tells custom from core BMad, and a module's skills sort together. `bmad-` is reserved for modules shipped by the bmad-code-org, whose skills are `bmad-<code>-<skill>`, agents `bmad-<code>-agent-<name>`, the code dropped for core.
- One line on what it is for, who consumes the output, and what must be true of it for them to act.
- The description draft, as it will ship, written to the canon's description rule; read `canon.md` whole first if this session has not.
- Shape, with one line on why.
- Registration, with one line on why: single-skill module, member of `bmod-<code>`, or plain skill outside the registry, as settled above; name the planned module and its code when this is its first skill.
- Approach, with one line on why:
  - `lean` (default) when the user wants the skill.
  - `eval-first` when the output is checkable and the user wants proof.
  - `skill-creator-loop` when they want to iterate on measured results.
  - `scaffold` when they will write it themselves.
- Where it will live, proposed, not asked:
  - `{workflow.skills_folder}/<name>` when set.
  - Inside the module it joins.
  - Else `skills/<name>` at `{project-root}`, or `skills/<module>/<name>` where the repo groups skills by module, when the registry reports `skills_repo` (a skill repo, whose source is what to edit).
  - Else the folder the user's agent reads skills from, among the registry's `roots` that exist (`.agents/skills/`, `.claude/skills/` or the like), written at its `real_path`; live once written.
  - Else `~/.claude/skills/<name>` or `~/.agents/skills/<name>` when the skill is for the user everywhere or there is no project.
- The files it will have, one line each, and any script worth writing because the work is deterministic or would be rewritten every run.

A plan for a template alone holds only the document and its reader, the template id, where the file goes and who offers it; approval records it as below and loads `shapes/document-template/shape.md` in place of an approach.

Approval sets `{target}` and fixes the execution plan. Record it: write `{reports_folder}/<name>-build/plan.md`, holding the plan as approved and, under `## Rests on`, one line per discovery answer it rests on. Without `_bmad/` there is no reports folder; the plan stays in the conversation.

Later files read the plan back from that file when the conversation no longer holds it, work from it without re-asking, and bring the user any change to what the skill does or how it sounds; a change the user approves is edited into the file. Then load `approaches/<approach>.md`.
