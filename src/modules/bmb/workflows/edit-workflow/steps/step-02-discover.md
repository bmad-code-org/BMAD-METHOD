---
name: 'step-02-discover'
description: 'Discover improvement goals collaboratively'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/edit-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-02-discover.md'
nextStepFile: '{workflow_path}/steps/step-03-improve.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/workflow-edit-{target_workflow_name}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'

# Template References
goalsTemplate: '{workflow_path}/templates/improvement-goals.md'
---

# Step 2: Discover Improvement Goals

## STEP GOAL:

To collaboratively discover what the user wants to improve and why, before diving into any edits.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a workflow editor and improvement specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You guide discovery with thoughtful questions
- ✅ User brings their context, feedback, and goals

### Step-Specific Rules:

- 🎯 Focus ONLY on understanding improvement goals
- 🚫 FORBIDDEN to suggest specific solutions yet
- 💬 Ask open-ended questions to understand needs
- 🚪 ORGANIZE improvements by priority and impact

## EXECUTION PROTOCOLS:

- 🎯 Guide collaborative discovery conversation
- 💾 Document goals in {outputFile}
- 📖 Update frontmatter `stepsCompleted: [1, 2]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and goals are documented

## CONTEXT BOUNDARIES:

- Analysis from step 1 is available and informs discovery
- Focus areas identified in step 1 guide deeper exploration
- Focus on WHAT to improve and WHY
- Don't discuss HOW to improve yet
- This is about detailed needs assessment, not solution design

## DISCOVERY PROCESS:

### 1. Understand Motivation

Engage in collaborative discovery with open-ended questions:

"What prompted you to want to edit this workflow?"

Listen for:

- User feedback they've received
- Issues they've encountered
- New requirements that emerged
- Changes in user needs or context

### 2. Explore User Experience

Ask about how users interact with the workflow:

"What feedback have you gotten from users running this workflow?"

Probe for:

- Confusing steps or unclear instructions
- Points where users get stuck
- Repetitive or tedious parts
- Missing guidance or context
- Friction in the user journey

### 3. Assess Current Performance

Discuss effectiveness:

"Is the workflow achieving its intended outcome?"

Explore:

- Are users successful with this workflow?
- What are the success/failure rates?
- Where do most users drop off?
- Are there quality issues with outputs?

### 4. Identify Growth Opportunities

Ask about future needs:

"Are there new capabilities you want to add?"

Consider:

- New features or steps
- Integration with other workflows
- Expanded use cases
- Enhanced flexibility

### 5. Evaluate Instruction Style

Discuss communication approach:

"How is the instruction style working for your users?"

Explore:

- Is it too rigid or too loose?
- Should certain steps be more adaptive?
- Do some steps need more specificity?
- Does the style match the workflow's purpose?

### 6. Dive Deeper into Focus Areas

Based on the focus areas identified in step 1, explore more deeply:

#### For User Experience Issues

"Let's explore the user experience issues you mentioned:

- Which specific steps feel clunky or confusing?
- At what points do users get stuck?
- What kind of guidance would help them most?"

#### For Functional Problems

"Tell me more about the functional issues:

- When do errors occur?
- What specific functionality isn't working?
- Are these consistent issues or intermittent?"

#### For New Features

"Let's detail the new features you want:

- What should these features accomplish?
- How should users interact with them?
- Are there examples of similar workflows to reference?"

#### For Compliance Issues

"Let's understand the compliance concerns:

- Which best practices need addressing?
- Are there specific standards to meet?
- What validation would be most valuable?"

### 7. Organize Improvement Opportunities

Based on their responses and your analysis, organize improvements:

**CRITICAL Issues** (blocking successful runs):

- Broken references or missing files
- Unclear or confusing instructions
- Missing essential functionality

**IMPORTANT Improvements** (enhancing user experience):

- Streamlining step flow
- Better guidance and context
- Improved error handling

**NICE-TO-HAVE Enhancements** (for polish):

- Additional validation
- Better documentation
- Performance optimizations

### 8. Prioritize Collaboratively

Work with the user to prioritize:
"Looking at all these opportunities, which ones matter most to you right now?"

Help them consider:

- Impact on users
- Effort to implement
- Dependencies between improvements
- Timeline constraints

## CONTENT TO APPEND TO DOCUMENT:

After discovery, append to {outputFile}:

Load and append the content from {goalsTemplate}

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
- IF C: Save goals to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#8-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and goals are saved to document and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to execute and begin collaborative improvement step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User improvement goals clearly understood
- Issues and opportunities identified
- Priorities established collaboratively
- Goals documented in {outputFile}
- User ready to proceed with improvements

### ❌ SYSTEM FAILURE:

- Skipping discovery dialogue
- Making assumptions about user needs
- Not documenting discovered goals
- Rushing to solutions without understanding

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
