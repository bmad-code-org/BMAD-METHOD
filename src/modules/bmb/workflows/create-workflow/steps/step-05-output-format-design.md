---
name: 'step-05-output-format-design'
description: 'Design the output format for workflows that produce documents or files'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-05-output-format-design.md'
nextStepFile: '{workflow_path}/steps/step-06-design.md'

targetWorkflowPath: '{custom_stand_alone_location}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Output Format Design

## STEP GOAL:

To design and document the output format for workflows that produce documents or files, determining whether they need strict templates or flexible formatting.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and output format specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in document design and template creation
- ✅ User brings their specific output requirements and preferences

### Step-Specific Rules:

- 🎯 Focus ONLY on output format design
- 🚫 FORBIDDEN to design workflow steps in this step
- 💬 Help user understand the format spectrum
- 🚫 DO NOT proceed without clear format requirements

## EXECUTION PROTOCOLS:

- 🎯 Guide user through format spectrum with examples
- 💾 Document format decisions in workflow plan
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Approved plan from step 4 is available
- Focus ONLY on output document formatting
- Skip this step if workflow produces no documents
- This step only runs when documents need structure

## OUTPUT FORMAT DESIGN PROCESS:

### 1. Initialize Output Format Discussion

"**Designing Your Output Format**

Based on your approved plan, your workflow will produce output documents. Let's design how these outputs should be formatted."

### 2. Present the Format Spectrum

"**Output Format Spectrum - Where does your workflow fit?**

**Strictly Structured Examples:**

- Government forms - exact fields, precise positions
- Legal documents - must follow specific templates
- Technical specifications - required sections, specific formats
- Compliance reports - mandatory fields, validation rules

**Structured Examples:**

- Project reports - required sections, flexible content
- Business proposals - consistent format, customizable sections
- Technical documentation - standard structure, adaptable content
- Research papers - IMRAD format, discipline-specific variations

**Semi-structured Examples:**

- Character sheets (D&D) - core stats + flexible background
- Lesson plans - required components, flexible delivery
- Recipes - ingredients/method format, flexible descriptions
- Meeting minutes - agenda/attendees/actions, flexible details

**Free-form Examples:**

- Creative stories - narrative flow, minimal structure
- Blog posts - title/body, organic organization
- Personal journals - date/entry, free expression
- Brainstorming outputs - ideas, flexible organization"

### 3. Determine Format Type

"**Which format type best fits your workflow?**

1. **Strict Template** - Must follow exact format with specific fields
2. **Structured** - Required sections but flexible within each
3. **Semi-structured** - Core sections plus optional additions
4. **Free-form** - Content-driven with minimal structure

Please choose 1-4:"

### 4. Deep Dive Based on Choice

#### IF Strict Template (Choice 1):

"**Strict Template Design**

You need exact formatting. Let's define your requirements:

**Template Source Options:**
A. Upload existing template/image to follow
B. Create new template from scratch
C. Use standard form (e.g., government, industry)
D. AI proposes template based on your needs

**Template Requirements:**

- Exact field names and positions
- Required vs optional fields
- Validation rules
- File format (PDF, DOCX, etc.)
- Any legal/compliance considerations"

#### IF Structured (Choice 2):

"**Structured Document Design**

You need consistent sections with flexibility:

**Section Definition:**

- What sections are required?
- Any optional sections?
- Section ordering rules?
- Cross-document consistency needs?

**Format Guidelines:**

- Any formatting standards (APA, MLA, corporate)?
- Section header styles?
- Content organization principles?"

#### IF Semi-structured (Choice 3):

"**Semi-structured Design**

Core sections with flexibility:

**Core Components:**

- What information must always appear?
- Which parts can vary?
- Any organizational preferences?

**Polishing Options:**

- Would you like automatic TOC generation?
- Summary section at the end?
- Consistent formatting options?"

#### IF Free-form (Choice 4):

"**Free-form Content Design**

Focus on content with minimal structure:

**Organization Needs:**

- Basic headers for readability?
- Date/title information?
- Any categorization needs?

**Final Polish Options:**

- Auto-generated summary?
- TOC based on content?
- Formatting for readability?"

### 5. Template Creation (if applicable)

For Strict/Structured workflows:

"**Template Creation Approach:**

A. **Design Together** - We'll create the template step by step
B. **AI Proposes** - I'll suggest a structure based on your needs
C. **Import Existing** - Use/upload your existing template

Which approach would you prefer?"

If A or B:

- Design/create template sections
- Define placeholders
- Specify field types and validation
- Document template structure in plan

If C:

- Request file upload or detailed description
- Analyze template structure
- Document requirements

### 6. Document Format Decisions

Append to {workflowPlanFile}:

```markdown
## Output Format Design

**Format Type**: [Strict/Structured/Semi-structured/Free-form]

**Output Requirements**:

- Document type: [report/form/story/etc]
- File format: [PDF/MD/DOCX/etc]
- Frequency: [single/batch/continuous]

**Structure Specifications**:
[Detailed structure based on format type]

**Template Information**:

- Template source: [created/imported/standard]
- Template file: [path if applicable]
- Placeholders: [list if applicable]

**Special Considerations**:

- Legal/compliance requirements
- Validation needs
- Accessibility requirements
```

### 7. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save output format design to {workflowPlanFile}, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and output format is documented will you load {nextStepFile} to begin workflow step design.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User understands format spectrum
- Format type clearly identified
- Template requirements documented (if applicable)
- Output format saved in plan

### ❌ SYSTEM FAILURE:

- Not showing format examples
- Skipping format requirements
- Not documenting decisions in plan
- Assuming format without asking

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
