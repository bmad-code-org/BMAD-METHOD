---
title: 'Adopt BMad Across a Team'
description: Recipes that make every developer's BMad follow your organization's rules, tools, templates, and agent roster — without forking a skill.
sidebar:
  order: 2
---

You lead a team and want every developer's BMad to use the same tools,
follow the same conventions, publish to the same systems, and know the same
people. Each recipe below is one override file under `_bmad/custom/`,
committed to the repository so everyone inherits it on pull.

Pick the surface this way:

- The rule applies wherever an engineer does dev work: customize the **dev agent**.
- The rule applies only to one workflow, such as writing a product brief: customize **that workflow**.
- The change alters who is on the roster, or a path the whole team shares: edit **central config**.

For how override files merge with the shipped defaults, see
[Customize BMad](./customize-bmad.md). This page never repeats those
mechanics; it shows what to write.

:::tip[Applying these recipes]
Run the `bmad-customize` skill and describe the intent; it writes the
override file for recipes 1 through 4 and 6 and verifies the merge. Recipe
5, the agent roster in central config, is hand-authored.
:::

Every per-skill recipe has a team form and a personal form. `bmad-agent-dev.toml`
is committed to git and applies to the whole team; `bmad-agent-dev.user.toml`
is gitignored and layers personal preferences on top. The same split holds
for every skill file and for central config.

## Recipe 1: Shape an agent across every workflow it dispatches

**File and key:** `_bmad/custom/bmad-agent-dev.toml`, `[agent] persistent_facts`.

Use this to standardize tool use and external systems for all dev work.
One file applies to every workflow the agent runs — build, code review,
test generation — and every engineer who pulls the repo inherits it.

**Example:** Amelia always uses Context7 for library docs and falls back to
Linear when a story is not in the epics list.

```toml
# _bmad/custom/bmad-agent-dev.toml

[agent]

persistent_facts = [
  "For any library documentation lookup (React, TypeScript, Zod, Prisma, etc.), call the context7 MCP tool (`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`) before relying on training-data knowledge. Up-to-date docs trump memorized APIs.",
  "When a story reference isn't found in {planning_artifacts}/epics.md, search Linear via `mcp__linear__search_issues` using the story ID or title before asking the user to clarify. If Linear returns a match, treat it as the authoritative story source.",
]
```

## Recipe 2: Enforce conventions inside one workflow

**File and key:** `_bmad/custom/bmad-product-brief.toml`, `[workflow] persistent_facts`.

Use this when the rule shapes the content of one workflow's output — for
compliance, audit, or a downstream consumer — and should not follow the
agent into other work. A `file:` entry loads a conventions document you
already maintain.

**Example:** every product brief carries compliance fields and follows the
organization's publishing conventions.

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

persistent_facts = [
  "Every brief must include an 'Owner' field, a 'Target Release' field, and a 'Security Review Status' field.",
  "Non-commercial briefs (internal tools, research projects) must still include a user-value section, but can omit market differentiation.",
  "file:{project-root}/docs/enterprise/brief-publishing-conventions.md",
]
```

The facts load before the workflow drafts, so the required fields are
known in time.

## Recipe 3: Publish completed output to external systems

**File and key:** `_bmad/custom/bmad-product-brief.toml`, `[workflow] on_complete`.

Use this to send finished output to an external system (Confluence, Notion,
SharePoint) and open follow-up work (Jira, Linear, Asana). `on_complete` is
the right hook because it runs exactly once, after the workflow's output is
written; `activation_steps_append` runs on every activation, before the
work starts.

**Example:** briefs publish to Confluence and offer an optional Jira epic.

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

on_complete = """
Publish and offer follow-up:

1. Read the finalized brief file path from the prior step.
2. Call `mcp__atlassian__confluence_create_page` with:
   - space: "PRODUCT"
   - parent: "Product Briefs"
   - title: the brief's title
   - body: the brief's markdown contents
   Capture the returned page URL.
3. Tell the user: "Brief published to Confluence: <url>".
4. Ask: "Want me to open a Jira epic for this brief now?"
5. If yes, call `mcp__atlassian__jira_create_issue` with:
   - type: "Epic"
   - project: "PROD"
   - summary: the brief's title
   - description: a short summary plus a link back to the Confluence page.
   Report the epic key and URL.
6. If no, exit cleanly.

If either MCP tool fails, report the failure, print the brief path,
and ask the user to publish manually.
"""
```

