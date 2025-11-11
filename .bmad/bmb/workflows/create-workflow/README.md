# Build Workflow

## Overview

The Build Workflow is an interactive workflow builder that guides you through creating new BMAD workflows with proper structure, conventions, and validation. It ensures all workflows follow best practices for optimal human-AI collaboration and are fully compliant with the BMAD Core v6 workflow execution engine.

## Key Features

- **Optional Brainstorming Phase**: Creative exploration of workflow ideas before structured development
- **Comprehensive Guidance**: Step-by-step process with detailed instructions and examples
- **Template-Based**: Uses proven templates for all workflow components
- **Convention Enforcement**: Ensures adherence to BMAD workflow creation guide
- **README Generation**: Automatically creates comprehensive documentation
- **Validation Built-In**: Includes checklist generation for quality assurance
- **Type-Aware**: Adapts to document, action, interactive, autonomous, or meta-workflow types

## Usage

### Basic Invocation

```bash
workflow create-workflow
```

### Through BMad Builder Agent

```
*create-workflow
```

### What You'll Be Asked

1. **Optional**: Whether to brainstorm workflow ideas first (creative exploration phase)
2. Workflow name and target module
3. Workflow purpose and type (enhanced by brainstorming insights if used)
4. Metadata (description, author, outputs)
5. Step-by-step design (goals, variables, flow)
6. Whether to include optional components

## Workflow Structure

### Files Included

```
create-workflow/
├── workflow.yaml                  # Configuration and metadata
├── instructions.md                # Step-by-step execution guide
├── checklist.md                   # Validation criteria
├── workflow-creation-guide.md     # Comprehensive reference guide
├── README.md                      # This file
└── workflow-template/             # Templates for new workflows
    ├── workflow.yaml
    ├── instructions.md
    ├── template.md
    ├── checklist.md
    └── README.md
```

## Understanding Instruction Styles

One of the most important decisions when creating a workflow is choosing the **instruction style** - how the workflow guides the AI's interaction with users.

### Intent-Based vs Prescriptive Instructions

**Intent-Based (Recommended for most workflows)**

Guides the LLM with goals and principles, allowing natural conversation adaptation.

- **More flexible and conversational** - AI adapts questions to context
- **Better for complex discovery** - Requirements gathering, creative exploration
- **Quality over consistency** - Focus on deep understanding
- **Example**: `<action>Guide user to define their target audience with specific demographics and needs</action>`

**Best for:**

- Complex discovery processes (user research, requirements)
- Creative brainstorming and ideation
- Iterative refinement workflows
- When adaptation to context matters
- Workflows requiring nuanced understanding

**Prescriptive**

Provides exact wording for questions and structured options.

- **More controlled and predictable** - Same questions every time
- **Better for simple data collection** - Platform choices, yes/no decisions
- **Consistency over quality** - Standardized execution
- **Example**: `<ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask>`

**Best for:**

- Simple data collection (platform, format, binary choices)
- Compliance verification and standards
- Configuration with finite options
- Quick setup wizards
- When consistency is critical

### Best Practice: Mix Both Styles

The most effective workflows use **both styles strategically**:

```xml
<!-- Intent-based workflow with prescriptive moments -->
<step n="1" goal="Understand user vision">
  <action>Explore the user's vision, uncovering creative intent and target experience</action>
</step>

<step n="2" goal="Capture basic metadata">
  <ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask>
</step>

<step n="3" goal="Deep dive into details">
  <action>Guide user to articulate their core approach and unique aspects</action>
</step>
```

**During workflow creation**, you'll be asked to choose a **primary style preference** - this sets the default approach, but you can (and should) use the other style when it makes more sense for specific steps.

## Workflow Process

### Phase 0: Optional Brainstorming (Step -1)

- **Creative Exploration**: Option to brainstorm workflow ideas before structured development
- **Design Concept Development**: Generate multiple approaches and explore different possibilities
- **Requirement Clarification**: Use brainstorming output to inform workflow purpose, type, and structure
- **Enhanced Creativity**: Leverage AI brainstorming tools for innovative workflow design

The brainstorming phase invokes the CIS brainstorming workflow to:

- Explore workflow ideas and approaches
- Clarify requirements and use cases
- Generate creative solutions for complex automation needs
- Inform the structured workflow building process

