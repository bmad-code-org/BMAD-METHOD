---
title: Skills and Agents
description: What a BMad skill is, how to invoke one, where the Skills CLI puts them, which agents exist across modules, and what each core and method skill does.
sidebar:
  order: 1
---

Use this page to see every skill and agent a BMad installation provides and how to start each one. Practical usage guides are linked from each table below.

## What a Skill Is

A skill is a named capability installed into your AI coding tool with `npx skills add` and configured with `bmad setup`. Type its name in chat (such as `bmad`, or prefixed with `/` or `$` depending on your tool) and the tool loads it.

Each skill does one of three jobs: loads an agent persona, runs a multi-step workflow, or runs a focused task.

## Skills vs. Agent Conversations

BMad gives you two ways to start work:

| Mechanism | How you invoke it | What happens |
| --- | --- | --- |
| **Direct skill** | Type the skill name in chat (for example, `bmad-build` or `bmad-project-context`) | Runs that workflow or task directly |
| **Agent persona** | Load an agent (for example, `bmad-agent-po` or `bmad-agent-pm`) and ask in plain English, or enter one of its optional menu codes (such as Sofia's `SPEC` or `BOARD`, or Amelia's `TESTS`) | The agent stays in character and guides the matching document or workflow |

Use a direct skill when you already know which workflow you want. Load an agent when you want role-specific coaching or want to move across related tasks in one persona.

## Where Skills Live

`npx skills add` installs one directory per skill, each holding a `SKILL.md`, into a directory chosen for your coding tool:

| Tool | Skills directory |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Cursor, Windsurf, Codex, Auggie, Amp, and most others | `.agents/skills/` |
| Cline | `.cline/skills/` |
| IBM Bob | `.bob/skills/` |
| Antigravity | `.agent/skills/` |
| AdaL | `.adal/skills/` |

A global install places skills in your user-level directory instead, and the CLI output prints the exact path used. Each folder name is the skill id: `bmad-agent-dev/` registers `bmad-agent-dev`.

:::tip[Your Installed Directory Is Canonical]
Inspect your skills folder to see every installed skill and its description, or ask `bmad` in chat for what is installed and what to run next.
:::

## Agents

Load any agent with its skill id and describe what you want in plain words. Ask any agent what they can help with and they summarize their scope in a few sentences without dumping a raw command list. For role overviews and when to talk to whom, see [Meet the Agents](../agents/agents.md).

### Core Agent

Every installation includes the BMad Agent from Core Tools:

| Agent | Skill ID | How it helps |
| --- | --- | --- |
| [BMad, the BMad Agent](../start/the-bmad-agent.md) | `bmad` | Advises across every installed module and other available skills, recommends next steps from your project folder, manages setup, updates, modules, upgrades, and active initiatives, and routes to or runs skills for you when you ask |

### BMad Method Agents

The BMad Method module ships six named agents:

| Agent | Skill ID | How they help |
| --- | --- | --- |
| [Mary, Business Analyst](../agents/mary-analyst.md) | `bmad-agent-analyst` | Explore ideas, research markets or codebases, test concepts with briefs and PRFAQs, build business cases, and set up project context |
| [John, Product Manager](../agents/john-pm.md) | `bmad-agent-pm` | Plan product work at any scale, from small changes and prototypes to initiative PRDs, pitches, SRS specs, and launch plans |
| [Sofia, Product Owner](../agents/sofia-po.md) | `bmad-agent-po` | Distill inputs into tickets, slice programs, initiatives, and epics into stories, track what is ready next, handle mid-flight changes, and sync with external trackers |
| [Sally, UX Designer](../agents/sally-ux-designer.md) | `bmad-agent-ux-designer` | Design user psychology trigger maps, brand kits, visual direction, app screens and flows, websites, design-tool handoffs, and UX audits |
| [Winston, System Architect](../agents/winston-architect.md) | `bmad-agent-architect` | Choose stacks, write system and epic architecture, weigh build-vs-buy, plan migrations, run security or readiness reviews, and record ADRs and postmortems |
| [Amelia, Developer](../agents/amelia-dev.md) | `bmad-agent-dev` | Build changes interactively or unattended, review code independently, walk through diffs, add end-to-end tests (`TESTS`), and wrap up epics |

### Optional Module Agents

Additional official modules add specialized agents:

| Agent | Module | Skill ID | How they help |
| --- | --- | --- | --- |
| [Nadia, Founder Advisor](../founder/founder.md) | Founder (`founder`) | `bmad-founder-agent-advisor` | Coach startups from idea to fundraise across seventeen business documents, run financial modeling scripts, track customer evidence and investors, and host an investor pitch room in one company record folder |
| [Clio, Creative Director](../creative/creative.md) | Creative (`creative`) | `bmad-creative-agent-director` | Capture your voice, write talks, essays, and scripts in your voice, develop stories, characters, worlds, and presentations, crack non-code problems, and run studio rooms in one creative record folder |
| [Smithy, Toolsmith](../toolsmith/toolsmith.md) | Toolsmith (`toolsmith`) | `bmad-toolsmith` | Scaffold, author, review, optimize, migrate, and package BMad skills, agents, and modules |

