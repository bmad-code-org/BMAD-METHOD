# Document Project Workflow

**Version:** 1.2.0
**Module:** BMM (BMAD Method Module)
**Type:** Action Workflow (Documentation Generator)

## Purpose

Analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for AI-assisted development. Generates a master index and multiple documentation files tailored to project structure and type.

**NEW in v1.2.0:** Context-safe architecture with scan levels, resumability, and write-as-you-go pattern to prevent context exhaustion.

## Key Features

- **Multi-Project Type Support**: Handles web, backend, mobile, CLI, game, embedded, data, infra, library, desktop, and extension projects
- **Multi-Part Detection**: Automatically detects and documents projects with separate client/server or multiple services
- **Three Scan Levels** (NEW v1.2.0): Quick (2-5 min), Deep (10-30 min), Exhaustive (30-120 min)
- **Resumability** (NEW v1.2.0): Interrupt and resume workflows without losing progress
- **Write-as-you-go** (NEW v1.2.0): Documents written immediately to prevent context exhaustion
- **Intelligent Batching** (NEW v1.2.0): Subfolder-based processing for deep/exhaustive scans
- **Data-Driven Analysis**: Uses CSV-based project type detection and documentation requirements
- **Comprehensive Scanning**: Analyzes APIs, data models, UI components, configuration, security patterns, and more
- **Architecture Matching**: Matches projects to 170+ architecture templates from the solutioning registry
- **Brownfield PRD Ready**: Generates documentation specifically designed for AI agents planning new features

## How to Invoke

```bash
workflow document-project
```

Or from BMAD CLI:

```bash
/bmad:bmm:workflows:document-project
```

## Scan Levels (NEW in v1.2.0)

Choose the right scan depth for your needs:

### 1. Quick Scan (Default)

**Duration:** 2-5 minutes
**What it does:** Pattern-based analysis without reading source files
**Reads:** Config files, package manifests, directory structure, README
**Use when:**

- You need a fast project overview
- Initial understanding of project structure
- Planning next steps before deeper analysis

**Does NOT read:** Source code files (_.js, _.ts, _.py, _.go, etc.)

### 2. Deep Scan

**Duration:** 10-30 minutes
**What it does:** Reads files in critical directories based on project type
**Reads:** Files in critical paths defined by documentation requirements
**Use when:**

- Creating comprehensive documentation for brownfield PRD
- Need detailed analysis of key areas
- Want balance between depth and speed

**Example:** For a web app, reads controllers/, models/, components/, but not every utility file

### 3. Exhaustive Scan

**Duration:** 30-120 minutes
**What it does:** Reads ALL source files in project
**Reads:** Every source file (excludes node_modules, dist, build, .git)
**Use when:**

- Complete project analysis needed
- Migration planning requires full understanding
- Detailed audit of entire codebase
- Deep technical debt assessment

**Note:** Deep-dive mode ALWAYS uses exhaustive scan (no choice)

## Resumability (NEW in v1.2.0)

The workflow can be interrupted and resumed without losing progress:

- **State Tracking:** Progress saved in `project-scan-report.json`
- **Auto-Detection:** Workflow detects incomplete runs (<24 hours old)
- **Resume Prompt:** Choose to resume or start fresh
- **Step-by-Step:** Resume from exact step where interrupted
- **Archiving:** Old state files automatically archived

**Example Resume Flow:**

```
> workflow document-project

I found an in-progress workflow state from 2025-10-11 14:32:15.

Current Progress:
- Mode: initial_scan
- Scan Level: deep
- Completed Steps: 5/12
- Last Step: step_5

Would you like to:
1. Resume from where we left off - Continue from step 6
2. Start fresh - Archive old state and begin new scan
3. Cancel - Exit without changes

Your choice [1/2/3]:
```

## What It Does

### Step-by-Step Process

1. **Detects Project Structure** - Identifies if project is single-part or multi-part (client/server/etc.)
2. **Classifies Project Type** - Matches against 12 project types (web, backend, mobile, etc.)
3. **Discovers Documentation** - Finds existing README, CONTRIBUTING, ARCHITECTURE files
4. **Analyzes Tech Stack** - Parses package files, identifies frameworks, versions, dependencies
5. **Conditional Scanning** - Performs targeted analysis based on project type requirements:
   - API routes and endpoints
   - Database models and schemas
   - State management patterns
   - UI component libraries
   - Configuration and security
   - CI/CD and deployment configs
