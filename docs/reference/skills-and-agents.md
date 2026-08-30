---
title: Skills and Agents
description: What a BMad skill is, how to invoke one, where the installer puts them, which agents exist with their menu codes, and what each core skill does.
sidebar:
  order: 1
---

Use this page to find out what skills and agents a BMad install gives you and how to start each one. How a skill is used in practice lives on its chapter page, linked from the tables below.

## What a Skill Is

A skill is a named command the installer places in your AI tool. Type its name — `bmad-help`, for example — and the tool loads it. On some platforms the name takes a `/` or `$` prefix.

A skill does one of three things: loads an agent persona, runs a multi-step workflow, or runs a single task.

## Skills vs. Agent Menu Triggers

BMad offers two ways to start work.

| Mechanism              | How you invoke it                                       | What happens                                                      |
| ---------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| **Skill**              | Type the skill name (e.g. `bmad-help`) in your AI tool  | Directly loads an agent, runs a workflow, or runs a task          |
| **Agent menu trigger** | Load an agent first, then type a short code (e.g. `BD`) | The agent starts the matching workflow while staying in character |

Use a skill when you know which workflow you want. Use a trigger when you are already working with an agent and want to switch tasks without leaving the conversation.

## Where Skills Live

The installer writes one directory per skill, each holding a `SKILL.md`, into a directory that depends on your tool:

| Tool                                                  | Skills directory  |
| ----------------------------------------------------- | ----------------- |
| Claude Code                                           | `.claude/skills/` |
| Cursor, Windsurf, Codex, Auggie, Amp, and most others | `.agents/skills/` |
| Cline                                                 | `.cline/skills/`  |
| IBM Bob                                               | `.bob/skills/`    |
| Antigravity                                           | `.agent/skills/`  |
| AdaL                                                  | `.adal/skills/`   |

Some other tools also use their own directory, and a global install goes to a per-user directory instead. The installer output names the exact path for the tool you chose. The directory name is the skill name: `bmad-agent-dev/` registers `bmad-agent-dev`.

:::tip[The installed directories are the canonical list]
Open your skills directory to see every installed skill with its description. Run `bmad-help` for guidance on which to use next.
:::

## Agents

The BMad Method module installs five named agents. Load one with its skill ID, then type a code from its menu. Codes are scoped to the agent that shows them: `CR` is a competitive teardown for the Analyst and a code review for the Developer.

| Agent                  | Skill ID                 | Codes                                                      | Menu                                                                                                                                                                 |
| ---------------------- | ------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analyst (Mary)         | `bmad-agent-analyst`     | `BP`, `MR`, `DR`, `TR`, `TS`, `CR`, `UV`, `CB`, `WB`, `PC` | Brainstorm; market, domain, and technical research; technology selection; competitive teardown; user-voice research; product brief; PRFAQ challenge; project context |
| Product Manager (John) | `bmad-agent-pm`          | `PRD`, `CE`, `IR`, `CC`                                    | Create, update, or validate a PRD; epics and stories; implementation readiness; correct course                                                                       |
| Architect (Winston)    | `bmad-agent-architect`   | `CA`, `IR`                                                 | Architecture spine; implementation readiness                                                                                                                         |
| Developer (Amelia)     | `bmad-agent-dev`         | `BD`, `QA`, `CR`, `SP`, `ER`                               | Build; QA test generation; code review; sprint plan; epic retrospective                                                                                              |
| UX Designer (Sally)    | `bmad-agent-ux-designer` | `CU`                                                       | UX design                                                                                                                                                            |

:::note[Where is Paige?]
The Technical Writer (Paige) is on hiatus. Project context lives on: use the Analyst's `PC` code or invoke `bmad-project-context` directly.
:::

The Developer's `QA` code runs `bmad-qa-generate-e2e-tests`; the full Test Architect is a separate module. See [Test Completed Work](../build/test-completed-work.md).

Each agent is an identity plus a customizable layer. See [Customize BMad](../customize/customize-bmad.md) for how that model works and how to change an agent.

## Core Skills

Every installation includes the core module: eight skills that work in any project, any module, any phase. No agent session is required.

### bmad-help

Answers BMad questions and recommends the next skill. It inspects your project for existing artifacts, detects the installed modules, and lists next steps in priority order, each with its skill command.