### Phase 1: Planning (Steps 0-3)

- Load workflow creation guide and conventions
- Define workflow purpose, name, and type (informed by brainstorming if used)
- Gather metadata and configuration details
- Design step structure and flow

### Phase 2: Generation (Steps 4-8)

- Create workflow.yaml with proper configuration
- Generate instructions.md with XML-structured steps
- Create template.md (for document workflows)
- Generate validation checklist
- Create supporting data files (optional)

### Phase 3: Documentation and Validation (Steps 9-11)

- Create comprehensive README.md (MANDATORY)
- Test and validate workflow structure
- Provide usage instructions and next steps

## Output

### Generated Workflow Folder

Creates a complete workflow folder at:
`{project-root}/.bmad/{{target_module}}/workflows/{{workflow_name}}/`

### Files Created

**Always Created:**

- `workflow.yaml` - Configuration with paths and variables
- `README.md` - Comprehensive documentation (MANDATORY as of v6)
- `instructions.md` - Execution steps (if not template-only workflow)

**Conditionally Created:**

- `template.md` - Document structure (for document workflows)
- `checklist.md` - Validation criteria (optional but recommended)
- Supporting data files (CSV, JSON, etc. as needed)

### Output Structure

For document workflows, the README documents:

- Workflow purpose and use cases
- Usage examples with actual commands
- Input expectations
- Output structure and location
- Best practices

## Requirements

- Access to workflow creation guide
- BMAD Core v6 project structure
- Module to host the new workflow (bmm, bmb, cis, or custom)

## Best Practices

### Before Starting

1. **Consider Brainstorming**: If you're unsure about the workflow approach, use the optional brainstorming phase
2. Review the workflow creation guide to understand conventions
3. Have a clear understanding of the workflow's purpose (or be ready to explore it creatively)
4. Know which type of workflow you're creating (document, action, etc.) or be open to discovery
5. Identify any data files or references needed

### Creative Workflow Design

The create-workflow now supports a **seamless transition from creative ideation to structured implementation**:

- **"I need a workflow for something..."** → Start with brainstorming to explore possibilities
- **Brainstorm** → Generate multiple approaches and clarify requirements
- **Structured workflow** → Build the actual workflow using insights from brainstorming
- **One seamless session** → Complete the entire process from idea to implementation

### During Execution

1. Follow kebab-case naming conventions
2. Be specific with step goals and instructions
3. Use descriptive variable names (snake_case)
4. Set appropriate limits ("3-5 items maximum")
5. Include examples where helpful

### After Completion

1. Test the newly created workflow
2. Validate against the checklist
3. Ensure README is comprehensive and accurate
4. Test all file paths and variable references

## Troubleshooting

### Issue: Generated workflow won't execute

- **Solution**: Verify all file paths in workflow.yaml use proper variable substitution
- **Check**: Ensure installed_path and project-root are correctly set

### Issue: Variables not replacing in template

- **Solution**: Ensure variable names match exactly between instructions `<template-output>` tags and template `{{variables}}`
- **Check**: Use snake_case consistently

### Issue: README has placeholder text

- **Solution**: This workflow now enforces README generation - ensure Step 10 completed fully
- **Check**: No {WORKFLOW_TITLE} or similar placeholders should remain

## Customization

To modify this workflow:

1. Edit `instructions.md` to adjust the creation process
2. Update templates in `workflow-template/` to change generated files
3. Modify `workflow-creation-guide.md` to update conventions
4. Edit `checklist.md` to change validation criteria

## Version History

- **v6.0.0** - README.md now MANDATORY for all workflows
  - Added comprehensive README template
  - Enhanced validation for documentation
  - Improved Step 10 with detailed README requirements

- **v6.0.0** - Initial BMAD Core v6 compatible version
  - Template-based workflow generation
  - Convention enforcement
  - Validation checklist support

## Support

For issues or questions:

- Review `/.bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Check existing workflows in `/.bmad/bmm/workflows/` for examples
- Validate against `/.bmad/bmb/workflows/create-workflow/checklist.md`
- Consult BMAD Method v6 documentation

---

_Part of the BMad Method v6 - BMB (BMad Builder) Module_
