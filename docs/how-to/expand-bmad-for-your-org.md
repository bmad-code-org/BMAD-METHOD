---
title: 'How to Expand BMad for Your Organization'
description: Five customization patterns that reshape BMad without forking — agent-wide rules, workflow conventions, external publishing, template swaps, and agent roster changes
sidebar:
  order: 9
---

BMad's customization surface lets an organization reshape behavior without editing installed files or forking skills. This guide walks through five recipes that cover most enterprise needs.

:::note[Prerequisites]

- BMad installed in your project (see [How to Install BMad](./install-bmad.md))
- Familiarity with the customization model (see [How to Customize BMad](./customize-bmad.md))
- Python 3.11+ on PATH (for the resolver — stdlib only, no `pip install`)
:::

## The Three-Layer Mental Model

Before picking a recipe, know where your override lands:

| Layer | Where overrides live | Scope |
|---|---|---|
| **Agent** (e.g. Amelia, Mary, John) | `[agent]` section of `_bmad/custom/bmad-agent-{role}.toml` | Travels with the persona into **every workflow the agent dispatches** |
| **Workflow** (e.g. product-brief, create-prd) | `[workflow]` section of `_bmad/custom/{workflow-name}.toml` | Applies only to that workflow's run |
| **Central config** | `[agents.*]`, `[core]`, `[modules.*]` in `_bmad/custom/config.toml` | Agent roster (who's available for party-mode, retrospective, elicitation), install-time settings pinned org-wide |

Rule of thumb: if the rule should apply everywhere an engineer does dev work, customize the **dev agent**. If it applies only when someone writes a product brief, customize the **product-brief workflow**. If it changes *who's in the room* (rename an agent, add a custom voice, enforce a shared artifact path), edit **central config**.

## Recipe 1: Shape an Agent Across Every Workflow It Dispatches

**Use case:** Standardize tool use and external system integrations so every workflow dispatched through an agent inherits the behavior. This is the highest-impact pattern.

**Example: Amelia (dev agent) always uses Context7 for library docs, and falls back to Linear when a story isn't found in the epics list.**

```toml
# _bmad/custom/bmad-agent-dev.toml

[agent]

# Applied on every activation. Carries into dev-story, quick-dev,
# create-story, code-review, qa-generate — every skill Amelia dispatches.
persistent_facts = [
  "For any library documentation lookup (React, TypeScript, Zod, Prisma, etc.), call the context7 MCP tool (`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`) before relying on training-data knowledge. Up-to-date docs trump memorized APIs.",
  "When a story reference isn't found in {planning_artifacts}/epics-and-stories.md, search Linear via `mcp__linear__search_issues` using the story ID or title before asking the user to clarify. If Linear returns a match, treat it as the authoritative story source.",
]
```

**Why this works:** Two sentences reshape every dev workflow in the org, with no per-workflow duplication and no source changes. Every new engineer who pulls the repo inherits the conventions automatically.

**Team file vs personal file:**
- `bmad-agent-dev.toml`: committed to git; applies to the whole team
- `bmad-agent-dev.user.toml`: gitignored; personal preferences layered on top

## Recipe 2: Enforce Organizational Conventions Inside a Specific Workflow

**Use case:** Shape the *content* of a workflow's output so it meets compliance, audit, or downstream-consumer requirements.

**Example: every product brief must include compliance fields, and the agent knows about the org's publishing conventions.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

persistent_facts = [
  "Every brief must include an 'Owner' field, a 'Target Release' field, and a 'Security Review Status' field.",
  "Non-commercial briefs (internal tools, research projects) must still include a user-value section, but can omit market differentiation.",
  "file:{project-root}/docs/enterprise/brief-publishing-conventions.md",
]
```

**What happens:** The facts load during Step 3 of the workflow's activation. When the agent drafts the brief, it knows the required fields and the enterprise conventions document. The shipped default (`file:{project-root}/**/project-context.md`) still loads, since this is an append.

## Recipe 3: Publish Completed Outputs to External Systems

**Use case:** Once the workflow produces its output, automatically publish to enterprise systems of record (Confluence, Notion, SharePoint) and open follow-up work (Jira, Linear, Asana).

**Example: briefs auto-publish to Confluence and offer optional Jira epic creation.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

# Terminal hook. Scalar override replaces the empty default wholesale.
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

**Why `on_complete` and not `activation_steps_append`:** `on_complete` runs exactly once, at the terminal stage, after the workflow's main output is written. That's the right moment to publish artifacts. `activation_steps_append` runs every activation, before the workflow does its work.

**Tradeoffs:**
- **Confluence publication is non-destructive** and always runs on completion
- **Jira epic creation is visible to the whole team** and kicks off sprint-planning signals, so gate it on user confirmation
- **Graceful fallback:** if MCP tools fail, hand off to the user rather than silently dropping the output

## Recipe 4: Swap in Your Own Output Template

**Use case:** The default output structure doesn't match your organization's expected format, or different orgs in the same repo need different templates.

**Example: point the product-brief workflow at an enterprise-owned template.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
```

**How it works:** The workflow's `customize.toml` ships with `brief_template = "resources/brief-template.md"` (bare path, resolves from skill root). Your override points at a file under `{project-root}`, so the agent reads your template in Stage 4 instead of the shipped one.

**Template authoring tips:**
- Keep templates in `{project-root}/docs/` or `{project-root}/_bmad/custom/templates/` so they version alongside the override file
- Use the same structural conventions as the shipped template (section headings, frontmatter); the agent adapts to what's there
- For multi-org repos, use `.user.toml` to let individual teams point at their own templates without touching the committed team file

## Recipe 5: Customize the Agent Roster

**Use case:** Change *who's in the room* for roster-driven skills like `bmad-party-mode`, `bmad-retrospective`, and `bmad-advanced-elicitation`, without editing any source or forking. Three common variants follow.

### 5a. Rebrand a BMad Agent Org-Wide

Every real agent has a descriptor the installer synthesizes from `module.yaml`. Override it to shift voice and framing across every roster consumer:

```toml
# _bmad/custom/config.toml (committed — applies to every developer)

[agents.bmad-agent-analyst]
description = "Mary the Regulatory-Aware Business Analyst — channels Porter and Minto, but lives and breathes FDA audit trails. Speaks like a forensic investigator presenting a case file."
```

Party-mode spawns Mary with the new description. The analyst activation itself still runs normally because Mary's behavior lives in her per-skill `customize.toml`. This override changes how **external skills perceive and introduce her**, not how she works internally.

### 5b. Add a Fictional or Custom Agent

A full descriptor is enough for roster-based features, with no skill folder needed. Useful for personality variety in party mode or brainstorming sessions:

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

Ask party-mode to "invite the Enterprise crew." It filters by `team = "startrek"` and spawns Spock and McCoy with those descriptors. Real BMad agents (Mary, Amelia) can sit at the same table if you ask them to.

### 5c. Pin Team Install Settings

The installer prompts each developer for values like `planning_artifacts` path. When the org needs one shared answer across the team, pin it in central config — any developer's local prompt answer gets overridden at resolution time:

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "{project-root}/shared/planning"
implementation_artifacts = "{project-root}/shared/implementation"

[core]
document_output_language = "English"
```

Personal settings like `user_name`, `communication_language`, or `user_skill_level` stay under each developer's own `_bmad/config.user.toml`. The team file shouldn't touch those.

**Why central config vs per-agent customize.toml:** Per-agent files shape how *one* agent behaves when it activates. Central config shapes what roster consumers *see when they look at the field:* which agents exist, what they're called, what team they belong to, and the shared install settings the whole repo agrees on. Two surfaces, different jobs.

## Reinforce Global Rules in Your IDE's Session File

BMad customizations load when a skill is activated. Many IDE tools also load a global instruction file at the **start of every session**, before any skill runs (`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, etc). For rules that should hold even outside BMad skills, restate the critical ones there too.

