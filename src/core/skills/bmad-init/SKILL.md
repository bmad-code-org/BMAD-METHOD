---
name: bmad-init
description: "Initialize BMad project configuration and load config variables. Use when any skill needs module-specific configuration values, or when setting up a new BMad project."
argument-hint: "[--module=module_code] [--vars=var1:default1,var2] [--skill-path=/path/to/calling/skill]"
---

## Overview

This skill is the configuration entry point for all BMad skills. It has two modes:

- **Fast path**: Config exists for the requested module — returns vars as JSON. Done.
- **Init path**: Config is missing — walks the user through configuration, writes config files, then returns vars.

Every BMad skill should call this on activation to get its config vars. The caller never needs to know whether init happened — they just get their config back.

## On Activation — Fast Path

Run the loader script. If a module code was provided by the calling skill, include it. Otherwise core vars are returned.

```bash
python scripts/bmad_init.py load --module {module_code} --all --project-root {project-root}
```

Or for core only (no module specified):

```bash
python scripts/bmad_init.py load --all --project-root {project-root}
```

To request specific variables with defaults:

```bash
python scripts/bmad_init.py load --module {module_code} --vars var1:default1,var2 --project-root {project-root}
```

**If the script returns JSON vars** — store them as `{var-name}` and return to the calling skill. Done.

**If the script returns an error or `init_required`** — proceed to the Init Path below.

## Init Path — First-Time Setup

When the fast path fails (config missing for a module), run this init flow.

### Step 1: Check what needs setup

```bash
python scripts/bmad_init.py check --module {module_code} --skill-path {calling_skill_path} --project-root {project-root}
```

The response tells you what's needed:

- `"status": "ready"` — Config is fine. Re-run load.
- `"status": "no_project"` — Can't find project root. Ask user to confirm the project path.
- `"status": "core_missing"` — Core config doesn't exist. Must ask core questions first.
- `"status": "module_missing"` — Core exists but module config doesn't. Ask module questions.

The response includes:
- `core_module` — Core module.yaml questions (when core setup needed)
- `target_module` — Target module.yaml questions (when module setup needed, discovered from `--skill-path` or `_bmad/{module}/`)
- `core_vars` — Existing core config values (when core exists but module doesn't)

### Step 2: Ask core questions (if `core_missing`)

The check response includes `core_module` with header, subheader, and variable definitions.

1. Show the `header` and `subheader` to the user
2. For each variable, present the `prompt` and `default`
3. For variables with `single-select`, show the options as a numbered list
4. For variables with multi-line `prompt` (array), show all lines
5. Let the user accept defaults or provide values

### Step 3: Ask module questions (if module was requested)

The check response includes `target_module` with the module's questions. Variables may reference core answers in their defaults (e.g., `{output_folder}`).

1. Resolve defaults using core answers:
```bash
python scripts/bmad_init.py resolve-defaults --module {module_code} --core-answers '{core_answers_json}' --project-root {project-root}
```
2. Show the module's `header` and `subheader`
3. For each variable, present the prompt with resolved default
4. For `single-select` variables, show options as a numbered list

### Step 4: Write config

Collect all answers and write them:

```bash
python scripts/bmad_init.py write --answers '{all_answers_json}' --project-root {project-root}
```

The `--answers` JSON format:

```json
{
  "core": {
    "user_name": "BMad",
    "communication_language": "English",
    "document_output_language": "English",
    "output_folder": "_bmad-output"
  },
  "bmb": {
    "bmad_builder_output_folder": "_bmad-output/skills",
    "bmad_builder_reports": "_bmad-output/reports"
  }
}
```

Note: Pass the **raw user answers** (before result template expansion). The script applies result templates and `{project-root}` expansion when writing.

The script:
- Creates `_bmad/core/config.yaml` with core values (if core answers provided)
- Creates `_bmad/{module}/config.yaml` with core values + module values (result-expanded)
- Creates any directories listed in the module.yaml `directories` array

### Step 5: Return vars

After writing, re-run the fast-path loader to return resolved vars:

```bash
python scripts/bmad_init.py load --module {module_code} --all --project-root {project-root}
```

Store returned vars as `{var-name}` and return them to the calling skill.