Every named agent can be tailored without editing installed files. See [Customize BMad](../customize/customize-bmad.md).

## Core Tools Skills

Every installation starts with the Core Tools module (`core-tools`), which provides eleven skills that work in any project and phase without loading an agent first.

### bmad

The BMad Agent. Ask a question in plain English and it answers from your installed modules, recommends prioritized next steps based on your active initiative and existing artifacts, and routes to or runs skills for you on request (including asking it to customize skills through `bmad-customize`). It also handles `bmad setup`, `bmad status`, `bmad migrate method`, and active initiative switching.

**Input:** A plain-language question, a request to run or customize a skill, or a management command (`bmad setup`, `bmad status`, `bmad migrate`). **Output:** Prioritized guidance, the delegated skill run, or the command's result.

:::note[Example]
`bmad I have a SaaS idea and know the main features. Where do I start?`
:::

### bmad-advanced-elicitation

Challenges a draft or decision in front of you through independent critique lenses so you do not settle for the model's first default answer. Works on a section, plan, decision, or pasted document.

**How it works:**

1. Names the target and likely weak spots, then runs three distinct lenses in parallel (the strongest lens for the weakness, an unexpected wildcard lens, and either an open reconsideration for a single decision or a second critique lens for a document).
2. Runs specific methods you request (such as pre-mortem, first principles, inversion, red team, steelman, Socratic questioning, assumption audit, stakeholder lens, or subtraction) or team defaults configured through `bmad-customize`.
3. Returns a single numbered revision list tagged by lens, along with the revised passages and full findings report, so you can accept all, cherry-pick by number, rerun, or reject.

You can invoke it at any point during planning, design, or coaching by saying "advanced elicitation" (optionally naming a section or method).

### bmad-review

Reviews a diff, branch, file, or document through one or more independent lenses and reports triaged findings in one shape. Zero findings is a valid result.

| Lens | Applies to | Method |
| --- | --- | --- |
| **Adversarial** | Anything | Looks for missing edge handling, broken assumptions, and unstated failure paths |
| **Edge case** | Anything | Walks branches, boundaries, nulls, concurrency, and error states |
| **Verification gap** | Code | Finds changed behavior that could regress without reliable tests catching it |
| **Structure** | Documents | Proposes cuts, merges, reordering, and tightening while preserving meaning |
| **Prose** | Documents | Copy-edits for clarity and comprehension on top of structural findings |

Teams can customize or extend the lens set through `bmad-customize`.

:::note[Who Calls bmad-review]
`bmad-retrospective` runs code lenses across an epic's diff, and `bmad-facilitate` runs the editorial lenses (`structure` and `prose`) during finalize across all facilitated documents. `bmad-build` and `bmad-code-review` use their own dedicated review layers; see [Review a Change](../build/review-a-change.md).
:::

### bmad-customize

Translates plain-English customization requests into team or personal override files under `_bmad/custom/` and template extensions under `_bmad/custom/facilitate-templates/`, then verifies the merged output. See [Customize BMad](../customize/customize-bmad.md).

### bmad-brainstorming

Facilitates a divergent brainstorming session using structured creative techniques, guiding you toward broad idea volume before clustering and prioritizing.

