---
title: "Monorepo / Multi-Project Setup"
description: Run multiple independent projects within a single BMAD installation
sidebar:
  order: 8
---

# Monorepo / Multi-Project Setup

BMAD supports running multiple independent projects within a single installation. This is useful for monorepos, multi-app repositories, or any workspace where you want isolated artifact directories per project.

## How It Works

A `.current_project` file in your `_bmad/` directory stores the active project name. This file is mutable local state: it should never be committed, because committing it can silently flip the active project context for other contributors and CI. Add `_bmad/.current_project` to your VCS ignore file, for example `.gitignore`. When set, all artifact output paths are redirected to project-specific subdirectories.

## Quick Start

1. List existing projects by invoking `skill:bmad-project-list`
2. Create a new project by invoking `skill:bmad-project-new` with a project name
3. Switch to an existing project by invoking `skill:bmad-project-switch` with a project name
4. Clear project context by invoking `skill:bmad-project-switch` and entering `CLEAR`

## Directory Structure

When a project context is active, for example `my-app`:

- `_bmad-output/my-app/planning-artifacts/` for PRDs, briefs, UX designs
- `_bmad-output/my-app/implementation-artifacts/` for sprint plans and stories
- `_bmad-output/my-app/knowledge/` for long-term project knowledge

## Inline Overrides

Temporarily target a different project without changing the global context:

- `#project:my-app`
- `#p:my-app`

**Precedence:**

1. Inline override (`#p:NAME`) — highest priority
2. Global context file (`.current_project`)
3. Default config paths

## Security

- Path traversal (`..`) is rejected
- Absolute paths are rejected
- Only alphanumeric characters, dots, dashes, and underscores are allowed
