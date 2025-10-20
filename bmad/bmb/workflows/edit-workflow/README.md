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
5. **Instruction Style Optimization**: Convert between intent-based and prescriptive styles
6. **Validation**: Checks all changes for correctness
7. **Change Tracking**: Documents what was modified and why

## Understanding Instruction Styles

When editing workflows, one powerful option is **adjusting the instruction style** to better match the workflow's purpose.

### Intent-Based vs Prescriptive Instructions

**Intent-Based (Recommended for most workflows)**

Guides the AI with goals and principles, allowing flexible conversation.

- **More flexible and conversational** - AI adapts to user responses
- **Better for complex discovery** - Requirements gathering, creative exploration
- **Quality over consistency** - Deep understanding matters more
- **Example**: `<action>Guide user to define their target audience with specific demographics and needs</action>`

**When to use:**

- Complex discovery processes (user research, requirements)
- Creative brainstorming and ideation
- Iterative refinement workflows
- Workflows requiring nuanced understanding

**Prescriptive**

Provides exact questions with structured options.

- **More controlled and predictable** - Consistent questions every time
- **Better for simple data collection** - Platform, format, yes/no choices
- **Consistency over quality** - Same execution every run
- **Example**: `<ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask>`

**When to use:**

- Simple data collection (platform, format, binary choices)
- Compliance verification and standards adherence
- Configuration with finite options
- Quick setup wizards

### Edit Workflow's Style Adjustment Feature

The **"Adjust instruction style"** editing option (menu option 11) helps you:

1. **Analyze current style** - Identifies whether workflow is primarily intent-based or prescriptive
2. **Convert between styles** - Transform prescriptive steps to intent-based (or vice versa)
3. **Optimize the mix** - Intelligently recommend the best style for each step
4. **Step-by-step control** - Review and decide on each step individually

**Common scenarios:**

- **Make workflow more conversational**: Convert rigid <ask> tags to flexible <action> tags for complex steps
- **Make workflow more consistent**: Convert open-ended <action> tags to structured <ask> tags for simple data collection
- **Balance both approaches**: Use intent-based for discovery, prescriptive for simple choices

This feature is especially valuable when converting legacy workflows or adapting workflows for different use cases.

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
