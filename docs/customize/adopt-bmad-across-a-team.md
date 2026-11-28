---
title: 'Adopt BMad Across a Team'
description: Practical recipes to make every teammate's BMad follow your organization's rules, tools, templates, and discussion casts without forking a skill.
sidebar:
  order: 2
---

When you roll BMad out to a team, you want every developer, designer, and PM to follow the same conventions, consult the same internal tools, and produce documents in the format your organization expects. Every recipe below saves its configuration under `_bmad/custom/` (or `_bmad/config.toml` via `bmad setup`), committed to your repository so teammates inherit it on `git pull`.

Choose where a rule belongs by how broadly it applies:

- Rules that apply whenever an engineer does implementation or review work belong on Amelia (`bmad-agent-dev`).
- Rules that apply to every structured document across Mary, John, Sally, Winston, Nadia, and Clio belong on `bmad-facilitate`.
- Rules that apply to one document type (such as every PRD or brief) belong in a template extension under `_bmad/custom/facilitate-templates/`.
- Shared repository settings (such as output folder or a brand design system) belong in `bmad setup`.

:::tip[Start with `bmad-customize` for Every Recipe]
You do not need to hand-author TOML files to roll these out. Open chat, invoke `/bmad-customize`, and paste or adapt the plain-English request at the start of each recipe. `bmad-customize` creates the right file under `_bmad/custom/` and verifies the merged result. For the full TOML schema and merge rules, see [Configuration and Customization Reference](../reference/configuration.md).
:::

Every per-skill customization has a team file (`_bmad/custom/<skill>.toml`, committed) and an optional personal file (`_bmad/custom/<skill>.user.toml`, gitignored) so individuals can layer personal preferences without changing team defaults.

## Recipe 1: Standardize Tools Across All Dev Work

Use this when every coding and review run should check the same documentation servers, internal libraries, or issue trackers. Placing the rule on Amelia (`bmad-agent-dev`) applies it to every workflow she dispatches.

Ask `bmad-customize` in chat:

```text
/bmad-customize For the whole team on Amelia (bmad-agent-dev): always look up
library documentation via our context7 MCP tool before relying on memory, and
if a ticket reference is missing from the local ticket tree, search Linear via
our Linear MCP tool before asking the user.
```

`bmad-customize` adds those standing facts to `_bmad/custom/bmad-agent-dev.toml`. Commit the file so every engineer gets the same behavior.

## Recipe 2: Enforce Conventions Across Facilitated Documents

`bmad-facilitate` powers every structured document written by Mary (`bmad-agent-analyst`), John (`bmad-agent-pm`), Sally (`bmad-agent-ux-designer`), and Winston (`bmad-agent-architect`), as well as Nadia (`bmad-founder-agent-advisor`) and Clio (`bmad-creative-agent-director`).

To apply an organization-wide publishing guide to every facilitated document, ask `bmad-customize`:

```text
/bmad-customize For the whole team on bmad-facilitate: load
docs/enterprise/publishing-conventions.md as standing context on every document run.
```

To add a rule to just one document type (for example, requiring a Compliance section on every product brief), tell `bmad-customize` about that document:

```text
/bmad-customize Every product brief needs a required Compliance section after
Scope capturing the owner, target release, and security review status.
```

`bmad-customize` writes a small template extension in `_bmad/custom/facilitate-templates/` rather than copying the whole template, so future updates to the shipped brief still reach your team. See [Customize a Document for Your Team](./customize-a-document-for-your-team.md) for a full walkthrough.

## Recipe 3: Publish Finished Documents to External Systems

Use a completion hook when finished documents should publish automatically to Confluence, Notion, or SharePoint, or offer to open a tracker epic once finalized.

Ask `bmad-customize`:

```text
/bmad-customize For the whole team on bmad-facilitate: after finalizing a
document, if its status is final, publish the markdown to Confluence space
"PRODUCT" under parent page "Planning" using our Atlassian MCP tool, share the
returned URL, and ask whether to open a Jira epic in project "PROD". If the
tool fails, report the error and print the local file path.
```

`bmad-customize` writes the instruction into `on_complete` (or `external_handoffs` if you want multiple independent publishing targets that stack) in `_bmad/custom/bmad-facilitate.toml`.

## Recipe 4: Apply Your Team's Brand and Document Formats

BMad separates project-wide visual branding from individual document templates:

