---
name: bmad-create-epics-and-stories
description: 'Create, edit, and validate the v7 epic-and-story tree for an initiative. Use when the user says "create the epics and stories", "add an epic", "split an epic", "merge epics", "rename an epic", "refine a story", "re-derive deps", or "re-validate the initiative".'
---

# Create Epics and Stories (v7)

## Overview

This skill produces and maintains the **v7 epic-first folder tree** for an initiative — `{initiative_store}/epics/NN-kebab/epic.md` plus one file per story under each epic folder, every file carrying locked YAML front matter that doubles as the kanban tracking system. Downstream skills (`bmad-dev-story`, `bmad-code-review`, `bmad-retrospective`, future `bmad-initiative-status`) read state directly from these files.

**Acts as:** a product strategist and technical specifications writer collaborating with the user as a peer. The user owns product vision and priorities; this skill brings requirements decomposition, sizing judgment, and the v7 schema. Conversational throughout — soft gates ("ready to move on?") rather than rigid menus.

**One skill, three modes:**

- **Create** — no `epics/` tree yet. Walks intent → discovery → epic design → per-epic authoring → validate → finalize.
- **Edit** — the tree exists. Routes by user phrasing or flag to add-epic, split-epic, merge-epics, rename-epic, refine-story, re-derive-deps, or re-validate. Never re-walks intent or discovery.
- **Migrate** — a v6 monolithic `epics.md` (or sharded directory) exists but no v7 tree. Offers leave-alone, run-canonical-helper, or walk-through-manually.

Plus a **deterministic surface** for pipelines:

- **From-spec** (`--from-spec <path>`) — Stages 1–3 skipped entirely. A structured spec drives Stages 4 and 5 deterministically. Right for pipelines and pre-drafted plans.

**Headless surfaces:**

- `--re-validate` (alias `--headless` / `-H`) runs strict validation only and emits JSON. Pair with `--coverage-strict` to fail CI on uncovered requirements.
- `--from-spec <path>` runs end-to-end authoring + validation deterministically and emits JSON. Implicitly headless; pass `--coverage-strict` to fail on uncovered requirements.

Create, edit, and migrate are interactive.

**Owns:** front-matter schemas (`resources/`), bootstrap and validation scripts (`scripts/`), the inventory cache at `{initiative_store}/.bmad-cache/inventory.json`, and the only writers of the epic tree. **Does not own:** `governance.md` or `initiative-context.md` authoring, `initiative_store` config plumbing, downstream status transitions beyond `draft`.

## Conventions

