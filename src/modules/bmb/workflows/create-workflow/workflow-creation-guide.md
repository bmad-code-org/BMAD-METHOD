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
installed_path: '{project-root}/{bmad_folder}/module/workflows/my-workflow'
template: '{installed_path}/template.md'
instructions: '{installed_path}/instructions.md'
default_output_file: '{output_folder}/output.md'

standalone: true
```

```markdown
# template.md

# {{project_name}} Output

{{main_content}}
```

```markdown
# instructions.md

<critical>The workflow execution engine is governed by: {project_root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow.yaml</critical>

<workflow>
  <step n="1" goal="Generate content">
  Create the main content for this document.
  <template-output>main_content</template-output>
  </step>
</workflow>
```

That's it! To execute, tell the BMAD agent: `workflow path/to/my-workflow/`

## Core Concepts

### Tasks vs Workflows

| Aspect         | Task               | Workflow                      |
| -------------- | ------------------ | ----------------------------- |
| **Purpose**    | Single operation   | Multi-step process            |
| **Format**     | XML                | Folder with YAML config       |
| **Location**   | `/src/core/tasks/` | `/{bmad_folder}/*/workflows/` |
| **User Input** | Minimal            | Extensive                     |
| **Output**     | Variable           | Usually documents             |

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
  └── [data files]       # Supporting resources, xml, md, csv or others
```

### workflow.yaml Configuration

```yaml
# Basic metadata
name: 'workflow-name'
description: 'Clear purpose statement'

# Paths
installed_path: '{project-root}/{bmad_folder}/module/workflows/name'
template: '{installed_path}/template.md' # or false
instructions: '{installed_path}/instructions.md' # or false
validation: '{installed_path}/checklist.md' # optional

# Output
default_output_file: '{output_folder}/document.md'

# Advanced options
recommended_inputs: # Expected input docs
  - input_doc: 'path/to/doc.md'

# Invocation control
standalone: true # Can be invoked directly (default: true)
```

### Standalone Property: Invocation Control

**CRITICAL**: The `standalone` property controls whether a workflow, task, or tool can be invoked independently or must be called through an agent's menu.

#### For Workflows (workflow.yaml)

```yaml
standalone: true  # Can invoke directly: /workflow-name or via IDE command
standalone: false # Must be called from an agent menu or another workflow
```

**When to use `standalone: true` (DEFAULT)**:

- ✅ User-facing workflows that should be directly accessible
- ✅ Workflows invoked via IDE commands or CLI
- ✅ Workflows that users will run independently
- ✅ Most document generation workflows (PRD, architecture, etc.)
- ✅ Action workflows users trigger directly (refactor, analyze, etc.)
- ✅ Entry-point workflows for a module

**When to use `standalone: false`**:

- ✅ Sub-workflows only called by other workflows (via `<invoke-workflow>`)
- ✅ Internal utility workflows not meant for direct user access
- ✅ Workflows that require specific context from parent workflow
- ✅ Helper workflows that don't make sense alone

**Examples**:

```yaml
# Standalone: User invokes directly
name: 'plan-project'
description: 'Create PRD/GDD for any project'
standalone: true # Users run this directly

---
# Non-standalone: Only called by parent workflow
name: 'validate-requirements'
description: 'Internal validation helper for PRD workflow'
standalone: false # Only invoked by plan-project workflow
```

#### For Tasks and Tools (XML files)

Tasks and tools in `src/core/tasks/` and `src/core/tools/` also support the standalone attribute:

```xml
<!-- Standalone task: Can be invoked directly -->
<task name="workflow" standalone="true">
  <!-- Task definition -->
</task>

<!-- Non-standalone: Only called by workflows/agents -->
<tool name="internal-helper" standalone="false">
  <!-- Tool definition -->
</tool>
```

**Task/Tool Standalone Guidelines**:

- `standalone="true"`: Core tasks like workflow.xml, create-doc.xml that users/agents invoke directly
- `standalone="false"`: Internal helpers, utilities only called by other tasks/workflows

#### Default Behavior

**If standalone property is omitted**:

- Workflows: Default to `standalone: true` (accessible directly)
- Tasks/Tools: Default to `standalone: true` (accessible directly)

**Best Practice**: Explicitly set standalone even if using default to make intent clear.

#### Invocation Patterns

**Standalone workflows can be invoked**:

1. Directly by users: `/workflow-name` or IDE command
2. From agent menus: `workflow: "{path}/workflow.yaml"`
3. From other workflows: `<invoke-workflow path="{path}/workflow.yaml">`

**Non-standalone workflows**:

1. ❌ Cannot be invoked directly by users
2. ❌ Cannot be called from IDE commands
3. ✅ Can be invoked by other workflows via `<invoke-workflow>`
4. ✅ Can be called from agent menu items

#### Module Design Implications

**Typical Module Pattern**:

```yaml
# Entry-point workflows: standalone: true
bmm/workflows/plan-project/workflow.yaml → standalone: true
bmm/workflows/architecture/workflow.yaml → standalone: true

# Helper workflows: standalone: false
bmm/workflows/internal/validate-epic/workflow.yaml → standalone: false
bmm/workflows/internal/format-story/workflow.yaml → standalone: false
```

**Benefits of this pattern**:

- Clear separation between user-facing and internal workflows
- Prevents users from accidentally invoking incomplete/internal workflows
- Cleaner IDE command palette (only shows standalone workflows)
- Better encapsulation and maintainability

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

### Instruction Styles: Intent-Based vs Prescriptive

**CRITICAL DESIGN DECISION**: Choose your instruction style early - it fundamentally shapes the user experience.

#### Default Recommendation: Intent-Based (Adaptive)

**Intent-based workflows give the AI goals and principles, letting it adapt the conversation naturally to the user's context.** This is the BMAD v6 default for most workflows.

#### The Two Approaches

##### 1. Intent-Based Instructions (RECOMMENDED)

**What it is**: Guide the AI with goals, principles, and context - let it determine the best way to interact with each user.

**Characteristics**:

- Uses `<action>` tags with guiding instructions
- Focuses on WHAT to accomplish and WHY it matters
- Lets AI adapt conversation to user needs
- More flexible and conversational
- Better for complex discovery and iterative refinement

**When to use**:

- Complex discovery processes (requirements gathering, architecture design)
- Creative brainstorming and ideation
- Iterative refinement workflows
- When user input quality matters more than consistency
- Workflows requiring adaptation to context
- Teaching/educational workflows
- When users have varying skill levels

**Example**:

```xml
<step n="2" goal="Understand user's target audience">
  <action>Engage in collaborative discovery to understand their target users:

  Ask open-ended questions to explore:
  - Who will use this product?
  - What problems do they face?
  - What are their goals and motivations?
  - How tech-savvy are they?

  Listen for clues about:
  - Demographics and characteristics
  - Pain points and needs
  - Current solutions they use
  - Unmet needs or frustrations

  Adapt your depth and terminology to the user's responses.
  If they give brief answers, dig deeper with follow-ups.
  If they're uncertain, help them think through it with examples.
  </action>

  <template-output>target_audience</template-output>
</step>
```

**Intent-based workflow adapts**:

- **Expert user** might get: "Tell me about your target users - demographics, pain points, and technical profile?"
- **Beginner user** might get: "Let's talk about who will use this. Imagine your ideal customer - what do they look like? What problem are they trying to solve?"

##### 2. Prescriptive Instructions (Use Selectively)

**What it is**: Provide exact wording for questions and specific options for answers.

**Characteristics**:

- Uses `<ask>` tags with exact question text
- Provides specific options or formats
- More controlled and predictable
- Ensures consistency across runs
- Better for simple data collection or compliance needs

**When to use**:

- Simple data collection (platform choice, format selection)
- Compliance verification and standards adherence
- Configuration with finite, well-defined options
- When consistency is critical across all executions
- Quick setup wizards
- Binary decisions (yes/no, enable/disable)
- When gathering specific required fields

**Example**:

```xml
<step n="3" goal="Select target platform">
  <ask>What is your target platform?

  1. Web (browser-based application)
  2. Mobile (iOS/Android native apps)
  3. Desktop (Windows/Mac/Linux applications)
  4. CLI (command-line tool)
  5. API (backend service)

  Enter the number (1-5):</ask>

  <action>Store the platform choice as {{target_platform}}</action>
  <template-output>target_platform</template-output>
</step>
```

**Prescriptive workflow stays consistent** - every user gets the same 5 options in the same format.

#### Best Practice: Mix Both Styles

**Even predominantly intent-based workflows should use prescriptive moments** for simple choices. Even prescriptive workflows can have intent-based discovery.

**Example of effective mixing**:

```xml
<!-- Intent-based: Complex discovery -->
<step n="1" goal="Understand user vision">
  <action>Explore the user's vision through open conversation:

  Help them articulate:
  - The core problem they're solving
  - Their unique approach or innovation
  - The experience they want to create

  Adapt your questions based on their expertise and communication style.
  If they're visionary, explore the "why". If they're technical, explore the "how".
  </action>
  <template-output>vision</template-output>
</step>

<!-- Prescriptive: Simple data -->
<step n="2" goal="Capture basic metadata">
  <ask>What is your target platform? Choose one:
  - Web
  - Mobile
  - Desktop
  - CLI
  - API</ask>

  <action>Store as {{platform}}</action>
</step>

<!-- Intent-based: Deep exploration -->
<step n="3" goal="Design user experience">
  <action>Facilitate collaborative UX design:

  Guide them to explore:
  - User journey and key flows
  - Interaction patterns and affordances
  - Visual/aesthetic direction

  Use their platform choice from step 2 to inform relevant patterns.
  For web: discuss responsive design. For mobile: touch interactions. Etc.
  </action>
  <template-output>ux_design</template-output>
</step>
```

#### Interactivity Levels

Beyond style (intent vs prescriptive), consider **how interactive** your workflow should be:

##### High Interactivity (Collaborative)

- Constant back-and-forth with user
- Multiple asks per step
- Iterative refinement and review
- User guides the direction
- **Best for**: Creative work, complex decisions, learning

**Example**:

```xml
<step n="4" goal="Design feature set" repeat="until-satisfied">
  <action>Collaborate on feature definitions:

  For each feature the user proposes:
  - Help them articulate it clearly
  - Explore edge cases together
  - Consider implications and dependencies
  - Refine the description iteratively

  After each feature: "Want to refine this, add another, or move on?"
  </action>
</step>
```

##### Medium Interactivity (Guided)

- Key decision points have interaction
- AI proposes, user confirms or refines
- Validation checkpoints
- **Best for**: Most document workflows, structured processes

**Example**:

```xml
<step n="5" goal="Generate architecture decisions">
  <action>Based on the PRD, identify 10-15 key architectural decisions needed</action>
  <action>For each decision, research options and present recommendation</action>
  <ask>Approve this decision or propose alternative?</ask>
  <action>Record decision and rationale</action>
</step>
```

##### Low Interactivity (Autonomous)

- Minimal user input required
- AI works independently with guidelines
- User reviews final output
- **Best for**: Automated generation, batch processing

**Example**:

```xml
<step n="6" goal="Generate user stories">
  <action>For each epic in the PRD, generate 3-7 user stories following this pattern:
  - As a [user type]
  - I want to [action]
  - So that [benefit]

  Ensure stories are:
  - Independently valuable
  - Testable
  - Sized appropriately (1-5 days of work)
  </action>

  <template-output>user_stories</template-output>
</step>

<step n="7" goal="Review generated stories">
  <ask>Review the generated user stories. Want to refine any? (y/n)</ask>
  <check if="yes">
    <goto step="6">Regenerate with feedback</goto>
  </check>
</step>
```

#### Decision Framework

**Choose Intent-Based when**:

- ✅ User knowledge/skill level varies
- ✅ Context matters (one-size-fits-all won't work)
- ✅ Discovery and exploration are important
- ✅ Quality of input matters more than consistency
- ✅ Teaching/education is part of the goal
- ✅ Iteration and refinement expected

**Choose Prescriptive when**:

- ✅ Options are finite and well-defined
- ✅ Consistency across users is critical
- ✅ Compliance or standards matter
- ✅ Simple data collection
- ✅ Users just need to make a choice and move on
- ✅ Speed matters more than depth

**Choose High Interactivity when**:

- ✅ User expertise is essential
- ✅ Creative collaboration needed
- ✅ Decisions have major implications
- ✅ Learning and understanding matter
- ✅ Iteration is expected

**Choose Low Interactivity when**:

- ✅ Process is well-defined and repeatable
- ✅ AI can work autonomously with clear guidelines
- ✅ User time is constrained
- ✅ Batch processing or automation desired
- ✅ Review-and-refine model works

#### Implementation Guidelines

**For Intent-Based Workflows**:

1. **Use `<action>` tags with guiding instructions**

```xml
<action>Facilitate discovery of {{topic}}:

Ask open-ended questions to explore:
- {{aspect_1}}
- {{aspect_2}}

Listen for clues about {{patterns_to_notice}}.

Adapt your approach based on their {{context_factor}}.
</action>
```

2. **Provide principles, not scripts**

```xml
<!-- ✅ Good: Principles -->
<action>Help user articulate their unique value proposition.
Focus on what makes them different, not just what they do.
If they struggle, offer examples from analogous domains.</action>

<!-- ❌ Avoid: Prescriptive script -->
<ask>What makes your product unique? Provide 2-3 bullet points.</ask>
```

3. **Guide with context and rationale**

```xml
<action>Now that we understand their {{context_from_previous}},
explore how {{current_topic}} connects to their vision.

This matters because {{reason_it_matters}}.

If they seem uncertain about {{potential_challenge}}, help them think through {{approach}}.
</action>
```

**For Prescriptive Workflows**:

1. **Use `<ask>` tags with specific questions**

```xml
<ask>Select your preferred database:
1. PostgreSQL
2. MySQL
3. MongoDB
4. SQLite

Enter number (1-4):</ask>
```

2. **Provide clear options and formats**

```xml
<ask>Enable user authentication? (yes/no)</ask>
<ask>Enter project name (lowercase, no spaces):</ask>
```

3. **Keep it crisp and clear**

```xml
<!-- ✅ Good: Clear and direct -->
<ask>Target platform? (web/mobile/desktop)</ask>

<!-- ❌ Avoid: Over-explaining -->
<ask>We need to know what platform you're building for. This will affect
the technology stack recommendations. Please choose: web, mobile, or desktop.</ask>
```

#### Mixing Styles Within a Workflow

**Pattern: Intent-based discovery → Prescriptive capture → Intent-based refinement**

```xml
<step n="1" goal="Explore user needs">
  <!-- Intent-based discovery -->
  <action>Engage in open conversation to understand user needs deeply...</action>
</step>

<step n="2" goal="Capture key metrics">
  <!-- Prescriptive data collection -->
  <ask>Expected daily active users? (number)</ask>
  <ask>Data sensitivity level? (public/internal/sensitive/highly-sensitive)</ask>
</step>

<step n="3" goal="Design solution approach">
  <!-- Intent-based design -->
  <action>Collaborate on solution design, using the metrics from step 2 to inform scale and security decisions...</action>
</step>
```

**Pattern: Prescriptive setup → Intent-based execution**

```xml
<step n="1" goal="Quick setup">
  <!-- Prescriptive configuration -->
  <ask>Project type? (web-app/api/cli/library)</ask>
  <ask>Language? (typescript/python/go/rust)</ask>
</step>

<step n="2" goal="Detailed design">
  <!-- Intent-based design -->
  <action>Now that we know it's a {{project_type}} in {{language}},
  let's explore the architecture in detail.

  Guide them through design decisions appropriate for a {{project_type}}...
  </action>
</step>
```

### Basic Structure

```markdown
# instructions.md

<critical>The workflow execution engine is governed by: {project_root}/{bmad_folder}/core/tasks/workflow.xml</critical>
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
2. **Limit scope** - 5-12 steps maximum
3. **Build progressively** - Start simple, add detail
4. **Checkpoint often** - Save after major workflow sections and ensure documents are being drafted from the start
5. **Make sections optional** - Let users skip when appropriate

### Instruction Guidelines

1. **Be specific** - "Write 1-2 paragraphs" not "Write about"
2. **Provide examples** - Show expected output format
3. **Set limits** - "3-5 items maximum"
4. **Explain why** - Context helps AI make better decisions

### Time Estimate Prohibition

**CRITICAL:** For all planning, analysis, and estimation workflows, include this prohibition:

```xml
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>
```

**When to include this:**

- Planning workflows (PRDs, tech specs, architecture)
- Analysis workflows (research, brainstorming, product briefs)
- Retrospective workflows (reviews, post-mortems)
- Any workflow discussing project scope or complexity

**When NOT needed:**

- Pure implementation workflows (code generation, refactoring)
- Simple action workflows (file operations, status updates)
- Workflows that only process existing data

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

## Document Sharding Support

If your workflow loads large planning documents (PRDs, epics, architecture, etc.), implement sharding support for efficiency.

### What is Document Sharding?

Document sharding splits large markdown files into smaller section-based files:

- `PRD.md` (50k tokens) → `prd/epic-1.md`, `prd/epic-2.md`, etc.
- Enables selective loading (90%+ token savings)
- All BMM workflows support both whole and sharded documents

### When to Add Sharding Support

**Add sharding support if your workflow:**

- Loads planning documents (PRD, epics, architecture, UX specs)
- May be used in large multi-epic projects
- Processes documents that could exceed 20k tokens
- Would benefit from selective section loading

**Skip sharding support if your workflow:**

- Only generates small documents
- Doesn't load external documents
- Works with code files (not planning docs)

### Implementation Pattern

#### 1. Add input_file_patterns to workflow.yaml

```yaml
# Smart input file references - handles both whole docs and sharded docs
# Priority: Whole document first, then sharded version
input_file_patterns:
  prd:
    whole: '{output_folder}/*prd*.md'
    sharded: '{output_folder}/*prd*/index.md'

  epics:
    whole: '{output_folder}/*epic*.md'
    sharded_index: '{output_folder}/*epic*/index.md'
    sharded_single: '{output_folder}/*epic*/epic-{{epic_num}}.md' # For selective load

  architecture:
    whole: '{output_folder}/*architecture*.md'
    sharded: '{output_folder}/*architecture*/index.md'

  document_project:
    sharded: '{output_folder}/index.md' # Brownfield always uses index
```

#### 2. Add Discovery Instructions to instructions.md

Place early in instructions (after critical declarations, before workflow steps):

```markdown
## 📚 Document Discovery

This workflow requires: [list required documents]

**Discovery Process** (execute for each document):

1. **Search for whole document first** - Use fuzzy file matching
2. **Check for sharded version** - If whole document not found, look for `{doc-name}/index.md`
3. **If sharded version found**:
   - Read `index.md` to understand the document structure
   - Read ALL section files listed in the index (or specific sections for selective load)
   - Treat the combined content as if it were a single document
4. **Brownfield projects**: The `document-project` workflow creates `{output_folder}/index.md`

**Priority**: If both whole and sharded versions exist, use the whole document.

**Fuzzy matching**: Be flexible with document names - users may use variations.
```

#### 3. Choose Loading Strategy

**Full Load Strategy** (most workflows):

```xml
<action>Search for document using fuzzy pattern: {output_folder}/*prd*.md</action>
<action>If not found, check for sharded version: {output_folder}/*prd*/index.md</action>
<action if="sharded found">Read index.md to understand structure</action>
<action if="sharded found">Read ALL section files listed in index</action>
<action if="sharded found">Combine content as single document</action>
```

**Selective Load Strategy** (advanced - for phase 4 type workflows):

```xml
<action>Determine section needed (e.g., epic_num from story key)</action>
<action>Check for sharded version: {output_folder}/*epics*/index.md</action>
<action if="sharded found">Read ONLY the specific section file: epics/epic-{{epic_num}}.md</action>
<action if="sharded found">Skip all other section files (efficiency optimization)</action>
<action if="whole document found">Load complete document and extract relevant section</action>
```

### Pattern Examples

**Example 1: Simple Full Load**

```yaml
# workflow.yaml
input_file_patterns:
  requirements:
    whole: '{output_folder}/*requirements*.md'
    sharded: '{output_folder}/*requirements*/index.md'
```

```markdown
<!-- instructions.md -->

## Document Discovery

Load requirements document (whole or sharded).

1. Try whole: _requirements_.md
2. If not found, try sharded: _requirements_/index.md
3. If sharded: Read index + ALL section files
```

**Example 2: Selective Load with Epic Number**

```yaml
# workflow.yaml
input_file_patterns:
  epics:
    whole: '{output_folder}/*epic*.md'
    sharded_single: '{output_folder}/*epic*/epic-{{epic_num}}.md'
```

```xml
<!-- instructions.md step -->
<step n="2" goal="Load Epic Content">
  <action>Extract epic number from story key (e.g., "3-2-feature" → epic_num = 3)</action>
  <action>Check for sharded epics: {output_folder}/*epic*/index.md</action>
  <action if="sharded found">Load ONLY epics/epic-{{epic_num}}.md (selective optimization)</action>
  <action if="whole document found">Load full epics.md and extract Epic {{epic_num}}</action>
</step>
```

### Testing Your Sharding Support

1. **Test with whole document**: Verify workflow works with single `document.md`
2. **Test with sharded document**: Create sharded version and verify discovery
3. **Test with both present**: Ensure whole document takes priority
4. **Test selective loading**: Verify only needed sections are loaded (if applicable)

### Complete Reference

**[→ Document Sharding Guide](../../../../docs/document-sharding-guide.md)** - Comprehensive guide with examples

**BMM Examples**:

- Full Load: `src/modules/bmm/workflows/2-plan-workflows/prd/`
- Selective Load: `src/modules/bmm/workflows/4-implementation/epic-tech-context/`

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
4. **Relative Paths**: Use `{bmad_folder}/` root paths (no `{project-root}`)

### Creating a Web Bundle

Add this section to your workflow.yaml ensuring critically all dependant files or workflows are listed:

```yaml
web_bundle:
  name: 'workflow-name'
  description: 'Workflow description'
  author: 'Your Name'

  # Core files ({bmad_folder}/-relative paths)
  instructions: '{bmad_folder}/module/workflows/workflow/instructions.md'
  validation: '{bmad_folder}/module/workflows/workflow/checklist.md'
  template: '{bmad_folder}/module/workflows/workflow/template.md'

  # Data files (no config_source allowed)
  data_file: '{bmad_folder}/module/workflows/workflow/data.csv'

  # Complete file list - CRITICAL!
  web_bundle_files:
    - '{bmad_folder}/module/workflows/workflow/instructions.md'
    - '{bmad_folder}/module/workflows/workflow/checklist.md'
    - '{bmad_folder}/module/workflows/workflow/template.md'
    - '{bmad_folder}/module/workflows/workflow/data.csv'
    # Include ALL referenced files
```

### Converting Existing Workflows

1. **Remove Config Dependencies**:
   - Replace `{config_source}:variable` with hardcoded values
   - Convert `{project-root}/{bmad_folder}/` to `{bmad_folder}/`

2. **Inventory All Files**:
   - Scan instructions.md for file references
   - Check template.md for includes
   - List all data files

3. **Test Completeness**:
   - Ensure no missing file references
   - Verify all paths are relative to {bmad_folder}/

### Example: Complete Web Bundle

```yaml
web_bundle:
  name: 'analyze-requirements'
  description: 'Requirements analysis workflow'
  author: 'BMad Team'

  instructions: '{bmad_folder}/bmm/workflows/analyze-requirements/instructions.md'
  validation: '{bmad_folder}/bmm/workflows/analyze-requirements/checklist.md'
  template: '{bmad_folder}/bmm/workflows/analyze-requirements/template.md'

  # Data files
  techniques_data: '{bmad_folder}/bmm/workflows/analyze-requirements/techniques.csv'
  patterns_data: '{bmad_folder}/bmm/workflows/analyze-requirements/patterns.json'

  # Sub-workflow reference
  validation_workflow: '{bmad_folder}/bmm/workflows/validate-requirements/workflow.yaml'

  standalone: true

  web_bundle_files:
    # Core workflow files
    - '{bmad_folder}/bmm/workflows/analyze-requirements/instructions.md'
    - '{bmad_folder}/bmm/workflows/analyze-requirements/checklist.md'
    - '{bmad_folder}/bmm/workflows/analyze-requirements/template.md'

    # Data files
    - '{bmad_folder}/bmm/workflows/analyze-requirements/techniques.csv'
    - '{bmad_folder}/bmm/workflows/analyze-requirements/patterns.json'

    # Sub-workflow and its files
    - '{bmad_folder}/bmm/workflows/validate-requirements/workflow.yaml'
    - '{bmad_folder}/bmm/workflows/validate-requirements/instructions.md'
    - '{bmad_folder}/bmm/workflows/validate-requirements/checklist.md'

    # Shared templates referenced in instructions
    - '{bmad_folder}/bmm/templates/requirement-item.md'
    - '{bmad_folder}/bmm/templates/validation-criteria.md'
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
- Create multiple focused workflows with a parent orchestration
- Reduce elicitation points

---

_For implementation details, see:_

- `/src/core/tasks/workflow.xml` - Execution engine
- `/{bmad_folder}/bmm/workflows/` - Production examples
