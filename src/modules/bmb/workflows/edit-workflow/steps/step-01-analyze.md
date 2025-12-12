---
name: 'step-01-analyze'
description: 'Load and deeply understand the target workflow'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/edit-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-01-analyze.md'
nextStepFile: '{workflow_path}/steps/step-02-discover.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/workflow-edit-{target_workflow_name}.md'

# Template References
analysisTemplate: '{workflow_path}/templates/workflow-analysis.md'
---

# Step 1: Workflow Analysis

## STEP GOAL:

To load and deeply understand the target workflow, including its structure, purpose, and potential improvement areas.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow editor and improvement specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring workflow analysis expertise and best practices knowledge
- ✅ User brings their workflow context and improvement needs

### Step-Specific Rules:

- 🎯 Focus ONLY on analysis and understanding, not editing yet
- 🚫 FORBIDDEN to suggest specific changes in this step
- 💬 Ask questions to understand the workflow path
- 🚪 DETECT if this is a new format (standalone) or old format workflow

## EXECUTION PROTOCOLS:

- 🎯 Analyze workflow thoroughly and systematically
- 💾 Document analysis findings in {outputFile}
- 📖 Update frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and analysis is complete

## CONTEXT BOUNDARIES:

- User provides the workflow path to analyze
- Load all workflow documentation for reference
- Focus on understanding current state, not improvements yet
- This is about discovery and analysis

## WORKFLOW ANALYSIS PROCESS:

### 1. Get Workflow Information

Ask the user:
"I need two pieces of information to help you edit your workflow effectively:

1. **What is the path to the workflow you want to edit?**
   - Path to workflow.md file (new format)
   - Path to workflow.yaml file (legacy format)
   - Path to the workflow directory
   - Module and workflow name (e.g., 'bmb/workflows/create-workflow')

2. **What do you want to edit or improve in this workflow?**
   - Briefly describe what you want to achieve
   - Are there specific issues you've encountered?
   - Any user feedback you've received?
   - New features you want to add?

This will help me focus my analysis on what matters most to you."

### 2. Load Workflow Files

Load the target workflow completely:

- workflow.md (or workflow.yaml for old format)
- steps/ directory with all step files
- templates/ directory (if exists)
- data/ directory (if exists)
- Any additional referenced files

### 3. Determine Workflow Format

Detect if this is:

- **New standalone format**: workflow.md with steps/ subdirectory
- **Legacy XML format**: workflow.yaml with instructions.md
- **Mixed format**: Partial migration

### 4. Focused Analysis

Analyze the workflow with attention to the user's stated goals:

#### Initial Goal-Focused Analysis

Based on what the user wants to edit:

- If **user experience issues**: Focus on step clarity, menu patterns, instruction style
- If **functional problems**: Focus on broken references, missing files, logic errors
- If **new features**: Focus on integration points, extensibility, structure
- If **compliance issues**: Focus on best practices, standards, validation

#### Structure Analysis

- Identify workflow type (document, action, interactive, autonomous, meta)
- Count and examine all steps
- Map out step flow and dependencies
- Check for proper frontmatter in all files

#### Content Analysis

- Understand purpose and user journey
- Evaluate instruction style (intent-based vs prescriptive)
- Review menu patterns and user interaction points
- Check variable consistency across files

#### Compliance Analysis

Load reference documentation as needed:

- `{project-root}/.bmad/bmb/docs/workflows/architecture.md`
- `{project-root}/.bmad/bmb/docs/workflows/templates/step-template.md`
- `{project-root}/.bmad/bmb/docs/workflows/templates/workflow-template.md`

Check against best practices:

- Step file size and structure
- Menu handling implementation
- Frontmatter variable usage
- Path reference consistency

### 5. Present Analysis Findings

Share your analysis with the user in a conversational way:

- What this workflow accomplishes (purpose and value)
- How it's structured (type, steps, interaction pattern)
- Format type (new standalone vs legacy)
- Initial findings related to their stated goals
- Potential issues or opportunities in their focus area

### 6. Confirm Understanding and Refine Focus

Ask:
"Based on your goal to {{userGoal}}, I've noticed {{initialFindings}}.
Does this align with what you were expecting? Are there other areas you'd like me to focus on in my analysis?"

This allows the user to:

- Confirm you're on the right track
- Add or modify focus areas
- Clarify any misunderstandings before proceeding

### 7. Final Confirmation

Ask: "Does this analysis cover what you need to move forward with editing?"

## CONTENT TO APPEND TO DOCUMENT:

After analysis, append to {outputFile}:

Load and append the content from {analysisTemplate}

### 8. Present MENU OPTIONS

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
- IF C: Save analysis to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and analysis is saved to document and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to execute and begin improvement discovery step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Target workflow loaded completely
- Analysis performed systematically
- Findings documented clearly
- User confirms understanding
- Analysis saved to {outputFile}

### ❌ SYSTEM FAILURE:

- Skipping analysis steps
- Not loading all workflow files
- Making suggestions without understanding
- Not saving analysis findings

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
