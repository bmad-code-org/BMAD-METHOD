# Document Project Workflow - Technical Reference

**Module:** BMM (BMAD Method Module)

## Purpose

Analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for AI-assisted development. Generates a master index and multiple documentation files tailored to project structure and type.

## How to Invoke
```bash
/bmad:bmm:workflows:document-project
```
---

## Scan Levels

Choose the right scan depth for your needs:

### 1. Quick Scan (Default)

**What it does:** Pattern-based analysis without reading source files
**Reads:** Config files, package manifests, directory structure, README
**Use when:**

- You need a fast project overview
- Initial understanding of project structure
- Planning next steps before deeper analysis

**Does NOT read:** Source code files (`_.js`, `_.ts`, `_.py`, `_.go`, etc.)

### 2. Deep Scan

**What it does:** Reads files in critical directories based on project type
**Reads:** Files in critical paths defined by documentation requirements
**Use when:**

- Creating comprehensive documentation for brownfield PRD
- Need detailed analysis of key areas
- Want balance between depth and speed

**Example:** For a web app, reads controllers/, models/, components/, but not every utility file

### 3. Exhaustive Scan

**What it does:** Reads ALL source files in project
**Reads:** Every source file (excludes node_modules, dist, build, .git)
**Use when:**

- Complete project analysis needed
- Migration planning requires full understanding
- Detailed audit of entire codebase
- Deep technical debt assessment

**Note:** Deep-dive mode ALWAYS uses exhaustive scan (no choice)

---

## Resumability

The workflow can be interrupted and resumed without losing progress:

- **State Tracking:** Progress saved in `project-scan-report.json`
- **Auto-Detection:** Workflow detects incomplete runs (<24 hours old)
- **Resume Prompt:** Choose to resume or start fresh
- **Step-by-Step:** Resume from exact step where interrupted
- **Archiving:** Old state files automatically archived

**Related Documentation:**

- [Brownfield Development Guide](./brownfield-guide.md)
- [Implementation Workflows](./workflows-implementation.md)