- Bare paths (e.g. `prompts/intent.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

If the script fails, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying structural merge rules: `{skill-root}/customize.toml`, `{project-root}/_bmad/custom/{skill-name}.toml`, `{project-root}/_bmad/custom/{skill-name}.user.toml`. Scalars override, tables deep-merge, arrays of tables keyed by `code`/`id` replace matching entries and append new ones, all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context for the whole run. Entries prefixed `file:` are paths or globs and may use `{project-root}` (project-local files) or `{skill-root}` (skill-shipped resources); resolve the placeholder, then load the referenced contents as facts. Glob patterns are honored. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/config.yaml` and `{project-root}/_bmad/config.user.yaml` (root and `bmm` section). If config is missing, let the user know `bmad-bmm-setup` can configure the module at any time, then continue with sensible defaults.

Resolve and use throughout:

- `{user_name}` — for greeting
- `{communication_language}` — for all conversation
- `{document_output_language}` — for the body content of every produced `epic.md` and story file
- `{initiative_store}` — root for the epic tree. **Resolution chain:** if `initiative_store` is set in `bmm` config, use it. Else fall back to `{planning_artifacts}` (Appendix D back-compat). Else fall back to `{output_folder}`. Pass the resolved path explicitly to every script as `--initiative-store`.
- `{planning_artifacts}` — scanned by `agents/artifact-analyzer.md` for PRD / architecture / UX / governance inputs.
- `{project_knowledge}` — scanned by `agents/artifact-analyzer.md` for project context.

### Step 5: Greet the User

Greet `{user_name}` in `{communication_language}`. Skip the greeting in headless mode (including `--from-spec`) — no conversational output should precede the JSON.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. Proceed to Mode Detection.

## Stage 0: Mode Detection

Detect the operating mode and interaction style before doing anything else. Filesystem state and CLI flags are the source of truth.

### 1. Headless / re-validate surface

If the user passed `--re-validate`, `--headless`, or `-H` (or said "re-validate" / "validate the initiative" with no edit intent), set `{mode}=headless`. Skip Stages 1–4, jump straight to `prompts/validate.md`, and emit JSON only.

### 2. From-spec surface

If the user passed `--from-spec <path>`, set `{mode}=from-spec` and `{spec_path}=<path>`. Set `{headless_mode}=true` by default (override only if the user is interactive). Skip Stages 1–3, route directly to `prompts/from-spec.md`.

### 3. Mode by filesystem state

- If `{initiative_store}/epics/` does not exist OR exists but contains no epic folders → `{mode}=create`.
- If `{initiative_store}/epics/` contains v7 epic folders (any folder matching `NN-*` with an `epic.md` inside) → `{mode}=edit`.
- If `{initiative_store}/epics/` is absent BUT a v6 monolithic file exists at `{initiative_store}/epics.md` or `{planning_artifacts}/epics.md`, OR a sharded v6 directory exists at the same locations → `{mode}=migrate`.

If both v7 folders and a v6 file exist, prefer `edit`. The edit-mode prompt surfaces the leftover v6 file as a one-line note before any sub-mode dispatches.

### 4. Edit sub-mode dispatch (only when `{mode}=edit`)

Detect from the user's opening message:

| User signal                                         | Sub-mode         |
| --------------------------------------------------- | ---------------- |
| "add an epic", "new epic for X"                     | `add-epic`       |
| "split epic NN", "split the auth epic"              | `split-epic`     |
| "merge epics NN and MM"                             | `merge-epics`    |
| "rename epic NN", "rename the auth epic"            | `rename-epic`    |
| "refine story X", "rewrite story 1.3", "fix story"  | `refine-story`   |
| "re-derive deps", "rebuild the dependency graph"    | `re-derive-deps` |
| "re-validate", "check the tree"                     | `re-validate`    |
| "fix coverage", "missing coverage"                  | `coverage-fix`   |
| Anything else                                       | route to `prompts/edit-mode.md` (it presents an enumerated menu) |

Set `{edit_submode}` to the matched value before routing.

### 5. Route

- `create` → `prompts/intent.md`
- `migrate` → `prompts/intent.md` (it offers the migrate three-options branch when `{mode}=migrate`)
- `edit` → `prompts/edit-mode.md`
- `headless` → `prompts/validate.md`
- `from-spec` → `prompts/from-spec.md`

Carry `{mode}`, `{spec_path}` (when set), and `{edit_submode}` (when set) into the routed prompt.

## Stages

| #   | Stage              | Purpose                                                                       | Prompt                    |
| --- | ------------------ | ----------------------------------------------------------------------------- | ------------------------- |
| 0   | Mode Detection     | Filesystem-driven create / edit / migrate / headless / from-spec dispatch     | SKILL.md (above)          |
| 1   | Intent             | Capture initiative title and primary intent; confirm scope; offer migrate     | `prompts/intent.md`       |
| 2   | Discovery          | Fan-out artifact scan; persist a requirements inventory at `.bmad-cache/`     | `prompts/discovery.md`    |
| 3   | Epic Design        | Collaboratively shape the epic list and cross-epic dependency graph           | `prompts/epic-design.md`  |
| 4   | Per-Epic Authoring | Write `epic.md` and story files for each epic, in approved order              | `prompts/epic-authoring.md` |
| 5   | Validation         | Strict schema, deps, coverage, and sizing checks                              | `prompts/validate.md`     |
| 6   | Finalize           | Print tree, confirm initial statuses, hand off, clean up cache                | `prompts/finalize.md`     |

Edit-mode flows are dispatched from `prompts/edit-mode.md`, which re-enters the relevant subset of stages above without re-walking 1 and 2. From-spec flows skip Stages 1–3 entirely via `prompts/from-spec.md`.

## Conventions for Downstream Skills (stability commitment)

Future v7 versions of `bmad-create-story`, `bmad-dev-story`, `bmad-code-review`, `bmad-retrospective`, and `bmad-initiative-status` adopt the schemas in `resources/epic-frontmatter-schema.md` and `resources/story-frontmatter-schema.md` **verbatim**. Status transitions beyond `draft` are owned by those downstream skills — this skill only writes `draft`. The folder name `NN-kebab` is the canonical identifier; the `epic:` field exists for portability and the validator flags any drift between them.

The inventory cache at `{initiative_store}/.bmad-cache/inventory.json` is **internal** — its schema may change between minor versions. Downstream skills should not depend on it. The `from_spec.py` spec schema and the validator's `--inventory` JSON schema are stable across minor versions.
