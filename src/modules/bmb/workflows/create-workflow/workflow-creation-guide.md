# BMAD Workflow Creation Guide

Create structured, repeatable workflows for human-AI collaboration in BMAD v6.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [Workflow Structure](#workflow-structure)
4. [Writing Instructions](#writing-instructions)
5. [Templates and Variables](#templates--variables)
6. [Flow Control](#flow-control)
7. [Validation](#validation)
8. [Examples](#examples)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Quick Start

### Minimal Workflow (3 minutes)

Create a folder with these files:

```yaml
# workflow.yaml (REQUIRED)
name: 'my-workflow'
description: 'What this workflow does'
installed_path: '{project-root}/bmad/module/workflows/my-workflow'
template: '{installed_path}/template.md'
instructions: '{installed_path}/instructions.md'
default_output_file: '{output_folder}/output.md'
```

```markdown
# template.md

# {{project_name}} Output

{{main_content}}
```

```markdown
# instructions.md

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow.yaml</critical>

<workflow>
<step n="1" goal="Generate content">
Create the main content for this document.
<template-output>main_content</template-output>
</step>
</workflow>
```

That's it! To execute, tell the BMAD agent: `workflow my-workflow`

## Core Concepts

### Tasks vs Workflows

| Aspect         | Task               | Workflow                |
| -------------- | ------------------ | ----------------------- |
| **Purpose**    | Single operation   | Multi-step process      |
| **Format**     | XML in `.md` file  | Folder with YAML config |
| **Location**   | `/src/core/tasks/` | `/bmad/*/workflows/`    |
| **User Input** | Minimal            | Extensive               |
| **Output**     | Variable           | Usually documents       |

### Workflow Types

1. **Document Workflows** - Generate PRDs, specs, architectures
2. **Action Workflows** - Refactor code, run tools, orchestrate tasks
3. **Interactive Workflows** - Brainstorming, meditations, guided sessions
4. **Autonomous Workflows** - Run without human input (story generation)
5. **Meta-Workflows** - Coordinate other workflows

## Workflow Structure

### Required Files

```
my-workflow/
  └── workflow.yaml      # REQUIRED - Configuration
```

### Optional Files

```
my-workflow/
  ├── template.md        # Document structure
  ├── instructions.md    # Step-by-step guide
  ├── checklist.md       # Validation criteria
  └── [data files]       # Supporting resources
```

### workflow.yaml Configuration

```yaml
# Basic metadata
name: 'workflow-name'
description: 'Clear purpose statement'

# Paths
installed_path: '{project-root}/bmad/module/workflows/name'
template: '{installed_path}/template.md' # or false
instructions: '{installed_path}/instructions.md' # or false
validation: '{installed_path}/checklist.md' # optional

# Output
default_output_file: '{output_folder}/document.md'

# Advanced options
autonomous: true # Skip user checkpoints
recommended_inputs: # Expected input docs
  - input_doc: 'path/to/doc.md'
```

### Common Patterns

**Full Document Workflow** (most common)

- Has: All 4 files
- Use for: PRDs, architectures, specs

**Action Workflow** (no template)

- Has: workflow.yaml + instructions.md
- Use for: Refactoring, tool orchestration

**Autonomous Workflow** (no interaction)

- Has: workflow.yaml + template + instructions
- Use for: Automated generation

## Writing Instructions

### Basic Structure

```markdown
# instructions.md

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow.yaml</critical>

<workflow>

<step n="1" goal="Clear goal statement">
Instructions for this step.
<template-output>variable_name</template-output>
</step>

<step n="2" goal="Next goal" optional="true">
Optional step instructions.
<template-output>another_variable</template-output>
</step>

</workflow>
```

### Step Attributes

- `n="X"` - Step number (required)
- `goal="..."` - What the step accomplishes (required)
- `optional="true"` - User can skip
- `repeat="3"` - Repeat N times
- `if="condition"` - Conditional execution

### Content Formats

**Markdown Format** (human-friendly):

```xml
<step n="1" goal="Define goals">
Write 1-3 bullet points about project success:
- User outcomes
- Business value
- Measurable results

<template-output>goals</template-output>
</step>
```

**XML Format** (precise control):

```xml
<step n="2" goal="Validate input">
  <action>Load validation criteria</action>
  <check if="validation fails">
    <goto step="1">Return to previous step</goto>
  </check>
  <template-output>validated_data</template-output>
</step>
```

## Templates and Variables

### Variable Syntax

```markdown
# template.md

# {{project_name}} Document

## Section

{{section_content}}

_Generated on {{date}}_
```

### Variable Sources

1. **workflow.yaml** - Config values
2. **User input** - Runtime values
3. **Step outputs** - `<template-output>` tags
4. **System** - Date, paths, etc.

### Naming Convention

- Use snake_case: `{{user_requirements}}`
- Be descriptive: `{{primary_user_journey}}` not `{{puj}}`

## Flow Control

### Sub-Steps

```xml
<step n="3" goal="Process items">
  <step n="3a" title="Gather data">
    <action>Collect information</action>
  </step>

  <step n="3b" title="Analyze">
    <action>Process collected data</action>
    <template-output>analysis</template-output>
  </step>
</step>
```

### Repetition

```xml
<!-- Fixed repetitions -->
<step n="4" repeat="3">
  <action>Generate example {{iteration}}</action>
</step>

<!-- Conditional repetition -->
<step n="5" repeat="until-approved">
  <action>Generate content</action>
  <ask>Satisfactory? (y/n)</ask>
</step>

<!-- For-each repetition -->
<step n="6" repeat="for-each-epic">
  <action>Define epic {{epic_name}}</action>
</step>
```

### Conditional Execution

**Single Action (use `action if=""`):**

```xml
<step n="6" goal="Load context">
  <action if="file exists">Load existing document</action>
  <action if="new project">Initialize from template</action>
</step>
```

**Multiple Actions (use `<check if="">...</check>`):**

```xml
<step n="7" goal="Validate">
  <action>Check requirements</action>
  <check if="incomplete">
    <action>Log validation errors</action>
    <goto step="2">Return to gathering</goto>
  </check>
  <check if="complete">
    <action>Mark as validated</action>
    <continue>Proceed</continue>
  </check>
</step>
```

**When to use which:**

- **`<action if="">`** - Single conditional action (cleaner, more concise)
- **`<check if="">...</check>`** - Multiple items under same condition (explicit scope)

**❌ CRITICAL ANTIPATTERN - DO NOT USE:**

**Invalid self-closing check tags:**

```xml
<!-- ❌ WRONG - Invalid XML structure -->
<check>If condition met:</check>
<action>Do something</action>

<!-- ❌ WRONG - Ambiguous nesting -->
<check>If validation fails:</check>
<action>Log error</action>
<goto step="1">Retry</goto>
```

**Why this is wrong:**

- Creates invalid XML structure (check tag doesn't wrap anything)
- Ambiguous - unclear if actions are inside or outside the condition
- Breaks formatter and parser logic
- Not part of BMAD workflow spec

**✅ CORRECT alternatives:**

```xml
<!-- ✅ Single action - use inline if -->
<action if="condition met">Do something</action>

<!-- ✅ Multiple actions - use proper wrapper block -->
<check if="validation fails">
  <action>Log error</action>
  <goto step="1">Retry</goto>
</check>
```

**Rule:** If you have only ONE conditional action, use `<action if="">`. If you have MULTIPLE conditional actions, use `<check if="">...</check>` wrapper with a closing tag.

### Loops

```xml
<step n="8" goal="Refine">
  <loop max="5">
    <action>Generate solution</action>
    <check if="criteria met">
      <break>Exit loop</break>
    </check>
  </loop>
</step>
```

### Common XML Tags

**Execution:**

- `<action>` - Required action
- `<action if="condition">` - Single conditional action (inline)
- `<check if="condition">...</check>` - Conditional block for multiple items (requires closing tag)
- `<ask>` - User prompt
- `<goto>` - Jump to step
- `<invoke-workflow>` - Call another workflow

**Output:**

- `<template-output>` - Save checkpoint
- `<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>` - Trigger AI enhancement
- `<critical>` - Important info
- `<example>` - Show example

## Validation

### checklist.md Structure

```markdown
# Validation Checklist

## Structure

- [ ] All sections present
- [ ] No placeholders remain
- [ ] Proper formatting

## Content Quality

- [ ] Clear and specific
- [ ] Technically accurate
- [ ] Consistent terminology

## Completeness

- [ ] Ready for next phase
- [ ] Dependencies documented
- [ ] Action items defined
```

### Making Criteria Measurable

❌ `- [ ] Good documentation`
✅ `- [ ] Each function has JSDoc comments with parameters and return types`

## Examples

### Document Generation

```xml
<workflow>
<step n="1" goal="Gather context">
Load existing documents and understand project scope.
<template-output>context</template-output>
</step>

<step n="2" goal="Define requirements">
Create functional and non-functional requirements.
<template-output>requirements</template-output>
<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</step>

<step n="3" goal="Validate">
Check requirements against goals.
<template-output>validated_requirements</template-output>
</step>
</workflow>
```

### Action Workflow

```xml
<workflow>
<step n="1" goal="Analyze codebase">
  <action>Find all API endpoints</action>
  <action>Identify patterns</action>
</step>

<step n="2" goal="Refactor">
  <repeat for-each="endpoint">
    <action>Update to new pattern</action>
  </repeat>
</step>

<step n="3" goal="Verify">
  <action>Run tests</action>
  <check if="tests fail">
    <goto step="2">Fix issues</goto>
  </check>
</step>
</workflow>
```

### Meta-Workflow

```xml
<workflow name="greenfield-app">
<step n="1" goal="Discovery">
  <invoke-workflow>product-brief</invoke-workflow>
  <template-output>brief</template-output>
</step>

<step n="2" goal="Requirements">
  <invoke-workflow input="{{brief}}">prd</invoke-workflow>
  <template-output>prd</template-output>
</step>

<step n="3" goal="Architecture">
  <invoke-workflow input="{{prd}}">architecture</invoke-workflow>
  <template-output>architecture</template-output>
</step>
</workflow>
```

## Best Practices

### Design Principles

1. **Keep steps focused** - Single goal per step
2. **Limit scope** - 5-10 steps maximum
3. **Build progressively** - Start simple, add detail
4. **Checkpoint often** - Save after major sections
5. **Make sections optional** - Let users skip when appropriate

### Instruction Guidelines

1. **Be specific** - "Write 1-2 paragraphs" not "Write about"
2. **Provide examples** - Show expected output format
3. **Set limits** - "3-5 items maximum"
4. **Explain why** - Context helps AI make better decisions

### Conditional Execution Best Practices

**✅ DO:**

- Use `<action if="">` for single conditional actions
- Use `<check if="">...</check>` for blocks with multiple items
- Always close `<check>` tags explicitly
- Keep conditions simple and readable

**❌ DON'T:**

- Wrap single actions in `<check>` blocks (unnecessarily verbose)
- Forget to close `<check>` tags
- Nest too many levels (makes logic hard to follow)

**Examples:**

```xml
<!-- ✅ Good: Single action -->
<action if="file exists">Load configuration</action>

<!-- ❌ Avoid: Unnecessary wrapper for single action -->
<check if="file exists">
  <action>Load configuration</action>
</check>

<!-- ✅ Good: Multiple actions in block -->
<check if="validation fails">
  <action>Log error details</action>
  <action>Notify user</action>
  <goto step="1">Retry input</goto>
</check>
```

### Common Pitfalls

- **Missing critical headers** - Always include workflow engine references
- **Variables not replaced** - Ensure names match exactly
- **Too many steps** - Combine related actions
- **No checkpoints** - Add `<template-output>` tags
- **Vague instructions** - Be explicit about expectations
- **Unclosed check tags** - Always close `<check if="">...</check>` blocks
- **Wrong conditional pattern** - Use `<action if="">` for single items, `<check if="">` for blocks

## Web Bundles

Web bundles allow workflows to be deployed as self-contained packages for web environments.

### When to Use Web Bundles

- Deploying workflows to web-based AI platforms
- Creating shareable workflow packages
- Ensuring workflow portability without dependencies
- Publishing workflows for public use

### Web Bundle Requirements

1. **Self-Contained**: No external dependencies
2. **No Config Variables**: Cannot use `{config_source}` references
3. **Complete File List**: Every referenced file must be listed
4. **Relative Paths**: Use `bmad/` root paths (no `{project-root}`)

### Creating a Web Bundle

Add this section to your workflow.yaml:

```yaml
web_bundle:
  name: 'workflow-name'
  description: 'Workflow description'
  author: 'Your Name'

  # Core files (bmad/-relative paths)
  instructions: 'bmad/module/workflows/workflow/instructions.md'
  validation: 'bmad/module/workflows/workflow/checklist.md'
  template: 'bmad/module/workflows/workflow/template.md'

  # Data files (no config_source allowed)
  data_file: 'bmad/module/workflows/workflow/data.csv'

  # Complete file list - CRITICAL!
  web_bundle_files:
    - 'bmad/module/workflows/workflow/instructions.md'
    - 'bmad/module/workflows/workflow/checklist.md'
    - 'bmad/module/workflows/workflow/template.md'
    - 'bmad/module/workflows/workflow/data.csv'
    # Include ALL referenced files
```

### Converting Existing Workflows

1. **Remove Config Dependencies**:
   - Replace `{config_source}:variable` with hardcoded values
   - Convert `{project-root}/bmad/` to `bmad/`

2. **Inventory All Files**:
   - Scan instructions.md for file references
   - Check template.md for includes
   - List all data files

3. **Test Completeness**:
   - Ensure no missing file references
   - Verify all paths are relative to bmad/

### Example: Complete Web Bundle

```yaml
web_bundle:
  name: 'analyze-requirements'
  description: 'Requirements analysis workflow'
  author: 'BMad Team'

  instructions: 'bmad/bmm/workflows/analyze-requirements/instructions.md'
  validation: 'bmad/bmm/workflows/analyze-requirements/checklist.md'
  template: 'bmad/bmm/workflows/analyze-requirements/template.md'

  # Data files
  techniques_data: 'bmad/bmm/workflows/analyze-requirements/techniques.csv'
  patterns_data: 'bmad/bmm/workflows/analyze-requirements/patterns.json'

  # Sub-workflow reference
  validation_workflow: 'bmad/bmm/workflows/validate-requirements/workflow.yaml'

  web_bundle_files:
    # Core workflow files
    - 'bmad/bmm/workflows/analyze-requirements/instructions.md'
    - 'bmad/bmm/workflows/analyze-requirements/checklist.md'
    - 'bmad/bmm/workflows/analyze-requirements/template.md'

    # Data files
    - 'bmad/bmm/workflows/analyze-requirements/techniques.csv'
    - 'bmad/bmm/workflows/analyze-requirements/patterns.json'

    # Sub-workflow and its files
    - 'bmad/bmm/workflows/validate-requirements/workflow.yaml'
    - 'bmad/bmm/workflows/validate-requirements/instructions.md'
    - 'bmad/bmm/workflows/validate-requirements/checklist.md'

    # Shared templates referenced in instructions
    - 'bmad/bmm/templates/requirement-item.md'
    - 'bmad/bmm/templates/validation-criteria.md'
```

## Troubleshooting

### Variables Not Replaced

- Check exact name match
- Verify `<template-output>` tag present
- Ensure step generates the variable

### Validation Fails

- Review checklist specificity
- Check for impossible requirements
- Verify checklist matches template

### Workflow Too Long

- Combine related steps
- Make sections optional
- Reduce elicitation points

### User Confusion

- Add clearer step goals
- Provide more examples
- Explain section purpose

---

_For implementation details, see:_

- `/src/core/tasks/workflow.xml` - Execution engine
- `/bmad/bmm/workflows/` - Production examples