Publishing to Confluence does not change anyone else's work, so it runs
without asking. Creating a Jira epic is visible to the team, so confirm
first. If a tool fails, give the user the file path instead of dropping
the output.

## Recipe 4: Swap in your own output template

**File and key:** `_bmad/custom/bmad-product-brief.toml`, `[workflow] brief_template`.

Use this when the shipped structure does not match the format your
organization expects. The workflow ships `brief_template = "assets/brief-template.md"`,
a path relative to the skill; your override points at a file under
`{project-root}`, and the agent reads yours instead.

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
```

Keep templates under `{project-root}/docs/` or
`{project-root}/_bmad/custom/templates/` so they version alongside the
override file, and keep the shipped template's conventions (section
headings, frontmatter) so the agent adapts to what it finds. When several
teams share one repository, each can point at its own template from
`.user.toml` without touching the committed file.

## Recipe 5: Customize the agent roster

**File:** `_bmad/custom/config.toml` (team) or `_bmad/custom/config.user.toml` (personal).

Use central config to change who roster-driven skills (`bmad-party-mode`,
`bmad-retrospective`, `bmad-advanced-elicitation`) see, and to pin install
answers the whole team shares. Per-skill files shape how one agent behaves
when it activates; central config shapes what other skills see when they
look at the roster. See
[Central configuration](./customize-bmad.md#central-configuration) for the
file layout.

### 5a. Rebrand an agent for the whole team

**Key:** `[agents.bmad-agent-analyst] description`.

```toml
# _bmad/custom/config.toml (committed — applies to every developer)

[agents.bmad-agent-analyst]
description = "Mary the Regulatory-Aware Business Analyst — channels Porter and Minto, but lives and breathes FDA audit trails. Speaks like a forensic investigator presenting a case file."
```

Party mode introduces Mary with the new description. It does not change
how she works when she activates; that still comes from her `[agent]`
override, as in recipe 1.

### 5b. Add a fictional agent

**Key:** `[agents.<code>]` with a `team` value.

A full descriptor is enough for roster features; no skill folder is
needed. Personal files suit this, since a cast is a matter of taste.

```toml
# _bmad/custom/config.user.toml (personal — gitignored)

[agents.spock]
team = "startrek"
name = "Commander Spock"
title = "Science Officer"
icon = "🖖"
description = "Logic first, emotion suppressed. Begins observations with 'Fascinating.' Never rounds up. Counterpoint to any argument that relies on gut instinct."

[agents.mccoy]
team = "startrek"
name = "Dr. Leonard McCoy"
title = "Chief Medical Officer"
icon = "⚕️"
description = "Country doctor's warmth, short fuse. 'Dammit Jim, I'm a doctor not a ___.' Ethics-driven counterweight to Spock."
```

Ask party mode to "invite the Enterprise crew": it filters by
`team = "startrek"` and includes Spock and McCoy. You can include real
BMad agents in the same party.

### 5c. Pin team install settings

**Keys:** `[modules.bmm]` paths and `[core] document_output_language`.

The installer asks each developer for values such as the planning
artifacts path. When the team needs one answer, pin it here; it overrides
whatever a developer typed at install time.

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "{project-root}/shared/planning"
implementation_artifacts = "{project-root}/shared/implementation"

[core]
document_output_language = "English"
```

Personal settings such as `user_name`, `communication_language`, and
`user_skill_level` stay in each developer's own `_bmad/config.user.toml`;
the team file should not set them.

## Reinforce global rules in your IDE's session file

BMad customizations load when a skill activates. Most IDE tools also load
a global instruction file at the start of every session, before any skill
runs: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, or
`.github/copilot-instructions.md`. For a rule that should hold in a plain
chat with no skill active, restate it there too, if it is short enough to
repeat.

**Example:** one line in the repository's `CLAUDE.md` reinforcing the
dev-agent rule from recipe 1.

```markdown
Look up library docs through the context7 MCP tool (`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`) before relying on training-data knowledge.
```

Each layer owns its own scope:

| Layer | Scope | Use for |
|---|---|---|
| IDE session file (`CLAUDE.md` / `AGENTS.md`) | Every session, before any skill activates | Short, universal rules that should survive outside BMad |
| BMad agent customization | Every workflow the agent dispatches | Agent-specific behavior |
| BMad workflow customization | One workflow run | Output shape, publishing hooks, templates |
| BMad central config | Agent roster and shared install settings | Who is on the roster and which paths the team shares |

Keep the IDE file short. The model reads it every turn.

## Recipe 6: Advanced fields

