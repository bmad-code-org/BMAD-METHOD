# Prompt: Generate External Modules Reference Page

## Goal

Create a reference documentation page at `docs/reference/modules.md` that lists all official external BMad modules with descriptions and links.

## Source of Truth

Read `tools/cli/external-official-modules.yaml` — this is the authoritative registry of official external modules. Use the module names, codes, npm package names, and repository URLs from this file.

## Research Step

For each module in the registry, visit its GitHub repository (url in the YAML record) 
and read its README to get:
- A 1-2 sentence description of what the module does
- The key agents and workflows it provides (if listed)
- Any notable features or use cases

## Output Format

Create `docs/reference/modules.md` following the project's Reference Catalog structure (see `docs/_STYLE_GUIDE.md`):

```
1. Title + Hook
2. Items (## for each module)
   - Brief description (one sentence)
   - **Key Info:** as flat list (code, npm package, GitHub link)
3. Installation note
```

## Style
use @docs/_STYLE_GUIDE.md

## Frontmatter

```yaml
---
title: Official Modules
---
```

## Content Requirements

- Start with a brief intro explaining that BMad extends through official modules selected during installation
- For each module include:
  - `##` header with module name
  - 1-2 sentence description (sourced from GitHub README, not just the registry's short description)
  - Key info list: module code, npm package (linked), GitHub repo (linked)
  - Brief bullet list of what it provides (agents, workflows, key features) — keep to 3-5 bullets
- Include a `:::tip` admonition about how to install modules (via `npx bmad-method` installer)
- Mention that community modules and a marketplace are coming
- Do NOT include built-in modules (core, bmm) — this page is specifically for external/add-on modules

## Existing Pages for Reference

Look at these files to match the tone and style of existing reference docs:
- `docs/reference/agents.md`
- `docs/reference/commands.md`
- `docs/reference/testing.md`