**When to double up:**
- A rule is important enough that a plain chat conversation (no skill active) should still follow it
- You want belt-and-suspenders enforcement because training-data defaults might otherwise pull the model off-course
- The rule is concise enough to repeat without bloating the session file

**Example: one line in the repo's `CLAUDE.md` reinforcing the dev-agent rule from Recipe 1.**

```markdown
<!-- Any file-read of library docs goes through the context7 MCP tool
(`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`)
before relying on training-data knowledge. -->
```

One sentence, loaded every session. It pairs with the `bmad-agent-dev.toml` customization so the rule applies both inside Amelia's workflows and during ad-hoc chats with the assistant. Each layer owns its own scope:

| Layer | Scope | Use for |
|---|---|---|
| IDE session file (`CLAUDE.md` / `AGENTS.md`) | Every session, before any skill activates | Short, universal rules that should survive outside BMad |
| BMad agent customization | Every workflow the agent dispatches | Agent-persona-specific behavior |
| BMad workflow customization | One workflow run | Workflow-specific output shape, publishing hooks, templates |
| BMad central config | Agent roster + shared install settings | Who's in the room and what shared paths the team uses |

Keep the IDE file **succinct**. A dozen well-chosen lines are more effective than a sprawling list. Models read it every turn, and noise crowds out signal.

## Combining Recipes

All five recipes compose. A realistic enterprise override for `bmad-product-brief` might set `persistent_facts` (Recipe 2), `on_complete` (Recipe 3), and `brief_template` (Recipe 4) in one file. The agent-level rule (Recipe 1) lives in a separate file under the agent's name, central config (Recipe 5) pins the shared roster and team settings, and all four apply in parallel.

```toml
# _bmad/custom/bmad-product-brief.toml (workflow-level)

[workflow]
persistent_facts = ["..."]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
on_complete = """ ... """
```

```toml
# _bmad/custom/bmad-agent-analyst.toml (agent-level — Mary dispatches product-brief)

[agent]
persistent_facts = ["Always include a 'Regulatory Review' section when the domain involves healthcare, finance, or children's data."]
```

Result: Mary loads the regulatory-review rule at persona activation. When the user picks the product-brief menu item, the workflow loads its own conventions on top, writes to the enterprise template, and publishes to Confluence on completion. Every layer contributes, and none of them required editing BMad source.

## Troubleshooting

**Override not taking effect?** Check that the file is under `_bmad/custom/` with the exact skill directory name (e.g. `bmad-agent-dev.toml`, not `bmad-dev.toml`). See [How to Customize BMad](./customize-bmad.md#troubleshooting).

**MCP tool name unknown?** Use the exact name the MCP server exposes in the current session. Ask Claude Code to list available MCP tools if unsure. Hardcoded names in `persistent_facts` or `on_complete` won't work if the MCP server isn't connected.

**Pattern doesn't apply to my setup?** The recipes above are illustrative. The underlying machinery (three-layer merge, structural rules, agent-spans-workflow) supports many more patterns; compose them as needed.
