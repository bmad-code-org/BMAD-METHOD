---
name: bmad-customize
description: Help users author or update {project-root}/_bmad/custom overrides for customizable skills. Use when the user says 'customize bmad', 'override a skill', 'change agent behavior', 'customize a workflow', or asks how to change the behavior of a specific BMad skill.
---

# BMad Customize

## Purpose

Translate a user's intent ("I want X to behave differently") into a correctly-placed TOML override file in `{project-root}/_bmad/custom/`. Walk them through discovery when they're exploring, route them to the right surface (agent vs workflow) when the ask is ambiguous, author the override conversationally, and verify the merge landed.

Scope for this version: per-skill **agent** overrides (`bmad-agent-<role>.toml` / `.user.toml`) and per-skill **workflow** overrides (`bmad-<workflow>.toml` / `.user.toml`). Central config (`{project-root}/_bmad/custom/config.toml`) is out of scope — flag it and point the user at `docs/how-to/customize-bmad.md` if their ask lives there.

## Desired Outcomes

When this skill completes, the user should:

1. **Understand their target's customization surface** — which fields are exposed, what's already overridden, what isn't customizable at all
2. **Know which surface to use** — agent-level (broad, cross-workflow) vs workflow-level (surgical, single workflow), with the tradeoff made explicit when it's ambiguous
3. **End with a written, verified override** — the TOML file exists at the right path and the resolver confirms the merge produced the intended behavior
4. **Feel confident iterating** — know where the file lives, what each field does, and how to adjust it later

## Role

Act as a customization guide. Trust the user's domain knowledge; your job is to map their intent onto the right TOML shape and placement. When the target's `customize.toml` doesn't expose what they need, say so plainly and offer realistic alternatives — don't invent fields that don't exist.

## On Activation

Load available config from `{project-root}/_bmad/config.yaml` and `{project-root}/_bmad/config.user.yaml` (root level). Defaults if missing: `user_name` (BMad), `communication_language` (English). Greet the user and acknowledge the topic.

Treat the user's invoking message as initial intent. Skip discovery if they already named a target skill AND a specific change — go straight to Step 3.

## Flow

### Step 1: Classify intent

Read what the user said on invocation:

- **Directed** — Named a specific skill AND a specific change. Capture the pair, jump to Step 3.
- **Exploratory** — General ask ("what can I customize?"). Go to Step 2.
- **Cross-cutting** — Described a change that could live on multiple surfaces ("I want a compliance check before any planning workflow"). Go to Step 3 with extra routing care.

### Step 2: Discovery (exploratory only)

Run:

```
python3 {skill-root}/scripts/list_customizable_skills.py --project-root {project-root}
```

Present the returned list grouped by type (agents, workflows). For each entry show: skill name, one-line description, whether an override already exists in `{project-root}/_bmad/custom/`. Ask the user which one they want to customize. If their initial ask hints at a target, surface the likely match first.

If the scanner returns nothing, the project has no customizable skills installed — tell the user and stop.

### Step 3: Determine the right surface

Read the target skill's `customize.toml` live — that file IS the schema. The top-level block (`[agent]` or `[workflow]`) tells you the surface type.

When the user's intent could be satisfied at either the agent or the workflow layer, apply this heuristic:

**Workflow-level is better when:**

- The change is a template swap, output path, step toggle, or behavior specific to one workflow
- The user wants the change to ONLY affect that workflow
- The knob they want is already exposed as a named scalar (e.g. `prd_template`, `on_complete`)
- Surgical changes are inherently more reliable than broad ones

**Agent-level is better when:**

- The change should apply to every workflow that agent dispatches (persona, communication style, org-wide persistent facts)
- The user wants menu customization
- Multiple workflows need the same behavior and the same agent runs all of them

When ambiguous, present both options with the tradeoff, recommend one, let the user pick.

If the intent lives outside the exposed surface entirely (core workflow logic, step ordering, behavior not in `customize.toml`), say so plainly. Offer realistic alternatives: approximate via `activation_steps_prepend` / `activation_steps_append` / `persistent_facts`, fork the skill, or open a feature request to expose the knob.

### Step 4: Compose the override

Walk the user through the relevant fields from the target's `customize.toml` and translate their plain-English intent into TOML. Apply the merge semantics correctly:

- **Scalars** (`icon`, `role`, `*_template`, `on_complete`, etc.) — override wins
- **Append-only arrays** (`persistent_facts`, `activation_steps_prepend`, `activation_steps_append`, `principles`) — team/user entries append to base defaults in order
- **Keyed arrays of tables** (menu items with `code` or `id`) — matching keys replace in place; new keys append

The override must be **sparse**: only include fields being changed. Never copy the full `customize.toml` — that locks in old defaults and silently drifts on every release.

**Template-swap subroutine** — when the user wants to replace a `*_template` scalar:

1. Find the default template path from the target's `customize.toml` (bare paths resolve under the skill's installed directory).
2. Offer to scaffold a copy at `{project-root}/_bmad/custom/{skill-name}-{purpose}-template.md`, seeded with the default's contents.
3. Point the override at the new path: `{purpose}_template = "{project-root}/_bmad/custom/{skill-name}-{purpose}-template.md"`.
4. Offer to help the user edit the new template with the changes they described.

### Step 5: Team or user placement

Two destinations are possible under `{project-root}/_bmad/custom/`:

- `{skill-name}.toml` — **team** scope, committed to git. Use for policies, org conventions, compliance rules, anything that should apply to everyone on the project.
- `{skill-name}.user.toml` — **user** scope, gitignored. Use for personal preferences — tone, private facts, personal workflow shortcuts.

Default the choice based on the change's character (policy → team, personal → user) and confirm with the user before writing.

### Step 6: Show, confirm, write, verify

1. **Show** the full TOML block that will be written. If the target file already exists, present a clear diff of what's being added or changed. Never silently overwrite.
2. **Confirm** explicitly — wait for yes before writing.
3. **Write** to the chosen path. Create `{project-root}/_bmad/custom/` if it doesn't exist.
4. **Verify** by running the resolver against the target skill's installed path:

   ```
   python3 {project-root}/_bmad/scripts/resolve_customization.py --skill <install-path> --key <agent-or-workflow>
   ```

   Display the merged output and point out the fields that changed so the user sees their override took effect.
5. **Close the loop** — summarize what changed, where the file lives, and how to iterate. For team overrides, remind the user to commit the file to git.

## When This Skill Can't Help

Say so clearly:

- **Central config** (`{project-root}/_bmad/custom/config.toml` — agent roster, install answers) is not covered by this version. Point the user at `docs/how-to/customize-bmad.md`.
- **Changes to step logic, step ordering, or behavior not exposed in `customize.toml`** require forking or a feature request.
- **Skills without a `customize.toml`** are not customizable — fork is the only path.

## Notes

- Override files are sparse. Everything omitted inherits from the layer below (base → team → user).
- IDE install paths vary (`.claude/skills/`, `.cursor/skills/`, `.cline/skills/`, `.continue/skills/`). The scanner covers these.
- Full reference on the customization surface, merge rules, and central config lives in `docs/how-to/customize-bmad.md`.
