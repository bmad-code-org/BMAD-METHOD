---
title: "Document Project Workflow"
---

Analyzes and documents brownfield projects for AI-assisted development.

:::note[Quick Facts]
- **Module:** BMM (BMad Method Module)
- **Command:** `*document-project`
- **Agents:** Analyst, Technical Writer
- **Output:** Master index + documentation files in `{output_folder}`
:::

## Purpose

Scans your codebase, architecture, and patterns to create comprehensive reference documentation. Generates a master index and multiple documentation files tailored to your project structure and type.

## How to Invoke

```bash
*document-project
```

## Scan Levels

Choose the right depth for your needs:

### Quick Scan (Default)

**What it does:** Pattern-based analysis without reading source files

**Reads:** Config files, package manifests, directory structure, README

**Use when:**
- You need a fast project overview
- Initial understanding of project structure
- Planning next steps before deeper analysis

### Deep Scan

**What it does:** Reads files in critical directories based on project type

**Reads:** Files in critical paths defined by documentation requirements

**Use when:**
- Creating comprehensive documentation for brownfield PRD
- Need detailed analysis of key areas
- Want balance between depth and speed

### Exhaustive Scan

**What it does:** Reads ALL source files in project

**Reads:** Every source file (excludes node_modules, dist, build, .git)

**Use when:**
- Complete project analysis needed
- Migration planning requires full understanding
- Detailed audit of entire codebase

:::caution[Deep-Dive Mode]
Deep-dive mode always uses exhaustive scan — no choice of scan level.
:::

## Resumability

The workflow can be interrupted and resumed without losing progress:

- **State Tracking** — Progress saved in `project-scan-report.json`
- **Auto-Detection** — Workflow detects incomplete runs (<24 hours old)
- **Resume Prompt** — Choose to resume or start fresh
- **Step-by-Step** — Resume from exact step where interrupted
- **Archiving** — Old state files automatically archived