**Input:** an optional question in plain language. **Output:** a prioritized list of next steps.

:::note[Example]
`bmad-help I have a SaaS idea and know all the features. Where do I start?`
:::

### bmad-advanced-elicitation

A structured second pass over what the model just produced. Instead of "try again," you pick a named reasoning method and the model re-examines its own output through that lens. A named method forces a particular angle of attack and surfaces what a generic retry misses.

**Use it when:**

- Output seems fine but you suspect there is more depth
- You want to stress-test assumptions or find weaknesses
- The content is high-stakes and rethinking is worth the time

**How it works:**

1. It suggests five methods that fit the target (the most recent output, unless you point it elsewhere)
2. You pick one or more, or reshuffle for different options
3. It applies the method and shows the proposed improvements
4. You accept or discard, then repeat or continue

Dozens of methods are available. Examples: pre-mortem analysis, first principles thinking, inversion, red team vs. blue team, Socratic questioning, constraint removal, stakeholder mapping, and analogical reasoning.

The brief, PRD, UX, and spec skills offer it at their own pauses; you can also run it directly on anything recent in the conversation.

:::tip[Start with a pre-mortem]
Pre-mortem analysis is a good first pick for any spec or plan. It consistently finds gaps that a standard review misses.
:::

### bmad-review

Reviews a diff, document, or other artifact through one or more lenses and reports every finding in one shape. Zero findings is a valid outcome; it never pads to look thorough.

| Lens                 | Applies to | Method                                                                                 |
| -------------------- | ---------- | -------------------------------------------------------------------------------------- |
| **Adversarial**      | Anything   | Forced-finding review that looks for what is missing, not only what is wrong           |
| **Edge case**        | Anything   | Walks every branching path and boundary condition in content that defines behavior     |
| **Verification gap** | Code       | Finds changed behavior that could regress without reliable verification catching it    |
| **Structure**        | Documents  | Proposes cuts, merges, moves, and condensing                                           |
| **Prose**            | Documents  | Copy-edits for issues that impede comprehension; runs on top of the structure findings |

The two editorial lenses hold content sacrosanct: they critique only how a document is organized and expressed, and they propose changes rather than making them. The lens set is not fixed; a `customize.toml` override can add lenses or replace shipped ones.

**Input:** the content (a diff, branch, uncommitted changes, file, or document) and optionally the lenses to run. **Output:** findings grouped by lens, as JSON, markdown, or both.

:::note[Who runs it]
`bmad-retrospective` runs the code lenses over a completed epic's diff. The product brief, PRD, UX, and architecture skills run the editorial lenses at their finalize step. `bmad-build` and `bmad-code-review` use their own reviewer layers; see [Review a Change](../build/review-a-change.md).
:::

### bmad-customize

Writes and verifies customization overrides for installed skills, so you can change an agent's or workflow's behavior without hand-authoring TOML. Describe the change in plain language; it selects the right scope, writes the override under `_bmad/custom/`, and verifies the merged result. See [Customize BMad](../customize/customize-bmad.md).

### bmad-brainstorming

Facilitates a brainstorming session using proven creative techniques, guiding you toward 100 or more ideas before organizing them. It shifts creative domain periodically to prevent clustering.

**Input:** a topic or problem statement, plus optional context. **Output:** a self-contained `brainstorm.html` keepsake and an optional `brainstorm-intent.md` for downstream skills. See [Explore and Validate an Idea](../plan/explore-and-validate-an-idea.md).

### bmad-deep-recon

Researches a topic to support a decision, three ways: drafts a research prompt for the tool you already use, turns a finished report into a cited summary other skills consume, or runs the research here with parallel web searches. Built-in types cover market, domain, technical, competitive, user-voice, and academic literature research, plus choosing between candidates.

**Output:** a cited `research.md` and an optional HTML briefing. See [Research a Decision](../plan/research-a-decision.md).

### bmad-forge-idea

Pressure-tests a half-formed idea in a questioning conversation, one question at a time, with different personas probing its weak points, until you can act on it or drop it with confidence.