**Output:** A self-contained `brainstorm.html` keepsake and an optional `brainstorm-<topic>.md` for downstream skills. See [Clarify the Idea](../clarify/clarify-the-idea.md#generate-or-pressure-test-an-idea).

### bmad-deep-recon

Runs decision-grade research on external topics or your own repository. Supports drafting research prompts for external tools, synthesizing finished reports, running parallel web research across market, domain, technical, competitive, user-voice, and literature angles, or producing line- and commit-cited codebase analyses that `bmad-build` can read as evidence.

**Output:** A cited `research-<topic>.md`, an optional HTML briefing, and optional codebase decision records. See [Clarify the Idea](../clarify/clarify-the-idea.md#research-a-decision).

### bmad-forge-idea

Stress-tests an early idea one question at a time using contrasting personas until you can act on it or drop it with confidence.

**Output:** A `forge-report.html` keepsake plus `forge-<slug>.md`. See [Clarify the Idea](../clarify/clarify-the-idea.md#generate-or-pressure-test-an-idea).

### bmad-facilitate

Coaches, updates, and validates structured documents from markdown template libraries, scaling rigor to the stakes you state. Core Tools ships the template for authoring templates, while modules supply domain templates:

- BMad Method ships 35 templates coached by Mary (`bmad-agent-analyst`), John (`bmad-agent-pm`), Sally (`bmad-agent-ux-designer`), and Winston (`bmad-agent-architect`), covering briefs, PRFAQs, PRDs, UX design, brand kits, system and epic architecture, RFCs, API designs, migrations, postmortems, ADRs, and security reviews.
- Founder ships 17 business templates coached by Nadia (`bmad-founder-agent-advisor`).
- Creative ships 8 creative and thinking templates coached by Clio (`bmad-creative-agent-director`).

See [Document Templates](./document-templates.md) for the complete catalog and [Write a Document Template](../customize/write-a-document-template.md) for adding or extending templates.

**Output:** `<id>-<slug>.md` in its own run folder, any companion files defined by the template, and an optional self-contained HTML artifact.

:::note[Example]
`bmad-facilitate coach me through a security review covering the OWASP Top 10, output to docs/owasp`
:::

### bmad-party-mode

Brings your installed agents or custom personas into one interactive discussion with optional memory, multiple execution modes (`session`, `subagent`, `agent-team`), and an optional HTML keepsake. See [Run Multi-Agent Discussions](../customize/run-multi-agent-discussions.md).

### bmad-shard-pro

Makes long documents (such as large PRDs, manuals, or specifications) fast for agents to inspect by either keeping them intact, adding a line-numbered contents table, or splitting them losslessly into a map and shards verified by script. See [Prepare Long Documents for Agents](../plan/prepare-long-documents-for-agents.md).

**Output:** A main index file, verified shards, and the frozen original in `.source/` (or an updated contents table in place).

### bmad-ingest

Turns raw source material (meeting transcripts, chat or email threads, voice memos, or long documents) into concise, cited notes that link every claim back to its place in the original without inventing facts.

- Core Tools ships `meeting`, `thread`, `voice-memo`, `document`, and `one-on-one`.
- BMad Method adds `standup`, `retrospective`, `sprint-review`, `discovery-workshop`, and `user-interview`.
- Teams can add, replace, or extend templates under `_bmad/custom/ingest-templates/`, `~/.bmad/ingest-templates/`, configured template libraries, or module `ingest-templates/` folders.

See [Ingest Templates](./ingest-templates.md) for every shipped template and its output structure.

**Output:** The unchanged original in `{output_folder}/raw/` (unless already inside the project) and the cited note in the caller's folder or `{output_folder}/notes/`.

## BMad Method Workflow Skills

Alongside the six Method agents listed in [BMad Method Agents](#bmad-method-agents), the BMad Method module ships seven workflow skills:

| Skill | Purpose | See |
| --- | --- | --- |
| `bmad-project-context` | Set up, adopt, refresh, record pitfalls in, or audit `AGENTS.md` | [Set and Maintain Project Context](../existing-codebases/set-and-maintain-project-context.md) |
| `bmad-build` | Implement a change or ticket interactively with planning, coding, review, and verification | [Build a Change](../build/build-a-change.md) |
| `bmad-build-auto` | Run one unattended implementation iteration for an orchestrator or autonomous loop | [Autonomous Development Loops](../build/autonomous-development-loops.md) |
| `bmad-code-review` | Review code changes with independent parallel reviewers and triage findings | [Review a Change](../build/review-a-change.md) |
| `bmad-walkthrough` | Guide a human review of a commit, PR, file, or directory one chunk at a time | [Walk Through a Change](../build/walk-through-a-change.md) |
| `bmad-qa-generate-e2e-tests` | Generate automated API and end-to-end tests for existing working features | [Test Completed Work](../build/test-completed-work.md) |
| `bmad-retrospective` | Review a completed epic against its evidence and decide whether to accept it | [Finish an Epic](../learn/finish-an-epic.md) |

## Toolsmith Skills

The Toolsmith module (`toolsmith`) is optional and focused on building and evaluating BMad skills and modules:

| Skill | Purpose | See |
| --- | --- | --- |
| `bmad-toolsmith` | Smithy, who builds, reviews, migrates, and packages skills, agents, and modules | [Toolsmith](../toolsmith/toolsmith.md) |
| `bmad-eval` | Evaluate skills with baseline, variant, quality rubric, and trigger benchmarks | [Eval Runner](../toolsmith/bmad-eval.md) |

## Retired Names

Earlier skill names (such as `bmad-create-prd`, `bmad-edit-prd`, `bmad-prd`, `bmad-product-brief`, `bmad-ux`, `bmad-architecture`, `bmad-market-research`, `bmad-document-project`, `bmad-generate-project-context`, and `bmad-checkpoint-preview`) were removed or renamed. `bmad setup` offers to delete retired skills still installed and migrates customization files for renamed skills.

## Naming and Modules

Official BMad skills use the `bmad-` prefix (`bmad-agent-dev`, `bmad-facilitate`, `bmad-build`). Custom modules use their own module code as a prefix; see [Add Modules](../customize/add-modules.md) and [Modules and Registration](../toolsmith/modules.md).

## Troubleshooting

- If skills do not appear after install, confirm skills are enabled in your coding tool's settings, then restart or reload the window.
- If expected skills are missing, re-run `npx skills add` with `--skill '*'` (for example, `npx skills add bmad-code-org/BMAD-METHOD/skills/method --skill '*'`), run `bmad setup`, and confirm the skill folders exist in your tool's skills directory.
- If old skills from a removed module still appear, remember that `npx skills` does not delete previously installed folders automatically, so remove stale skill directories manually or run `bmad setup` to clean up retired official skills.