6. **Generates Source Tree** - Creates annotated directory structure with critical paths
7. **Extracts Dev Instructions** - Documents setup, build, run, and test commands
8. **Creates Architecture Docs** - Generates detailed architecture using matched templates
9. **Builds Master Index** - Creates comprehensive index.md as primary AI retrieval source
10. **Validates Output** - Runs 140+ point checklist to ensure completeness

### Output Files

**Single-Part Projects:**

- `index.md` - Master index
- `project-overview.md` - Executive summary
- `architecture.md` - Detailed architecture
- `source-tree-analysis.md` - Annotated directory tree
- `component-inventory.md` - Component catalog (if applicable)
- `development-guide.md` - Local dev instructions
- `api-contracts.md` - API documentation (if applicable)
- `data-models.md` - Database schema (if applicable)
- `deployment-guide.md` - Deployment process (optional)
- `contribution-guide.md` - Contributing guidelines (optional)
- `project-scan-report.json` - State file for resumability (NEW v1.2.0)

**Multi-Part Projects (e.g., client + server):**

- `index.md` - Master index with part navigation
- `project-overview.md` - Multi-part summary
- `architecture-{part_id}.md` - Per-part architecture docs
- `source-tree-analysis.md` - Full tree with part annotations
- `component-inventory-{part_id}.md` - Per-part components
- `development-guide-{part_id}.md` - Per-part dev guides
- `integration-architecture.md` - How parts communicate
- `project-parts.json` - Machine-readable metadata
- `project-scan-report.json` - State file for resumability (NEW v1.2.0)
- Additional conditional files per part (API, data models, etc.)

## Data Files

The workflow uses three CSV files:

1. **project-types.csv** - Project type detection and classification
   - Location: `/bmad/bmm/workflows/3-solutioning/architecture/project-types/project-types.csv`
   - 12 project types with detection keywords

2. **registry.csv** - Architecture template matching
   - Location: `/bmad/bmm/workflows/3-solutioning/templates/registry.csv`
   - 170+ architecture patterns

3. **documentation-requirements.csv** - Scanning requirements per project type
   - Location: `/bmad/bmm/workflows/document-project/documentation-requirements.csv`
   - 24 columns of analysis patterns and requirements

## Use Cases

### Primary Use Case: Brownfield PRD Creation

After running this workflow, use the generated `index.md` as input to brownfield PRD workflows:

```
User: "I want to add a new dashboard feature"
PRD Workflow: Loads docs/index.md
→ Understands existing architecture
→ Identifies reusable components
→ Plans integration with existing APIs
→ Creates contextual PRD with epics and stories
```

### Other Use Cases

- **Onboarding New Developers** - Comprehensive project documentation
- **Architecture Review** - Structured analysis of existing system
- **Technical Debt Assessment** - Identify patterns and anti-patterns
- **Migration Planning** - Understand current state before refactoring

## Requirements

### Recommended Inputs (Optional)

- Project root directory (defaults to current directory)
- README.md or similar docs (auto-discovered if present)
- User guidance on key areas to focus (workflow will ask)

### Tools Used

- File system scanning (Glob, Read, Grep)
- Code analysis
- Git repository analysis (optional)

## Configuration

### Default Output Location

Files are saved to: `{output_folder}` (from config.yaml)

Default: `/docs/` folder in project root

### Customization

- Modify `documentation-requirements.csv` to adjust scanning patterns for project types
- Add new project types to `project-types.csv`
- Add new architecture templates to `registry.csv`

## Example: Multi-Part Web App

**Input:**

```
my-app/
├── client/     # React frontend
├── server/     # Express backend
└── README.md
```

**Detection Result:**

- Repository Type: Monorepo
- Part 1: client (web/React)
- Part 2: server (backend/Express)

**Output (10+ files):**

```
docs/
├── index.md
├── project-overview.md
├── architecture-client.md
├── architecture-server.md
├── source-tree-analysis.md
├── component-inventory-client.md
├── development-guide-client.md
├── development-guide-server.md
├── api-contracts-server.md
├── data-models-server.md
├── integration-architecture.md
└── project-parts.json
```

## Example: Simple CLI Tool

**Input:**

```
hello-cli/
├── main.go
├── go.mod
└── README.md
```

**Detection Result:**

- Repository Type: Monolith
- Part 1: main (cli/Go)

**Output (4 files):**