**Output:** a `forge-report.html` keepsake every run, plus a `forged-idea.md` brief when the idea hardens. See [Explore and Validate an Idea](../plan/explore-and-validate-an-idea.md#pressure-test-an-idea-with-forge-idea).

### bmad-party-mode

Puts your installed agents, or custom personas, in one conversation, in character, with you steering. A mode setting decides whether one model voices everyone or separate agents think independently, and you can save custom parties for reuse. See [Run Multi-Agent Discussions](../customize/run-multi-agent-discussions.md).

## BMad Method Skills

The BMad Method module adds the five agents above and these workflow skills. The linked page covers when to use the skill and what it produces.

| Skill                           | Purpose                                                                                           | See                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `bmad-product-brief`            | Create, update, or validate a product brief                                                       | [Define Requirements and a Specification](../plan/define-requirements-and-a-specification.md)          |
| `bmad-prfaq`                    | Stress-test a product concept with the Working Backwards PRFAQ method                             | [Define Requirements and a Specification](../plan/define-requirements-and-a-specification.md)          |
| `bmad-prd`                      | Create, update, or validate a PRD                                                                 | [Define Requirements and a Specification](../plan/define-requirements-and-a-specification.md)          |
| `bmad-spec`                     | Condense any input into a short spec that downstream skills build from; can break it into stories | [Define Requirements and a Specification](../plan/define-requirements-and-a-specification.md)          |
| `bmad-ux`                       | Capture the UX vision as `DESIGN.md` and `EXPERIENCE.md`                                          | [Design UX and Architecture](../plan/design-ux-and-architecture.md)                                    |
| `bmad-architecture`             | Record the architecture decisions that keep separately built parts consistent                     | [Design UX and Architecture](../plan/design-ux-and-architecture.md)                                    |
| `bmad-create-epics-and-stories` | Break requirements into epics and user stories                                                    | [Break Work into Stories and Track It](../plan/break-work-into-stories-and-track-it.md)                |
| `bmad-sprint-planning`          | Check implementation readiness and generate the sprint status file                                | [Break Work into Stories and Track It](../plan/break-work-into-stories-and-track-it.md)                |
| `bmad-correct-course`           | Assess a significant mid-sprint change and produce a change proposal                              | [Break Work into Stories and Track It](../plan/break-work-into-stories-and-track-it.md#correct-course) |
| `bmad-project-context`          | Set up, refresh, or audit the repository's agent instructions                                     | [Set and Maintain Project Context](../existing-codebases/set-and-maintain-project-context.md)          |
| `bmad-build`                    | Turn a work item into working code, reviewed and verified                                         | [Build a Change](../build/build-a-change.md)                                                           |
| `bmad-build-auto`               | Run one iteration of an unattended development loop                                               | [Autonomous Development Loops](../build/autonomous-development-loops.md)                               |
| `bmad-code-review`              | Review code changes with several independent reviewers, then triage the findings                  | [Review a Change](../build/review-a-change.md)                                                         |
| `bmad-walkthrough`              | Walk you through reviewing a change: what to look at and how to test it                           | [Walk Through a Change](../build/walk-through-a-change.md)                                             |
| `bmad-qa-generate-e2e-tests`    | Generate automated API and end-to-end tests for implemented features                              | [Test Completed Work](../build/test-completed-work.md)                                                 |
| `bmad-retrospective`            | Review a completed epic against its evidence and decide whether to accept it                      | [Finish an Epic](../build/finish-an-epic.md)                                                           |

## Deprecated Names

Earlier skill IDs, such as `bmad-create-prd`, `bmad-edit-prd`, `bmad-market-research`, `bmad-generate-project-context`, and `bmad-checkpoint-preview`, still resolve as forwarders to the current skill. Use the current names in new work.

## Naming and Modules

Every skill uses the `bmad-` prefix followed by a descriptive name: `bmad-agent-dev`, `bmad-prd`, `bmad-help`. Modules add their own skills under the same prefix; see [Add Modules](../customize/add-modules.md).

## Troubleshooting

**Skills not appearing after install.** Some platforms require skills to be enabled in settings. Check your tool's documentation, then restart it or reload the window.

**Expected skills are missing.** The installer only writes skills for modules you selected. Run `npx bmad-method install` again and verify your module selection, then check that the skill directories exist.

**Skills from a removed module still appear.** The installer does not delete old skill directories. Remove the stale directories, or delete the whole skills directory and re-run the installer for a clean set.