**File and keys:** `_bmad/custom/bmad-prd.toml`, `[workflow] external_sources`,
`external_handoffs`, `doc_standards`, and template scalars.

Some workflows expose more fields than recipes 1 through 5 use. Check a
workflow's `customize.toml` to see which of these it has; the examples use
`bmad-prd`, which has all of them. The same pattern applies wherever a
field appears.

### On-demand knowledge sources

`external_sources` connects the workflow to internal knowledge bases,
competitive databases, or compliance references. The agent consults them
only when the conversation surfaces a matching need, never preemptively.

```toml
# _bmad/custom/bmad-prd.toml

[workflow]
external_sources = [
  "When the user mentions a competitor or market segment, query corp:competitive_db (category={project_name}) before drafting the differentiation section.",
  "For regulatory domains (healthcare, fintech, education), consult corp:compliance_reference before drafting domain-specific sections.",
]
```

Each entry names the MCP tool, the trigger, and the fields the tool needs.
If the tool is unavailable at runtime, the workflow falls back to standard
behavior and notes the gap.

### Automatic output publishing

`external_handoffs` sends finished artifacts to an external system after
the workflow finalizes. Unlike `on_complete` (recipe 3), it is an append
array: team entries stack, and each handoff fires independently.

```toml
# _bmad/custom/bmad-prd.toml

[workflow]
external_handoffs = [
  "After finalize, upload prd.md and addendum.md to Confluence via corp:confluence_upload (space_key='PROD', parent_page='PRDs', label='prd', author={user_name}). Capture and surface the returned page URL.",
  "Mirror to Notion via notion:create_page (database_id='abc123', title='PRD: ' + {project_name}).",
]
```

If a named tool is unavailable, that handoff is skipped and flagged; the
local files always exist.

### Finalize-time doc standards

At finalize, after the content is complete and before the user sees it,
`doc_standards` applies your writing standards to the document.
Each entry is a `skill:`, `file:`, or plain-text directive; the passes run
in declared order within a document. It is an append array, so your entries
stack on the workflow's shipped default
(`skill:bmad-review lenses=structure,prose`). Put broad structural passes
before narrow prose passes.

```toml
# _bmad/custom/bmad-prd.toml

[workflow]
doc_standards = [
  "file:{project-root}/docs/enterprise/voice-and-tone.md",
  "All dates must use ISO 8601 format (YYYY-MM-DD).",
  "Replace any use of 'leverage' with 'use'.",
]
```

### Swappable templates and checklists

Workflows that produce structured documents expose their template and
checklist paths as scalars. Point them at files under `{project-root}`, as
in recipe 4.

```toml
# _bmad/custom/bmad-prd.toml

[workflow]
# Regulated-industry PRD structure
prd_template = "{project-root}/docs/enterprise/prd-template-hipaa.md"

# Org-specific validation rubric
validation_checklist_template = "{project-root}/docs/enterprise/prd-checklist-regulated.md"
```

## Combining recipes

All six recipes compose. One workflow file can set `persistent_facts`
(recipe 2), `on_complete` (recipe 3), and `brief_template` (recipe 4); the
agent-wide rule (recipe 1) lives in a separate file under the agent's
name; central config (recipe 5) pins the roster and shared paths; advanced
fields (recipe 6) add sources and handoffs. Every layer applies.

```toml
# _bmad/custom/bmad-product-brief.toml (workflow)

[workflow]
persistent_facts = ["..."]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
on_complete = """ ... """
```

```toml
# _bmad/custom/bmad-agent-analyst.toml (agent — Mary dispatches product-brief)

[agent]
persistent_facts = ["Always include a 'Regulatory Review' section when the domain involves healthcare, finance, or children's data."]
```

Mary loads the regulatory-review rule when she activates. When the user
picks the product-brief menu item, the workflow adds its own conventions,
writes to the enterprise template, and publishes to Confluence on
completion. For planning with several people or teams, see
[Plan Inside an Organization](../plan/plan-inside-an-organization.md).

## Troubleshooting

**Override not taking effect?** Check that the file is under
`_bmad/custom/` with the exact skill directory name (`bmad-agent-dev.toml`,
not `bmad-dev.toml`). See
[Customize BMad](./customize-bmad.md#troubleshooting) for the rest.

**MCP tool name unknown?** Use the exact name the MCP server exposes in the
current session; ask your IDE assistant to list the available MCP tools.
A name written into `persistent_facts` or `on_complete` does nothing if
that server is not connected.