```
docs/
├── index.md
├── project-overview.md
├── architecture.md
└── source-tree-analysis.md
```

## Deep-Dive Mode

### What is Deep-Dive Mode?

When you run the workflow on a project that already has documentation, you'll be offered a choice:

1. **Rescan entire project** - Update all documentation with latest changes
2. **Deep-dive into specific area** - Generate EXHAUSTIVE documentation for a particular feature/module/folder
3. **Cancel** - Keep existing documentation

Deep-dive mode performs **comprehensive, file-by-file analysis** of a specific area, reading EVERY file completely and documenting:

- All exports with complete signatures
- All imports and dependencies
- Dependency graphs and data flow
- Code patterns and implementations
- Testing coverage and strategies
- Integration points
- Reuse opportunities

### When to Use Deep-Dive Mode

- **Before implementing a feature** - Deep-dive the area you'll be modifying
- **During architecture review** - Deep-dive complex modules
- **For code understanding** - Deep-dive unfamiliar parts of codebase
- **When creating PRDs** - Deep-dive areas affected by new features

### Deep-Dive Process

1. Workflow detects existing `index.md`
2. Offers deep-dive option
3. Suggests areas based on project structure:
   - API route groups
   - Feature modules
   - UI component areas
   - Services/business logic
4. You select area or specify custom path
5. Workflow reads EVERY file in that area
6. Generates `deep-dive-{area-name}.md` with complete analysis
7. Updates `index.md` with link to deep-dive doc
8. Offers to deep-dive another area or finish

### Deep-Dive Output Example

**docs/deep-dive-dashboard-feature.md:**

- Complete file inventory (47 files analyzed)
- Every export with signatures
- Dependency graph
- Data flow analysis
- Integration points
- Testing coverage
- Related code references
- Implementation guidance
- ~3,000 LOC documented in detail

### Incremental Deep-Diving

You can deep-dive multiple areas over time:

- First run: Scan entire project → generates index.md
- Second run: Deep-dive dashboard feature
- Third run: Deep-dive API layer
- Fourth run: Deep-dive authentication system

All deep-dive docs are linked from the master index.

## Validation

The workflow includes a comprehensive 160+ point checklist covering:

- Project detection accuracy
- Technology stack completeness
- Codebase scanning thoroughness
- Architecture documentation quality
- Multi-part handling (if applicable)
- Brownfield PRD readiness
- Deep-dive completeness (if applicable)

## Next Steps After Completion

1. **Review** `docs/index.md` - Your master documentation index
2. **Validate** - Check generated docs for accuracy
3. **Use for PRD** - Point brownfield PRD workflow to index.md
4. **Maintain** - Re-run workflow when architecture changes significantly

## File Structure

```
document-project/
├── workflow.yaml                    # Workflow configuration
├── instructions.md                  # Step-by-step workflow logic
├── checklist.md                     # Validation criteria
├── documentation-requirements.csv   # Project type scanning patterns
├── templates/                       # Output templates
│   ├── index-template.md
│   ├── project-overview-template.md
│   └── source-tree-template.md
└── README.md                        # This file
```

## Troubleshooting

**Issue: Project type not detected correctly**

- Solution: Workflow will ask for confirmation; manually select correct type

**Issue: Missing critical information**

- Solution: Provide additional context when prompted; re-run specific analysis steps

**Issue: Multi-part detection missed a part**

- Solution: When asked to confirm parts, specify the missing part and its path

**Issue: Architecture template doesn't match well**

- Solution: Check registry.csv; may need to add new template or adjust matching criteria

## Architecture Improvements in v1.2.0

### Context-Safe Design

The workflow now uses a write-as-you-go architecture:

- Documents written immediately to disk (not accumulated in memory)
- Detailed findings purged after writing (only summaries kept)
- State tracking enables resumption from any step
- Batching strategy prevents context exhaustion on large projects

### Batching Strategy

For deep/exhaustive scans:

- Process ONE subfolder at a time
- Read files → Extract info → Write output → Validate → Purge context
- Primary concern is file SIZE (not count)
- Track batches in state file for resumability

### State File Format

Optimized JSON (no pretty-printing):

```json
{
  "workflow_version": "1.2.0",
  "timestamps": {...},
  "mode": "initial_scan",
  "scan_level": "deep",
  "completed_steps": [...],
  "current_step": "step_6",
  "findings": {"summary": "only"},
  "outputs_generated": [...],
  "resume_instructions": "..."
}
```
