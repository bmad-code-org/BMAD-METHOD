---
name: 'step-10-build-tools'
description: 'Handle build tools availability and generate compiled agent if needed'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-10-build-tools.md'
nextStepFile: '{workflow_path}/steps/step-11-celebrate.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/agent-build-{project_name}.md'
agentFile: '{{output_file_path}}'
compiledAgentFile: '{{output_folder}}/{{agent_filename}}.md'

# Template References
buildHandlingTemplate: '{workflow_path}/templates/build-results.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 10: Build Tools Handling

## STEP GOAL:

Check for BMAD build tools availability and handle agent compilation appropriately based on project context, ensuring agent is ready for activation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a build coordinator who manages agent compilation and deployment readiness
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring build process expertise, user brings their agent vision, together we ensure agent is ready for activation
- ✅ Maintain collaborative technical tone throughout

### Step-Specific Rules:

- 🎯 Focus only on build tools detection and agent compilation handling
- 🚫 FORBIDDEN to proceed without checking build tools availability
- 💬 Approach: Explain compilation process clearly and handle different scenarios gracefully
- 📋 Ensure agent is ready for activation regardless of build tools availability

## EXECUTION PROTOCOLS:

- 🎯 Detect build tools availability automatically
- 💾 Handle agent compilation based on tools availability
- 📖 Explain compilation process and next steps clearly
- 🚫 FORBIDDEN to assume build tools are available without checking

## CONTEXT BOUNDARIES:

- Available context: Complete agent configuration and optional customization
- Focus: Build tools detection and agent compilation handling
- Limits: No agent modifications, only compilation and deployment preparation
- Dependencies: Complete agent files ready for compilation

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Build Tools Detection

Check for BMAD build tools availability and present status:

"I'm checking for BMAD build tools to see if we can compile {{agent_name}} for immediate activation..."

**Detection Results:**
[Check for build tools availability and present appropriate status]

### 2. Build Tools Handling

**Scenario A: Build Tools Available**
"Great! BMAD build tools are available. I can compile {{agent_name}} now for immediate activation."

**Scenario B: Build Tools Not Available**
"No problem! BMAD build tools aren't available right now, but {{agent_name}} is still ready to use. The agent files are complete and will work perfectly when build tools are available."

### 3. Agent Compilation (when possible)

**Compilation Process:**
"When build tools are available, I'll:

- Process all agent configuration files
- Generate optimized runtime version
- Create activation-ready deployment package
- Validate final compilation results"

**Compilation Results:**
[If compilation occurs: "✅ {{agent_name}} compiled successfully and ready for activation!"]

### 4. Deployment Readiness Confirmation

**Always Ready:**
"Good news! {{agent_name}} is ready for deployment:

- **With build tools:** Compiled and optimized for immediate activation
- **Without build tools:** Complete agent files ready, will compile when tools become available

**Next Steps:**
"Regardless of build tools availability, your agent is complete and ready to help users with {{agent_purpose}}."

### 5. Build Status Documentation

#### Content to Append (if applicable):

```markdown
## Agent Build Status

### Build Tools Detection

[Status of build tools availability]

### Compilation Results

[If compiled: Success details, if not: Ready for future compilation]

### Deployment Readiness

Agent is ready for activation regardless of build tools status

### File Locations

[Paths to agent files and compiled version if created]
```

Save this content to `{outputFile}` for reference.

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [build tools handled appropriately with compilation if available], will you then load and read fully `{nextStepFile}` to execute and begin celebration and final guidance.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Build tools availability detected and confirmed
- Agent compilation completed when build tools available
- Agent readiness confirmed regardless of build tools status
- Clear explanation of deployment readiness provided
- User understands next steps for agent activation
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Not checking build tools availability before proceeding
- Failing to compile agent when build tools are available
- Not confirming agent readiness for deployment
- Confusing user about agent availability based on build tools

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
