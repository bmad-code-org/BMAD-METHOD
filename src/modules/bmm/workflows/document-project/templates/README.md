# Document Project Workflow Templates

This directory contains template files for the `document-project` workflow.

## Template Files

- **index-template.md** - Master index template (adapts for single/multi-part projects)
- **project-overview-template.md** - Executive summary and high-level overview
- **source-tree-template.md** - Annotated directory structure

## Template Usage

The workflow dynamically selects and populates templates based on:

1. **Project structure** (single part vs multi-part)
2. **Project type** (web, backend, mobile, etc.)
3. **Documentation requirements** (from documentation-requirements.csv)

## Variable Naming Convention

Templates use Handlebars-style variables:

- `{{variable_name}}` - Simple substitution
- `{{#if condition}}...{{/if}}` - Conditional blocks
- `{{#each collection}}...{{/each}}` - Iteration

## Additional Templates

Architecture-specific templates are dynamically loaded from:
`/bmad/bmm/workflows/3-solutioning/templates/`

Based on the matched architecture type from the registry.

## Notes

- Templates support both simple and complex project structures
- Multi-part projects get part-specific file naming (e.g., `architecture-{part_id}.md`)
- Single-part projects use simplified naming (e.g., `architecture.md`)
