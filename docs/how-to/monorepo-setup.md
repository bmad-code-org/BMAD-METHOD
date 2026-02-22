---
title: "Set Up Monorepo Support"
description: Manage multiple projects in a single repository with isolated artifacts
sidebar:
  order: 8
---

BMad Method supports working in monorepo environments where multiple projects share a single repository. This allows you to centralize methodology files while keeping project artifacts isolated and organized.

:::note[Prerequisites]
- BMad Method v6.0.1+
- A repository containing multiple projects
:::

## Why Use Monorepo Support?

In a standard setup, BMad expects one project per repository. In a monorepo, you might have `apps/frontend`, `apps/backend`, and `packages/shared`. Without monorepo support, BMad's artifacts (plans, architecture, stories) would be mixed or require installing BMad in every sub-directory.

Monorepo support allows you to:
- **Centralize Methodology**: Install BMad once at the root based on your team's process.
- **Isolate Artifacts**: Automatically route outputs to project-specific folders (e.g., `_bmad-output/frontend/`).
- **Context Switch Easily**: Switch between projects without reinstalling or reconfiguring.

## Project Structure

When monorepo support is active, the structure changes slightly to accommodate multiple projects:

```
monorepo-root/
├── _bmad/                         # Methodology (installed core & modules)
│   └── .current_project           # Context marker (e.g., "app-alpha")
├── _bmad-output/                  # Unified output directory
│   ├── app-alpha/                 # Sub-project artifacts
│   │   ├── planning-artifacts/
│   │   └── implementation-artifacts/
│   └── app-beta/                  # Sub-project artifacts
│       └── planning-artifacts/
├── apps/                          # Actual source code
│   ├── app-alpha/
│   └── app-beta/
└── package.json
```

## How It Works

### Context Injection

Core and BMM workflows automatically check for the existence of `{project-root}/_bmad/.current_project`.
- **If found**: It reads the content (e.g., "app-alpha") and overrides the `output_folder` to `_bmad-output/app-alpha`.
- **If not found**: It behaves like a standard single-project installation, outputting to `_bmad-output` root.

### The /list-envs Command

You can view all available environments created in your monorepo by running the `/list-envs` command. This will scan your `_bmad-output/` directory and display all existing project environments, as well as indicate which one is currently active.

### The /set-project Command

You can easily manage the active project context using the `/set-project` workflow.

**To set a context:**
1. Run `/set-project <env_name>` in your chat.
2. If the environment does not exist, you will be prompted to create it interactively.
3. If you run `/set-project` without an argument, it will automatically list available environments and prompt you to select one or create a new one.

**To clear context (return to single-project mode):**
1. Run `/set-project CLEAR`.

### Inline Override

You can temporarily override the project context for a specific command without changing the global `.current_project` state. This is useful for one-off tasks in a different project.

Use the `#project:` syntax (or `#p:` for short) anywhere in your prompt:

```bash
# Full syntax
/create-prd #project:myproject_name

# Short alias
/create-story #p:frontend
```

**Note:** The inline override takes precedence over the `.current_project` file. If no project is specified via `#` or `.current_project`, BMad defaults to the root `_bmad-output` folder.
