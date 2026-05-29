---
name: bmad-devlog-setup
description: One-time setup for the acme-devlog module. Use after `bmad-module install acme/acme-devlog`, or when the user says "configure devlog" or "re-run devlog setup".
---

# Devlog Setup

Installs and configures the devlog module by reading `assets/module.yaml`, collecting answers to its prompts, and writing `_bmad/devlog/config.yaml`.

This skill is invoked automatically by `bmad-module install` (via `bmad.install.postInstallSkill`). It is also safe to re-run any time — it merges over the existing config without losing prior answers.

## EXECUTION

### Step 1: Load the module definition

Read `./assets/module.yaml` from the skill root. Parse its prompt entries (e.g. `devlog_path`, `entry_format`).

### Step 2: Collect answers

For each prompt, ask the user. Show the default in parens. Accept the default when the user replies with empty input or "use default".

If `_bmad/devlog/config.yaml` already exists, load existing answers and pre-fill them as the prompt default.

### Step 3: Apply variable substitution

Resolve `{value}`, `{project-root}`, and `{output_folder}` placeholders using each prompt's `result:` template.

### Step 4: Write config

Write the resolved key/value map to `_bmad/devlog/config.yaml` (YAML, 2-space indent, keys sorted).

### Step 5: Create directories

Ensure `{devlog_path}` exists on disk. Create it if absent.

### Step 6: Confirm

Print:

```
Devlog configured.
  devlog_path:  <resolved>
  entry_format: <resolved>
Try `/bmad-devlog-write` to create today's entry.
```