- To apply a shared brand or design system, run `bmad setup` in chat and point the core tools `design_system` setting at your team's brand guide, CSS, or design-system doc so every facilitated HTML view across the project inherits it automatically unless a specific template overrides the look.
- To set a custom visual style or HTML default, ask `bmad-customize` to set `style` or `view` (`offer`, `always`, or `never`) on `bmad-facilitate` for your team.
- To use a custom template format when your organization already has a strict postmortem or PRD layout that differs sharply from the shipped version, ask `bmad-customize` to replace that template or create a dedicated variant (such as `prd-billing`) in `_bmad/custom/facilitate-templates/`. See [Write a Document Template](./write-a-document-template.md).

## Recipe 5: Build Shared Custom Discussion Casts

Multi-agent features (`bmad-party-mode`, `bmad-forge-idea`, and `bmad-advanced-elicitation`, plus team discussions that `bmad-retrospective` launches via `bmad-party-mode`) use your installed module agents by default.

To give your team a reusable review panel, customer focus group, or executive advisory room, ask `bmad-party-mode` directly in chat:

```text
/bmad-party-mode Create a team party called "launch-review-board" with a
skeptical security lead, an enterprise support manager, and a finance
controller. Scene: Pre-launch go/no-go review. Push for concrete rollback plans
and support readiness before anyone says ship. Save it for the whole team.
```

`bmad-party-mode` authors the custom `party_members` and `party_groups` entries in `_bmad/custom/bmad-party-mode.toml` via `bmad-customize`. Anyone on the team can then open that room by name (for example, "party mode with launch-review-board"), and `bmad-forge-idea` can draw from the same custom personas automatically. See [Run Multi-Agent Discussions](./run-multi-agent-discussions.md).

## Recipe 6: Pin Shared Project Settings

When every teammate should share the same output folder or module defaults, set those answers during `bmad setup` (which writes team-scope defaults to `_bmad/config.toml`) or pin overrides in `_bmad/custom/config.toml`. For example, to move `_bmad-output` to a shared folder across the team, ask `bmad` to update `core.output_folder` or pin `[core] output_folder` in `_bmad/custom/config.toml` (see [Configuration and Customization Reference](../reference/configuration.md)). Keep personal settings such as `core.active_initiative` out of the committed team file so teammates do not overwrite each other's active work.

## Recipe 7: Connect Knowledge Sources and Polish Rules

For teams with internal knowledge bases or strict editorial guidelines, `bmad-facilitate` supports three advanced workflow settings through `bmad-customize`:

| Setting | What it does |
| --- | --- |
| `external_sources` | Queries the MCP tools or internal databases you specify when specific topics (such as competitors or regulatory domains) come up during a session. |
| `external_handoffs` | Stacks multiple independent publishing targets (such as Confluence and Notion) that run after finalize while keeping local files intact if a tool is unavailable. |
| `doc_standards` | Points `bmad-facilitate` at your organization's writing guide (for example, `docs/enterprise/voice-and-tone.md`) or adds specific rules such as ISO 8601 dates, stacked on top of the default structural and prose review passes. |

Example prompt:

```text
/bmad-customize For the whole team on bmad-facilitate: add
docs/enterprise/voice-and-tone.md to doc_standards, require ISO 8601 dates
(YYYY-MM-DD), and when competitors come up, query corp:competitive_db before
drafting differentiation sections.
```

## Reinforce Universal Rules in `AGENTS.md`

BMad customizations load when a BMad skill runs. For short, universal rules that should also hold in plain coding chats when no BMad skill is active (such as using a specific test command or MCP documentation tool), keep them in your repository's `AGENTS.md` via `bmad-project-context` (see [Set and Maintain Project Context](../existing-codebases/set-and-maintain-project-context.md)).

| Layer | Scope | Best used for |
| --- | --- | --- |
| `AGENTS.md` (via `bmad-project-context`) | Every coding session, even outside BMad | Short repo-wide rules, command caveats, and observed pitfalls |
| Agent customization | Every workflow that agent runs | Role focus, tool defaults, and persistent domain rules |
| Workflow or template customization | One workflow or one document type | Review depth, required sections, editorial standards, publishing hooks |
| Shared project config (`bmad setup`) | Whole project | Output folder, design system, and module setup answers |

## Troubleshooting

- When an override does not take effect, ask `bmad-customize` to inspect your overrides, or verify the file under `_bmad/custom/` matches the exact skill directory name (for example, `bmad-agent-dev.toml`, not `bmad-dev.toml`).
- When an MCP tool does not run, confirm the exact tool name exposed by your connected MCP server in the current session, because a rule naming a disconnected server is skipped until that server is active.
- When you need exact TOML keys or CLI inspection commands, see [Configuration and Customization Reference](../reference/configuration.md). For multi-team planning workflows, see [Plan Inside an Organization](../plan/plan-inside-an-organization.md).
