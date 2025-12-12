---
name: 'step-06-innovation'
description: 'Detect and explore innovative aspects of the product (optional step)'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-06-innovation.md'
nextStepFile: '{workflow_path}/steps/step-07-project-type.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd.md'

# Data Files
projectTypesCSV: '{workflow_path}/project-types.csv'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Innovation Discovery

**Progress: Step 6 of 11** - Next: Project Type Analysis

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on detecting and exploring innovative aspects of the product
- 🎯 OPTIONAL STEP: Only proceed if innovation signals are detected

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating innovation content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper innovation insights
- **P (Party Mode)**: Bring creative perspectives to explore innovation opportunities
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml
- When 'P' selected: Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- Project type from step-02 is available for innovation signal matching
- Project-type CSV data will be loaded in this step
- Focus on detecting genuine innovation, not forced creativity

## OPTIONAL STEP CHECK:

Before proceeding with this step, scan for innovation signals:

- Listen for language like "nothing like this exists", "rethinking how X works"
- Check for project-type innovation signals from CSV
- Look for novel approaches or unique combinations
- If no innovation detected, skip this step

## YOUR TASK:

Detect and explore innovation patterns in the product, focusing on what makes it truly novel and how to validate the innovative aspects.

## INNOVATION DISCOVERY SEQUENCE:

### 1. Load Project-Type Innovation Data

Load innovation signals specific to this project type:

- Load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/project-types.csv` completely
- Find the row where `project_type` matches detected type from step-02
- Extract `innovation_signals` (semicolon-separated list)
- Extract `web_search_triggers` for potential innovation research

### 2. Listen for Innovation Indicators

Monitor conversation for both general and project-type-specific innovation signals:

#### General Innovation Language:

- "Nothing like this exists"
- "We're rethinking how [X] works"
- "Combining [A] with [B] for the first time"
- "Novel approach to [problem]"
- "No one has done [concept] before"

#### Project-Type-Specific Signals (from CSV):

Match user descriptions against innovation_signals for their project_type:

- **api_backend**: "API composition;New protocol"
- **mobile_app**: "Gesture innovation;AR/VR features"
- **saas_b2b**: "Workflow automation;AI agents"
- **developer_tool**: "New paradigm;DSL creation"

### 3. Initial Innovation Screening

Ask targeted innovation discovery questions:
"As we explore {{project_name}}, I'm listening for what makes it innovative.

**Innovation Indicators:**

- Are you challenging any existing assumptions about how things work?
- Are you combining technologies or approaches in new ways?
- Is there something about this that hasn't been done before?

What aspects of {{project_name}} feel most innovative to you?"

### 4. Deep Innovation Exploration (If Detected)

If innovation signals are found, explore deeply:

#### Innovation Discovery Questions:

- "What makes it unique compared to existing solutions?"
- "What assumption are you challenging?"
- "How do we validate it works?"
- "What's the fallback if it doesn't?"
- "Has anyone tried this before?"

#### Market Context Research:

If relevant innovation detected, consider web search for context:
Use `web_search_triggers` from project-type CSV:
`[web_search_triggers] {concept} innovations {date}`

### 5. Generate Innovation Content (If Innovation Detected)

Prepare the content to append to the document:

#### Content Structure:

When saving to document, append these Level 2 and Level 3 sections:

```markdown
## Innovation & Novel Patterns

### Detected Innovation Areas

[Innovation patterns identified based on conversation]

### Market Context & Competitive Landscape

[Market context and research based on conversation]

### Validation Approach

[Validation methodology based on conversation]

### Risk Mitigation

[Innovation risks and fallbacks based on conversation]
```

### 6. Present Content and Menu (Only if Innovation Detected)

Show the generated innovation content and present choices:
"I've identified some innovative aspects of {{project_name}} that differentiate it from existing solutions.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**What would you like to do?**
[A] Advanced Elicitation - Let's dive deeper into these innovation opportunities
[P] Party Mode - Bring creative perspectives to explore innovation further
[C] Continue - Save this and move to Project Type Analysis (Step 7 of 11)"

### 7. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Execute {project-root}/.bmad/core/tasks/advanced-elicitation.xml with the current innovation content
- Process the enhanced innovation insights that come back
- Ask user: "Accept these improvements to the innovation analysis? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Execute {project-root}/.bmad/core/workflows/party-mode/workflow.md with the current innovation content
- Process the collaborative innovation exploration and ideation
- Ask user: "Accept these changes to the innovation analysis? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Append the final content to `{output_folder}/prd.md`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6]`
- Load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-07-project-type.md`

## NO INNOVATION DETECTED:

If no genuine innovation signals are found after exploration:
"After exploring {{project_name}}, I don't see clear innovation signals that warrant a dedicated innovation section. This is perfectly fine - many successful products are excellent executions of existing concepts rather than breakthrough innovations.

**Options:**
[A] Force innovation exploration - Let's try to find innovative angles
[C] Continue - Skip innovation section and move to Project Type Analysis (Step 7 of 11)"

If user selects 'A', proceed with content generation anyway. If 'C', skip this step and load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-07-project-type.md`.

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 5.

## SUCCESS METRICS:

✅ Innovation signals properly detected from user conversation
✅ Project-type innovation signals used to guide discovery
✅ Genuine innovation explored (not forced creativity)
✅ Validation approach clearly defined for innovative aspects
✅ Risk mitigation strategies identified
✅ A/P/C menu presented and handled correctly
✅ Content properly appended to document when C selected

## FAILURE MODES:

❌ Forced innovation when none genuinely exists
❌ Not using project-type innovation signals from CSV
❌ Missing market context research for novel concepts
❌ Not addressing validation approach for innovative features
❌ Creating innovation theater without real innovative aspects
❌ Not presenting A/P/C menu after content generation
❌ Appending content without user selecting 'C'

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## SKIP CONDITIONS:

Skip this step and load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-07-project-type.md` if:

- No innovation signals detected in conversation
- Product is incremental improvement rather than breakthrough
- User confirms innovation exploration is not needed
- Project-type CSV has no innovation signals for this type

## NEXT STEP:

After user selects 'C' and content is saved to document (or step is skipped), load `{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd/steps/step-07-project-type.md`.

Remember: Do NOT proceed to step-07 until user explicitly selects 'C' from the A/P/C menu (or confirms step skip)!
