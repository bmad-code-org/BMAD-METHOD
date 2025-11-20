# Debug Workflows

This directory contains all debug-related workflows for systematic bug analysis, root cause investigation, and defect resolution.

## Available Workflows

### Core Inspection Workflows

- **`inspect/`** - Comprehensive Fagan inspection (6-phase systematic defect analysis)
- **`quick-debug/`** - Rapid triage and initial assessment for simple issues
- **`root-cause/`** - Focused root cause analysis using fishbone methodology
- **`pattern-analysis/`** - Analyze code changes for defect patterns and systemic issues

### Advanced Debugging Workflows

- **`wolf-fence/`** - Binary search debugging to isolate bug location efficiently
- **`delta-minimize/`** - Reduce failing test case to minimal reproduction
- **`assert-analyze/`** - Analyze code for missing assertions and invariants
- **`static-scan/`** - Comprehensive static analysis for common defects

### Production Support Workflows

- **`instrument/`** - Design strategic logging and monitoring points
- **`walkthrough-prep/`** - Generate materials for code walkthrough sessions

### Validation & Documentation

- **`validate-fix/`** - Verify proposed fixes address root cause without side effects
- **`debug-report/`** - Generate comprehensive debug reports from analysis sessions

## Workflow Execution

All workflows are executed through the Debug Agent (Diana) using the `*command` syntax:

```
*inspect - Execute Fagan inspection
*quick-debug - Rapid triage
*root-cause - Root cause analysis
*validate-fix - Fix validation
```

## Workflow Structure

Each workflow directory contains:

- `workflow.yaml` - Workflow configuration and metadata
- `instructions.md` - Step-by-step execution instructions
- `template.yaml` or `template.md` - Output templates (if applicable)

## Integration with Knowledge Base

Workflows automatically load relevant knowledge fragments from `{bmad_folder}/bmm/debug/knowledge/` based on the `debug-index.csv` index.

## Tags and Categories

Workflows are tagged for easy discovery:

- `inspection` - Formal inspection methodologies
- `analysis` - Root cause and pattern analysis
- `automation` - Automated debugging tools
- `production` - Production debugging support
- `validation` - Fix and quality validation
- `documentation` - Report generation

## Best Practices

1. Start with `quick-debug` for initial triage
2. Use `inspect` for comprehensive analysis
3. Execute `root-cause` when symptoms are clear but causes are unclear
4. Run `validate-fix` before implementing any solution
5. Generate `debug-report` to capture lessons learned
