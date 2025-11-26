# BMM Claude Code Sub-Module

## Overview

This sub-module provides Claude Code-specific enhancements for the BMM module, including specialized subagents and content injection for enhanced AI-assisted development workflows.

## How the Installer Works

When Claude Code is selected during BMAD installation:

1. **Module Detection**: The installer checks for `sub-modules/claude-code/` in each selected module
2. **Configuration Loading**: Reads `injections.yaml` to understand what to inject and which subagents are available
3. **User Interaction**: Prompts users to:
   - Choose subagent installation (all/selective/none)
   - Select installation location (project `.claude/agents/` or user `~/.claude/agents/`)
4. **Selective Installation**: Based on user choices:
   - Copies only selected subagents to Claude's agents directory
   - Injects only relevant content at defined injection points
   - Skips injection if no subagents selected

## Subagent Directory

### Product Management Subagents

| Subagent                 | Purpose                                  | Used By    | Recommended For                               |
| ------------------------ | ---------------------------------------- | ---------- | --------------------------------------------- |
| **market-researcher**    | Competitive analysis and market insights | PM Agent   | PRD creation (`*create-prd`), market analysis |
| **requirements-analyst** | Extract and validate requirements        | PM Agent   | Requirements sections, user story creation    |
| **technical-evaluator**  | Technology stack evaluation              | PM Agent   | Technical assumptions in PRDs                 |
| **epic-optimizer**       | Story breakdown and sizing               | PM Agent   | Epic details, story sequencing                |
| **document-reviewer**    | Quality checks and validation            | PM/Analyst | Final document review before delivery         |

### Architecture and Documentation Subagents

| Subagent                   | Purpose                                   | Used By   | Recommended For                                |
| -------------------------- | ----------------------------------------- | --------- | ---------------------------------------------- |
| **codebase-analyzer**      | Project structure and tech stack analysis | Architect | `*generate-context-docs` (doc-proj task)       |
| **dependency-mapper**      | Module and package dependency analysis    | Architect | Brownfield documentation, refactoring planning |
| **pattern-detector**       | Identify patterns and conventions         | Architect | Understanding existing codebases               |
| **tech-debt-auditor**      | Assess technical debt and risks           | Architect | Brownfield architecture, migration planning    |
| **api-documenter**         | Document APIs and integrations            | Architect | API documentation, service boundaries          |
| **test-coverage-analyzer** | Analyze test suites and coverage          | Architect | Test strategy, quality assessment              |

## Adding New Subagents

1. **Create the subagent file** in `sub-agents/`:

   ```markdown
   ---
   name: your-subagent-name
   description: Brief description. use PROACTIVELY when [specific scenario]
   tools: Read, Write, Grep # Specify required tools - check claude-code docs to see what tools are available, or just leave blank to allow all
   ---

   [System prompt describing the subagent's role and expertise]
   ```

2. **Add to injections.yaml**:
   - Add filename to `subagents.files` list
   - Update relevant agent injection content if needed

3. **Create injection point** (if new agent):
   ```xml
   <!-- IDE-INJECT-POINT: agent-name-instructions -->
   ```

## Injection Points

All injection points in this module are documented in: `{project-root}{output_folder}/injection-points.md` - ensure this is kept up to date.

Injection points allow IDE-specific content to be added during installation without modifying source files. They use HTML comment syntax and are replaced during the installation process based on user selections.

## Configuration Files

- **injections.yaml**: Defines what content to inject and where
- **config.yaml**: Additional Claude Code configuration (if needed)
- **sub-agents/**: Directory containing all subagent definitions

## Testing

To test subagent installation:

1. Run the BMAD installer
2. Select BMM module and Claude Code
3. Verify prompts appear for subagent selection
4. Check `.claude/agents/` for installed subagents
5. Verify injection points are replaced in `.claude/commands/{bmad_folder}/` and the various tasks and templates under `{bmad_folder}/...`
