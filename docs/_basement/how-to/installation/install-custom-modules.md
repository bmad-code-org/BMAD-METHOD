---
title: "How to Install Custom Modules"
description: Add custom agents, workflows, and modules to BMad
---

Use the BMad installer to add custom agents, workflows, and modules that extend BMad's functionality.

## When to Use This

- Adding third-party BMad modules to your project
- Installing your own custom agents or workflows
- Sharing custom content across projects or teams

:::note[Prerequisites]
- BMad installed in your project
- Custom content with a valid `module.yaml` file
:::

## Steps

### 1. Prepare Your Custom Content

Your custom content needs a `module.yaml` file. Choose the appropriate structure:

**For a cohesive module** (agents and workflows that work together):

```
module-code/
  module.yaml
  agents/
  workflows/
  tools/
  templates/
```

**For standalone items** (unrelated agents/workflows):

```
module-name/
  module.yaml        # Contains unitary: true
  agents/
    larry/larry.agent.md
    curly/curly.agent.md
  workflows/
```

Add `unitary: true` in your `module.yaml` to indicate items don't depend on each other.

### 2. Run the Installer

**New project:**

```bash
npx bmad-method install
```

When prompted "Would you like to install a local custom module?", select 'y' and provide the path to your module folder.

**Existing project:**

```bash
npx bmad-method install
```

1. Select `Modify BMad Installation`
2. Choose the option to add, modify, or update custom modules
3. Provide the path to your module folder

### 3. Verify Installation

Check that your custom content appears in the `_bmad/` directory and is accessible from your AI tool.

## What You Get

- Custom agents available in your AI tool
- Custom workflows accessible via `*workflow-name`
- Content integrated with BMad's update system

## Content Types

BMad supports several categories of custom content:

| Type                    | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| **Stand Alone Modules** | Complete modules with their own agents and workflows |
| **Add On Modules**      | Extensions that add to existing modules              |
| **Global Modules**      | Content available across all modules                 |
| **Custom Agents**       | Individual agent definitions                         |
| **Custom Workflows**    | Individual workflow definitions                      |

For detailed information about content types, see [Custom Content Types](https://github.com/bmad-code-org/bmad-builder/blob/main/docs/explanation/bmad-builder/custom-content-types.md).

## Updating Custom Content

When BMad Core or module updates are available, the quick update process:

1. Applies updates to core modules
2. Recompiles all agents with your customizations
3. Retains your custom content from cache
4. Preserves your configurations

You don't need to keep source module files locally—just point to the updated location during updates.

## Tips

- **Use unique module codes** — Don't use `bmm` or other existing module codes
- **Avoid naming conflicts** — Each module needs a distinct code
- **Document dependencies** — Note any modules your custom content requires
- **Test in isolation** — Verify custom modules work before sharing
- **Version your content** — Track updates with version numbers

:::caution[Naming Conflicts]
Don't create custom modules with codes like `bmm` (already used by BMad Method). Each custom module needs a unique code.
:::

## Example Modules

Find example custom modules in the `samples/sample-custom-modules/` folder of the [BMad repository](https://github.com/bmad-code-org/BMAD-METHOD). Download either sample folder to try them out.
