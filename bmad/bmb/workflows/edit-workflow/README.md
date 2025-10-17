# Edit Workflow

## Purpose

An intelligent workflow editor that helps you modify existing BMAD workflows while adhering to all best practices and conventions documented in the workflow creation guide.

## Use Case

When you need to:

- Fix issues in existing workflows
- Update workflow configuration or metadata
- Improve instruction clarity and specificity
- Add new features or capabilities
- Ensure compliance with BMAD workflow conventions

## How to Invoke

```
workflow edit-workflow
```

Or through a BMAD agent:

```
*edit-workflow
```

## Expected Inputs

- **Target workflow path**: Path to the workflow.yaml file or workflow folder you want to edit
- **Edit type selection**: Choice of what aspect to modify
- **User approval**: For each proposed change

## Generated Outputs

- Modified workflow files (in place)
- Optional change log at: `{output_folder}/workflow-edit-log-{date}.md`

## Features

1. **Comprehensive Analysis**: Checks workflows against the official creation guide
2. **Prioritized Issues**: Identifies and ranks issues by importance
3. **Guided Editing**: Step-by-step process with explanations
4. **Best Practices**: Ensures all edits follow BMAD conventions
5. **Validation**: Checks all changes for correctness
6. **Change Tracking**: Documents what was modified and why

## Workflow Steps

1. Load and analyze target workflow
2. Check against best practices
3. Select editing focus
4. Load relevant documentation
5. Perform edits with user approval
6. Validate all changes (optional)
7. Generate change summary

## Requirements

- Access to workflow creation guide
- Read/write permissions for target workflow
- Understanding of BMAD workflow types
