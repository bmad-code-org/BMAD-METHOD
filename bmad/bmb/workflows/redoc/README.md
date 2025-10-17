# ReDoc - Reverse-Tree Documentation Engine

**Type:** Autonomous Action Workflow
**Module:** BMad Builder (bmb)

## Purpose

ReDoc is an intelligent documentation maintenance system for BMAD modules, workflows, and agents. It uses a reverse-tree approach (leaf folders first, then parent folders) to systematically generate and update README.md files with technical writer quality output.

The workflow understands BMAD conventions deeply and focuses documentation on distinctive features rather than explaining standard patterns, resulting in succinct, precise technical documentation.

## Key Features

- **Reverse-Tree Processing**: Documents from deepest folders up to module root, allowing child documentation to inform parent summaries
- **Convention-Aware**: Loads BMAD architecture patterns and only documents unique/distinctive aspects
- **Scalability**: Automatically creates catalog documents (WORKFLOWS-CATALOG.md, AGENTS-CATALOG.md) for massive folders (>10 items)
- **Diff-Aware**: Tracks `last-redoc-date` frontmatter to enable change detection since last run
- **Autonomous**: Runs without user checkpoints unless clarification is genuinely required
- **Comprehensive**: Reads ALL files completely before generating documentation (no partial reads)

## Usage

Invoke with a target path:

```
workflow redoc
```

When prompted, provide one of:

- **Module path**: `bmad/bmm` (documents entire module: root, workflows, agents)
- **Workflows folder**: `bmad/bmm/workflows` (documents all workflows)
- **Agents folder**: `bmad/bmm/agents` (documents all agents)
- **Single workflow**: `bmad/bmm/workflows/product-brief` (documents one workflow)
- **Single agent**: `bmad/bmm/agents/prd-agent.md` (documents one agent)

## Inputs

### Required

- **target_path**: Path to module, folder, or specific component to document

### Knowledge Base (Auto-loaded)

- agent-architecture.md
- agent-command-patterns.md
- agent-types.md
- module-structure.md
- workflow-creation-guide.md

## Outputs

### Created/Updated Files

- **README.md**: At each documented level (workflow folders, agent folders, module root)
- **Catalog files**: WORKFLOWS-CATALOG.md, AGENTS-CATALOG.md (for massive folders)
- **Frontmatter**: All READMEs include `last-redoc-date: <timestamp>`

### Summary Report

- Documentation coverage statistics
- List of files created/updated
- Any items requiring manual review

## Workflow Steps

1. **Initialize**: Load BMAD conventions and validate target
2. **Analyze Structure**: Build reverse-tree execution plan
3. **Process Leaves**: Document individual workflows/agents (deepest first)
4. **Process Folders**: Document workflow/agent collections with categorization
5. **Process Root**: Document module overview with links and highlights
6. **Validate**: Verify completeness and generate report
7. **Diff Analysis** (optional): Show changes since last redoc
8. **Complete**: Report success and suggest next steps

## Technical Details

- **Execution**: Autonomous with minimal user interaction
- **Quality**: Technical writer standards - succinct, precise, professional
- **Context-Aware**: Uses BMAD convention knowledge to highlight only distinctive features
- **Scalable**: Handles folders of any size with intelligent catalog creation

## Next Steps After Running

1. Review generated documentation for accuracy
2. If documenting a subfolder, run redoc on parent module to update references
3. Commit documentation updates with meaningful message
