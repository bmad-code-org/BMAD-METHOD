---
name: bmad-customize
description: Help users author or update project level custom overrides for customizable skills. Use when the user says 'customize bmad', 'override a skill', 'change agent behavior', 'customize a workflow', or asks how to change the behavior of a specific BMad skill.
---

# BMad Customize

## Overview

Translate a user's intent ("I want X to behave differently") into a correctly-placed TOML override file in `{project-root}/_bmad/custom/`. Walk them through discovery when they're exploring, route them to the right surface (agent vs workflow) when the ask is ambiguous, author the override conversationally, and verify the merge landed.

**What customization means in BMad.** Every customizable skill ships a `customize.toml` that declares the knobs it exposes — scalars, arrays, and keyed tables under `[agent]` or `[workflow]`. Users never edit that file. Instead, they write sparse override files to `{project-root}/_bmad/custom/`, and the resolver merges base → team → user at activation. This skill's job is to help users author those override files correctly. Users typically arrive either with a specific skill and change in mind ("make bmad-create-prd require a brief first") or with a broader want ("the PM agent should speak more formally"); you handle both.

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

### Preflight

Before any other work, verify the project environment supports this skill:

- **No `{project-root}/_bmad/` directory** → BMad is not installed in this project. Tell the user, point them at the BMad install docs, and stop. Don't pretend to discover skills.
- **`{project-root}/_bmad/scripts/resolve_customization.py` missing** → BMad is present but the resolver isn't. Warn the user that the verification step in Step 6 will fall back to a manual check (read the merged files directly and describe what the override will do). Continue.
- **Both present** → normal path, proceed.

### Config and greet

Load available config from `{project-root}/_bmad/config.yaml` and `{project-root}/_bmad/config.user.yaml` (root level). Defaults if missing: `user_name` (BMad), `communication_language` (English). Greet the user and acknowledge the topic.

Treat the user's invoking message as initial intent. Skip discovery if they already named a target skill AND a specific change — go straight to Step 3.

## Flow

### Step 1: Classify intent

Read what the user said on invocation:

- **Directed** — Named a specific skill AND a specific change. Capture the pair, jump to Step 3.
- **Exploratory** — General ask ("what can I customize?"). Go to Step 2.
- **Audit / iterate** — Wants to review or modify something already customized ("what have I overridden?", "change my bmad-create-prd gate"). Go to Step 2 with audit framing — lead with skills that already have overrides, and when one is picked, read its existing override first.
- **Cross-cutting** — Described a change that could live on multiple surfaces ("I want a compliance check before any planning workflow", "make every PM response include a risk line"). Go to Step 3 with the explicit goal of choosing agent vs workflow and, if agent, pinning down which one.

### Step 2: Discovery

Run:

```
python3 {skill-root}/scripts/list_customizable_skills.py --project-root {project-root}
```

The scanner derives its own skills directory from its install location — whichever directory `bmad-customize` itself was loaded from is where it looks for siblings. That's the same location the user's other skills are loaded from in this session. If the user mentions skills installed in another location as well (e.g. project-local plus a user-global install), re-run the scanner with one or more `--extra-root <path>` flags to include those.

The scanner returns JSON with `agents`, `workflows`, `scanned_roots`, and `errors`.

- **Present the list** grouped by type. For each entry show: skill name, one-line description, whether a team or user override already exists.
- **For audit/iterate intents**, lead with entries where `has_team_override` or `has_user_override` is true.
- **Surface any non-empty `errors[]`** — malformed `customize.toml` files and other scanner issues should be shown to the user, not swallowed.
- **If the list is empty**, show `scanned_roots` so the user can see what was searched. Ask whether they have skills installed in another location; if so, re-run with `--extra-root` pointing there. If they don't, say the project has no customizable skills installed and stop.

Ask the user which one they want to customize. If their initial ask hints at a target, surface the likely match first.

### Step 3: Determine the right surface

Read the target skill's `customize.toml` live — that file IS the schema. The top-level block (`[agent]` or `[workflow]`) tells you the surface type.

**If an override file already exists** (`has_team_override` or `has_user_override` from Step 2's scan — or the file is present on disk), read it before composing. Summarize what's currently overridden so the user knows what they're iterating against, not re-authoring from scratch.

**When the user's intent is Cross-cutting** — it could live at either agent or workflow layer — explicitly walk both surfaces with them:

- If they want the change to apply to every workflow a given agent runs, the agent surface is right (e.g. `bmad-agent-pm.toml` with `persistent_facts` or `principles`).
- If they want it scoped to one workflow, the workflow surface is right (e.g. `bmad-create-prd.toml` with `activation_steps_prepend`).
- If they want it scoped to several specific workflows, that's multiple workflow overrides, not an agent override — say so; multi-surface authoring is fine, do them in sequence.

**When the knob is clearly single-surface**, apply the heuristic:

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

Walk the user through the relevant fields from the target's `customize.toml` and translate their plain-English intent into TOML. If an existing override was read in Step 3, frame the conversation as "add/change these fields on top of what's already there" rather than starting blank.

Apply the merge semantics correctly:

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

   **If the resolver is missing or fails**, fall back: read the three files (`<install-path>/customize.toml`, the written override, and any sibling `.user.toml`) directly, describe how the merge resolves for the fields the user just changed, and tell them the normal verify path is unavailable in this environment.

   **If verification shows the override did not take effect** (field unchanged, resolver reports merge conflict, override file not picked up), do not declare success. Explain what the resolver showed, re-enter Step 4 with the verify output as new context — usually the fix is a field name, merge-mode mismatch (e.g. wrote a scalar where the base expects an array), or wrong placement scope.

5. **Close the loop** — summarize what changed, where the file lives, and how to iterate. For team overrides, remind the user to commit the file to git.

### Completion

The skill run is complete when all of the following are true:

- The override file exists at the chosen path, or the user explicitly aborted.
- The user has seen the resolver output (or the fallback manual merge summary) showing the intended fields took effect.
- The user has acknowledged the summary from step 6.5 — they know where the file lives and how to iterate.

If any of these is missing, the skill is not done — either finish the remaining part or state explicitly that the user is exiting incomplete.

## When This Skill Can't Help

Say so clearly:

- **Central config** (`{project-root}/_bmad/custom/config.toml` — agent roster, install answers) is not covered by this version. Point the user at `docs/how-to/customize-bmad.md`.
- **Changes to step logic, step ordering, or behavior not exposed in `customize.toml`** require a customization feature request or using bmad builder to create a custom skill. Offer to help with either path.
- **Skills without a `customize.toml`** are not customizable — fork is the only path.

## Notes

- Override files are sparse. Everything omitted inherits from the layer below (base → team → user).
- The scanner does not hardcode IDE paths. It scans whichever directory this skill itself was loaded from — that's the same place the user's other skills live in this session. For mixed project-local + user-global setups, use `--extra-root`.
- Full reference on the customization surface, merge rules, and central config lives in `docs/how-to/customize-bmad.md`.
